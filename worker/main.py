import os
import time
import logging
import shutil
import tempfile
from datetime import datetime, timezone
import docker
import psycopg2
from psycopg2.extras import RealDictCursor
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Configuration
DATABASE_URL = os.getenv("DATABASE_URL")
UPLOAD_DIR = os.getenv("UPLOAD_DIR", os.path.join(os.getcwd(), "uploads"))
DOCKER_IMAGE_NAME = "benchmark-runner:latest"
RUNNER_DOCKERFILE_PATH = os.path.join(os.getcwd(), "worker")

def get_db_connection():
    try:
        return psycopg2.connect(DATABASE_URL, cursor_factory=RealDictCursor)
    except Exception as e:
        logger.error(f"Failed to connect to database: {e}")
        return None

def ensure_runner_image(client):
    try:
        client.images.get(DOCKER_IMAGE_NAME)
        logger.info(f"Found {DOCKER_IMAGE_NAME}")
    except docker.errors.ImageNotFound:
        logger.info(f"Image {DOCKER_IMAGE_NAME} not found. Building...")
        try:
            # Assuming the Dockerfile is at worker/runner.Dockerfile
            # and context is the current directory or worker directory?
            # The original code ran "docker build -t ... -f worker/Dockerfile ." from project root.
            # We should do similar.
            client.images.build(
                path=".",
                dockerfile="worker/runner.Dockerfile",
                tag=DOCKER_IMAGE_NAME,
                rm=True
            )
            logger.info(f"Built {DOCKER_IMAGE_NAME}")
        except Exception as e:
            logger.error(f"Failed to build image: {e}")
            raise

def get_file_path(file_id):
    # Based on lib/storage.ts, filename is just the ID
    return os.path.join(UPLOAD_DIR, str(file_id))

