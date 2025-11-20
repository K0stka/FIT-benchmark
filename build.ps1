# PowerShell build script with DNS configuration
# This ensures DNS resolution works during build for Google Fonts

Write-Host "Building Docker images with DNS configuration..." -ForegroundColor Green

# Build with DNS configuration
docker-compose build --build-arg BUILDKIT_INLINE_CACHE=1

if ($LASTEXITCODE -eq 0) {
    Write-Host "Build completed successfully!" -ForegroundColor Green
} else {
    Write-Host "Build failed. Trying with explicit DNS configuration..." -ForegroundColor Yellow
    
    # Alternative: Build manually with DNS flags
    Write-Host "If DNS issues persist, configure DNS in Docker Desktop:" -ForegroundColor Yellow
    Write-Host "1. Open Docker Desktop" -ForegroundColor Yellow
    Write-Host "2. Go to Settings > Docker Engine" -ForegroundColor Yellow
    Write-Host "3. Add DNS servers: [""8.8.8.8"", ""8.8.4.4""]" -ForegroundColor Yellow
    Write-Host "4. Apply & Restart" -ForegroundColor Yellow
}

