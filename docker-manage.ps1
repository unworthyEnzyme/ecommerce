# PowerShell script to build and run the entire application stack
param(
  [switch]$Build,
  [switch]$Up,
  [switch]$Down,
  [switch]$Logs,
  [switch]$CleanBuild,
  [string]$Service = ""
)

$ErrorActionPreference = "Stop"

# Define Docker Compose file path
$DockerComposePath = Join-Path $PSScriptRoot "docker-compose.yml"

Write-Host "Docker Management Script for ECommerce Application" -ForegroundColor Green

try {
  # Check if Docker is running
  docker version >$null 2>&1
  if ($LASTEXITCODE -ne 0) {
    throw "Docker is not running or not installed. Please start Docker Desktop."
  }

  # Build frontend first if -Build is specified
  if ($Build) {
    Write-Host "Building frontend..." -ForegroundColor Cyan
    & "$PSScriptRoot\build-and-deploy.ps1" -Verbose
    if ($LASTEXITCODE -ne 0) {
      throw "Frontend build failed"
    }
  }

  # Handle different operations
  if ($Down) {
    Write-Host "Stopping and removing containers..." -ForegroundColor Yellow
    docker-compose -f $DockerComposePath down
    if ($CleanBuild) {
      Write-Host "Removing volumes..." -ForegroundColor Yellow
      docker-compose -f $DockerComposePath down -v
      Write-Host "Pruning unused images..." -ForegroundColor Yellow
      docker image prune -f
    }
  }
  elseif ($Up) {
    Write-Host "Starting services..." -ForegroundColor Cyan
    if ($CleanBuild) {
      docker-compose -f $DockerComposePath up --build -d
    }
    else {
      docker-compose -f $DockerComposePath up -d
    }
        
    Write-Host "Services started successfully!" -ForegroundColor Green
    Write-Host "API available at: http://localhost:8080" -ForegroundColor Cyan
    Write-Host "RabbitMQ Management at: http://localhost:15672 (admin/password)" -ForegroundColor Cyan
    Write-Host "SQL Server at: localhost:1433 (sa/YourStrong!Passw0rd)" -ForegroundColor Cyan
  }
  elseif ($Logs) {
    if ($Service) {
      Write-Host "Showing logs for service: $Service" -ForegroundColor Cyan
      docker-compose -f $DockerComposePath logs -f $Service
    }
    else {
      Write-Host "Showing logs for all services..." -ForegroundColor Cyan
      docker-compose -f $DockerComposePath logs -f
    }
  }
  elseif ($Build) {
    Write-Host "Building Docker images..." -ForegroundColor Cyan
    docker-compose -f $DockerComposePath build
  }
  else {
    Write-Host "Usage:" -ForegroundColor Yellow
    Write-Host "  .\docker-manage.ps1 -Build              # Build frontend and Docker images" -ForegroundColor White
    Write-Host "  .\docker-manage.ps1 -Up                 # Start all services" -ForegroundColor White
    Write-Host "  .\docker-manage.ps1 -Up -CleanBuild     # Rebuild and start all services" -ForegroundColor White
    Write-Host "  .\docker-manage.ps1 -Down               # Stop all services" -ForegroundColor White
    Write-Host "  .\docker-manage.ps1 -Down -CleanBuild   # Stop services and clean volumes" -ForegroundColor White
    Write-Host "  .\docker-manage.ps1 -Logs               # Show logs for all services" -ForegroundColor White
    Write-Host "  .\docker-manage.ps1 -Logs -Service api  # Show logs for specific service" -ForegroundColor White
    Write-Host ""
    Write-Host "Example workflow:" -ForegroundColor Yellow
    Write-Host "  .\docker-manage.ps1 -Build -Up          # Build everything and start" -ForegroundColor White
  }

}
catch {
  Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
  exit 1
}