def process_job(job, db_conn, docker_client):
    job_id = job['id']
    logger.info(f"Processing job {job_id}")
    
    work_dir = tempfile.mkdtemp(prefix=f"benchmark-job-{job_id}-")
    logger.info(f"Created work dir: {work_dir}")
    
    # Update status to running
    try:
        with db_conn.cursor() as cur:
            cur.execute(
                "UPDATE benchmark_queue_jobs SET status = 'running', started_at = %s WHERE id = %s",
                (datetime.now(timezone.utc), job_id)
            )
        db_conn.commit()
    except Exception as e:
        logger.error(f"Failed to update job status: {e}")
        shutil.rmtree(work_dir)
        return

    try:
        # Fetch detailed info
        with db_conn.cursor() as cur:
            # Get Benchmark
            cur.execute("SELECT * FROM benchmarks WHERE id = %s", (job['benchmark_id'],))
            benchmark = cur.fetchone()
            
            # Get Steps
            cur.execute("SELECT * FROM benchmark_steps WHERE benchmark_id = %s ORDER BY \"order\" ASC", (job['benchmark_id'],))
            steps = cur.fetchall()
            for step in steps:
                cur.execute("SELECT * FROM benchmark_assets WHERE benchmark_step_id = %s", (step['id'],))
                step['assets'] = cur.fetchall()
            
            # Get Test Cases
            cur.execute("SELECT * FROM test_cases WHERE benchmark_id = %s ORDER BY \"order\" ASC", (job['benchmark_id'],))
            test_cases = cur.fetchall()
            for tc in test_cases:
                cur.execute("SELECT * FROM test_case_assets WHERE test_case_id = %s", (tc['id'],))
                tc['assets'] = cur.fetchall()

        # 1. Prepare files
        # Copy source file
        source_path = get_file_path(job['submitted_file_id'])
        shutil.copy(source_path, os.path.join(work_dir, "main.c"))
        
        # Copy benchmark step assets
        for step in steps:
            for asset in step['assets']:
                asset_path = get_file_path(asset['file_id'])
                shutil.copy(asset_path, os.path.join(work_dir, asset['filename']))

        # 2. Run Benchmark Steps
        all_steps_passed = True
        step_results = []
        
        for step in steps:
            logger.info(f"Running step: {step['name']}")
            command = step['command_template'].replace("{{file}}", "main.c")
            
            start_time = time.time()
            status = "completed"
            
            try:
                # Docker run
                # Security:
                # - network_disabled=True
                # - mem_limit='512m'
                # - pids_limit=100
                # - cap_drop=['ALL']
                # - user='benchmark' (1000:1000) -> but need to ensure work_dir is writable.
                # Since we mount work_dir from host, we need to make sure permissions are okay.
                # Simple fix: chmod 777 work_dir (risky?) or ensure uid matches.
                # For now, let's try running as root inside container but limited caps, 
                # OR just rely on the container user.
                # If runner image has USER benchmark, we need to ensure work_dir is owned by 1000.
                os.chmod(work_dir, 0o777) 
                for root, dirs, files in os.walk(work_dir):
                    for d in dirs:
                        os.chmod(os.path.join(root, d), 0o777)
                    for f in files:
                        os.chmod(os.path.join(root, f), 0o666)

                container = docker_client.containers.run(
                    DOCKER_IMAGE_NAME,
                    command=f'/bin/sh -c "{command}"',
                    volumes={work_dir: {'bind': '/app', 'mode': 'rw'}},
                    working_dir='/app',
                    network_disabled=True,
                    mem_limit='512m',
                    pids_limit=100,
                    cap_drop=['ALL'],
                    detach=True
                )
                
                exit_code = container.wait(timeout=step['timeout_seconds'])
                logs = container.logs()
                container.remove()
                
                if exit_code['StatusCode'] != 0:
                    logger.error(f"Step failed with code {exit_code['StatusCode']}")
                    status = "error"
                    all_steps_passed = False
                    
            except Exception as e:
                logger.error(f"Step execution error: {e}")
                status = "timed_out" if "Read timed out" in str(e) else "error" # docker-py timeout
                # Kill container if it's still running (timeout)
                try:
                    container.kill()
                    container.remove()
                except:
                    pass
                all_steps_passed = False

            duration_ms = int((time.time() - start_time) * 1000)
            
            step_results.append({
                'benchmark_step_id': step['id'],
                'status': status,
                'execution_time_milliseconds': duration_ms
            })
            
            if not all_steps_passed:
                break

        # 3. Run Test Cases
        test_case_results = []
        test_case_status = "all_passed"
        total_score = 0
        
        if all_steps_passed:
            for tc in test_cases:
                logger.info(f"Running test case: {tc['name']}")
                
                # Copy test case assets
                for asset in tc['assets']:
                    asset_path = get_file_path(asset['file_id'])
                    shutil.copy(asset_path, os.path.join(work_dir, asset['filename']))
                
                # Prepare input
                with open(os.path.join(work_dir, "input.in"), "w") as f:
                    f.write(tc['input'] or "")
                
                command = tc['test_command_template'].replace("{{file}}", "main.c")
                
                # Phase 1: Performance & Correctness
                start_time = time.time()
                status = "passed"
                stdout = ""
                
                try:
                    # We need to chmod again for new files?
                    os.chmod(os.path.join(work_dir, "input.in"), 0o666)
                    
                    container = docker_client.containers.run(
                        DOCKER_IMAGE_NAME,
                        command=f'/bin/sh -c "{command} < input.in"',
                        volumes={work_dir: {'bind': '/app', 'mode': 'rw'}},
                        working_dir='/app',
                        network_disabled=True,
                        mem_limit='512m',
                        pids_limit=100,
                        cap_drop=['ALL'],
                        detach=True
                    )
                    
                    exit_code = container.wait(timeout=tc['timeout_seconds'])
                    stdout = container.logs(stdout=True, stderr=False).decode('utf-8', errors='ignore')
                    container.remove()
                    
                    if exit_code['StatusCode'] != 0:
                        status = "error"
                
                except Exception as e:
                    logger.error(f"Test case execution error: {e}")
                    status = "timed_out" if "Read timed out" in str(e) else "error"
                    try:
                        container.kill()
                        container.remove()
                    except:
                        pass
                
                duration_ms = int((time.time() - start_time) * 1000)
                
                # Check Correctness
                if status == "passed":
                    expected = (tc['expected_output'] or "").strip()
                    actual = stdout.strip()
                    if expected != actual:
                        status = "failed"
                
                # Phase 2: Valgrind (Memory Safety)
                if status == "passed":
                    valgrind_cmd = f'valgrind --leak-check=full --error-exitcode=1 {command} < input.in'
                    try:
                        container = docker_client.containers.run(
                            DOCKER_IMAGE_NAME,
                            command=f'/bin/sh -c "{valgrind_cmd}"',
                            volumes={work_dir: {'bind': '/app', 'mode': 'rw'}},
                            working_dir='/app',
                            network_disabled=True,
                            mem_limit='512m',
                            pids_limit=100,
                            cap_drop=['ALL'],
                            detach=True
                        )
                        # Give more time for valgrind
                        exit_code = container.wait(timeout=tc['timeout_seconds'] * 2)
                        container.remove()
                        
                        if exit_code['StatusCode'] == 1:
                            status = "memory_error"
                        elif exit_code['StatusCode'] != 0:
                            status = "error"
                            
                    except Exception as e:
                         logger.error(f"Valgrind error: {e}")
                         status = "timed_out" if "Read timed out" in str(e) else "error"
                         try:
                            container.kill()
                            container.remove()
                         except:
                            pass

                test_case_results.append({
                    'test_case_id': tc['id'],
                    'status': status,
                    'execution_time_milliseconds': duration_ms,
                    'memory_usage_bytes': 0 # Parsing not implemented
                })
                
                if status != "passed":
                    test_case_status = "some_failed"
        else:
            test_case_status = "all_failed"

        if all_steps_passed and any(r['status'] == 'passed' for r in test_case_results) and any(r['status'] != 'passed' for r in test_case_results):
             test_case_status = "some_failed"
        elif all_steps_passed and all(r['status'] == 'passed' for r in test_case_results) and len(test_case_results) > 0:
             test_case_status = "all_passed"
        elif all_steps_passed and all(r['status'] != 'passed' for r in test_case_results):
             test_case_status = "all_failed"


        # 4. Save Results
        score = len([r for r in test_case_results if r['status'] == 'passed'])
        
        with db_conn.cursor() as cur:
            # Insert BenchmarkResult
            cur.execute(
                """
                INSERT INTO benchmark_results 
                (benchmark_id, submitted_by, submitted_file_id, submitted_at, score, test_case_status)
                VALUES (%s, %s, %s, %s, %s, %s)
                RETURNING id
                """,
                (job['benchmark_id'], job['requested_by'], job['submitted_file_id'], datetime.now(timezone.utc), score, test_case_status)
            )
            result_id = cur.fetchone()['id']
            
            # Insert Step Results
            for sr in step_results:
                cur.execute(
                    """
                    INSERT INTO benchmark_step_results
                    (benchmark_result_id, benchmark_step_id, status, execution_time_milliseconds)
                    VALUES (%s, %s, %s, %s)
                    """,
                    (result_id, sr['benchmark_step_id'], sr['status'], sr['execution_time_milliseconds'])
                )
                
            # Insert Test Case Results
            for tr in test_case_results:
                cur.execute(
                    """
                    INSERT INTO test_case_results
                    (benchmark_result_id, test_case_id, status, execution_time_milliseconds, memory_usage_bytes)
                    VALUES (%s, %s, %s, %s, %s)
                    """,
                    (result_id, tr['test_case_id'], tr['status'], tr['execution_time_milliseconds'], tr['memory_usage_bytes'])
                )
                
            # Update Job
            cur.execute(
                """
                UPDATE benchmark_queue_jobs
                SET status = 'completed', finished_at = %s, benchmark_result_id = %s
                WHERE id = %s
                """,
                (datetime.now(timezone.utc), result_id, job_id)
            )
        
        db_conn.commit()
        logger.info(f"Job {job_id} completed.")

    except Exception as e:
        logger.error(f"Job {job_id} failed: {e}")
        db_conn.rollback()
        with db_conn.cursor() as cur:
             cur.execute(
                "UPDATE benchmark_queue_jobs SET status = 'failed', finished_at = %s WHERE id = %s",
                (datetime.now(timezone.utc), job_id)
            )
        db_conn.commit()
    finally:
        # Cleanup
        shutil.rmtree(work_dir, ignore_errors=True)


