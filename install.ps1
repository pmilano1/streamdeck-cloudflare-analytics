# Cloudflare Analytics Stream Deck Plugin - Installation Script

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Cloudflare Analytics Plugin Setup" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
Write-Host "Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js $nodeVersion found" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js not found. Please install Node.js 20+ from https://nodejs.org" -ForegroundColor Red
    exit 1
}

# Install dependencies
Write-Host ""
Write-Host "Installing dependencies..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Failed to install dependencies" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Dependencies installed" -ForegroundColor Green

# Build the plugin
Write-Host ""
Write-Host "Building plugin..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Build failed" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Plugin built successfully" -ForegroundColor Green

# Install to Stream Deck
Write-Host ""
Write-Host "Installing to Stream Deck..." -ForegroundColor Yellow

$streamDeckPluginsPath = "$env:APPDATA\Elgato\StreamDeck\Plugins"
$pluginName = "com.milanese.cloudflare-analytics.sdPlugin"
$sourcePath = Join-Path $PSScriptRoot $pluginName
$destPath = Join-Path $streamDeckPluginsPath $pluginName

# Create plugins directory if it doesn't exist
if (-not (Test-Path $streamDeckPluginsPath)) {
    New-Item -ItemType Directory -Path $streamDeckPluginsPath -Force | Out-Null
}

# Remove old version if exists
if (Test-Path $destPath) {
    Write-Host "Removing old version..." -ForegroundColor Yellow
    Remove-Item -Path $destPath -Recurse -Force
}

# Copy plugin
Write-Host "Copying plugin files..." -ForegroundColor Yellow
Copy-Item -Path $sourcePath -Destination $destPath -Recurse -Force

Write-Host "✓ Plugin installed to: $destPath" -ForegroundColor Green

# Final instructions
Write-Host ""
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Installation Complete!" -ForegroundColor Green
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Restart Stream Deck application" -ForegroundColor White
Write-Host "2. Find 'Cloudflare Stats' in the actions list" -ForegroundColor White
Write-Host "3. Drag it to a button" -ForegroundColor White
Write-Host "4. Configure with your Cloudflare API token and Zone ID" -ForegroundColor White
Write-Host ""
Write-Host "See SETUP.md for detailed configuration instructions" -ForegroundColor Cyan
Write-Host ""

