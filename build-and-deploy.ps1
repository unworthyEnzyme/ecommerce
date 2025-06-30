# PowerShell script to build frontend and deploy to backend
param(
  [switch]$SkipBuild,
  [switch]$Verbose
)

# Set error action preference
$ErrorActionPreference = "Stop"

# Define paths
$FrontendPath = Join-Path $PSScriptRoot "frontend"
$BackendPath = Join-Path $PSScriptRoot "Backend\ECommerceApp.API"
$FrontendBuildPath = Join-Path $FrontendPath "build\client"
$BackendWwwRootPath = Join-Path $BackendPath "wwwroot"
$BackendAssetsPath = Join-Path $BackendWwwRootPath "assets"

Write-Host "Starting frontend build and deployment process..." -ForegroundColor Green

# Function to write verbose output
function Write-VerboseOutput {
  param([string]$Message)
  if ($Verbose) {
    Write-Host $Message -ForegroundColor Yellow
  }
}

# Function to get MIME type based on file extension
function Get-MimeType {
  param([string]$FilePath)
  
  $extension = [System.IO.Path]::GetExtension($FilePath).ToLower()
  
  switch ($extension) {
    ".html" { return "text/html" }
    ".htm" { return "text/html" }
    ".css" { return "text/css" }
    ".js" { return "text/javascript" }
    ".json" { return "application/json" }
    ".png" { return "image/png" }
    ".jpg" { return "image/jpeg" }
    ".jpeg" { return "image/jpeg" }
    ".gif" { return "image/gif" }
    ".svg" { return "image/svg+xml" }
    ".ico" { return "image/x-icon" }
    ".woff" { return "font/woff" }
    ".woff2" { return "font/woff2" }
    ".ttf" { return "font/ttf" }
    ".eot" { return "application/vnd.ms-fontobject" }
    ".otf" { return "font/otf" }
    ".mp4" { return "video/mp4" }
    ".webm" { return "video/webm" }
    ".mp3" { return "audio/mpeg" }
    ".wav" { return "audio/wav" }
    ".pdf" { return "application/pdf" }
    ".txt" { return "text/plain" }
    ".xml" { return "application/xml" }
    ".zip" { return "application/zip" }
    default { return "application/octet-stream" }
  }
}

try {
  # Check if bun is installed
  Write-Host "Checking if bun is installed..." -ForegroundColor Cyan
  $bunVersion = bun --version 2>$null
  if (-not $bunVersion) {
    throw "Bun is not installed or not in PATH. Please install bun first."
  }
  Write-VerboseOutput "Bun version: $bunVersion"

  # Navigate to frontend directory
  Write-Host "Navigating to frontend directory..." -ForegroundColor Cyan
  if (-not (Test-Path $FrontendPath)) {
    throw "Frontend directory not found: $FrontendPath"
  }
  Set-Location $FrontendPath

  # Install dependencies if needed
  if (-not (Test-Path "node_modules") -or -not $SkipBuild) {
    Write-Host "Installing frontend dependencies..." -ForegroundColor Cyan
    bun install
    if ($LASTEXITCODE -ne 0) {
      throw "Failed to install frontend dependencies"
    }
  }

  # Build frontend
  if (-not $SkipBuild) {
    Write-Host "Building frontend with bun..." -ForegroundColor Cyan
    bun run build
    if ($LASTEXITCODE -ne 0) {
      throw "Failed to build frontend"
    }
  }

  # Check if build directory exists
  if (-not (Test-Path $FrontendBuildPath)) {
    throw "Frontend build directory not found: $FrontendBuildPath"
  }

  # Navigate back to root
  Set-Location $PSScriptRoot

  # Create backend wwwroot directory if it doesn't exist
  Write-Host "Preparing backend directories..." -ForegroundColor Cyan
  if (-not (Test-Path $BackendWwwRootPath)) {
    New-Item -Path $BackendWwwRootPath -ItemType Directory -Force
    Write-VerboseOutput "Created wwwroot directory: $BackendWwwRootPath"
  }

  if (-not (Test-Path $BackendAssetsPath)) {
    New-Item -Path $BackendAssetsPath -ItemType Directory -Force
    Write-VerboseOutput "Created assets directory: $BackendAssetsPath"
  }

  # Copy index.html directly to wwwroot
  Write-Host "Copying index.html to backend..." -ForegroundColor Cyan
  $indexSource = Join-Path $FrontendBuildPath "index.html"
  if (Test-Path $indexSource) {
    Copy-Item $indexSource $BackendWwwRootPath -Force
    Write-VerboseOutput "Copied index.html to $BackendWwwRootPath"
  }
  else {
    Write-Warning "index.html not found in build output"
  }

  # Copy all other assets to the assets folder
  Write-Host "Copying frontend assets to backend..." -ForegroundColor Cyan
    
  # Get all files except index.html
  $frontendAssets = Get-ChildItem $FrontendBuildPath -Recurse -File | Where-Object { $_.Name -ne "index.html" }
    
  foreach ($asset in $frontendAssets) {
    # Calculate relative path from build directory
    $relativePath = $asset.FullName.Substring($FrontendBuildPath.Length + 1)
    
    # If the file is in the assets folder, remove the "assets/" prefix to avoid double nesting
    if ($relativePath.StartsWith("assets\")) {
      $relativePath = $relativePath.Substring(7) # Remove "assets\" prefix
    }
    
    $destinationPath = Join-Path $BackendAssetsPath $relativePath
        
    # Create destination directory if it doesn't exist
    $destinationDir = Split-Path $destinationPath -Parent
    if (-not (Test-Path $destinationDir)) {
      New-Item -Path $destinationDir -ItemType Directory -Force
      Write-VerboseOutput "Created directory: $destinationDir"
    }
        
    # Copy the file
    Copy-Item $asset.FullName $destinationPath -Force
    Write-VerboseOutput "Copied: $relativePath"
    
    # Create corresponding .mime file
    $mimeType = Get-MimeType $asset.Name
    $mimeFilePath = "$destinationPath.mime"
    Set-Content -Path $mimeFilePath -Value $mimeType
  }

  Write-Host "Frontend build and deployment completed successfully!" -ForegroundColor Green
  Write-Host "Files deployed to: $BackendWwwRootPath" -ForegroundColor Green
  Write-Host "Assets deployed to: $BackendAssetsPath" -ForegroundColor Green

}
catch {
  Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
  exit 1
}
finally {
  # Return to original directory
  Set-Location $PSScriptRoot
}