def main():
    logger.info("Starting Worker (Python)...")
    
    # Initialize Docker Client with retry logic
    max_retries = 5
    for i in range(max_retries):
        try:
            # Explicitly use DOCKER_HOST from env if available, though docker.from_env() does this.
            # Sometimes on startup, dind isn't ready yet.
            client = docker.from_env()
            client.ping() # Test connection
            ensure_runner_image(client)
            break
        except Exception as e:
            logger.warning(f"Docker initialization failed (attempt {i+1}/{max_retries}): {e}")
            if i == max_retries - 1:
                logger.critical(f"Docker initialization gave up: {e}")
                return # Or exit(1) to restart container
            time.sleep(5)

    while True:
        conn = get_db_connection()
        if not conn:
            time.sleep(5)
            continue
            
        try:
            # Poll for job
            with conn.cursor() as cur:
                cur.execute(
                    """
                    SELECT * FROM benchmark_queue_jobs 
                    WHERE status = 'waiting' 
                    ORDER BY submitted_at ASC 
                    LIMIT 1
                    FOR UPDATE SKIP LOCKED
                    """
                )
                job = cur.fetchone()
            
            if job:
                process_job(job, conn, client)
            else:
                time.sleep(2)
                
        except Exception as e:
            logger.error(f"Error in worker loop: {e}")
            time.sleep(5)
        finally:
            if conn:
                conn.close()

if __name__ == "__main__":
    main()

