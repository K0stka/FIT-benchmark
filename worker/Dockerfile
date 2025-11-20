FROM python:3.11-slim

WORKDIR /app

# Install system dependencies for psycopg2 if needed (usually binary covers it, but slim might miss some libs)
# psycopg2-binary usually works.

COPY worker/requirements.txt worker/
RUN pip install --no-cache-dir -r worker/requirements.txt

# Copy worker code and runner Dockerfile
COPY worker/main.py worker/
COPY worker/runner.Dockerfile worker/

# Set python path or run from root
ENV PYTHONPATH=/app

# Run the worker
CMD ["python", "worker/main.py"]
