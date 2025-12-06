param(
    [Parameter(Mandatory=$true)]
    [string]$Username
)

$ErrorActionPreference = "Stop"

# Configuration
$RemoteHost = "epic.iitd.ac.in"
$RemotePath = "/var/www/epic/https"
$BuildDir = "dist"
$ArchiveName = "dist.zip"

Write-Host "🚀 Starting EPIC Website Deployment (Windows)" -ForegroundColor Green
Write-Host "📡 User: $Username@$RemoteHost" -ForegroundColor Green

# Step 1: Clean previous build
Write-Host "📦 Cleaning previous build..." -ForegroundColor Yellow
if (Test-Path $BuildDir) { Remove-Item -Recurse -Force $BuildDir }
if (Test-Path $ArchiveName) { Remove-Item -Force $ArchiveName }

# Step 2: Build the project
Write-Host "🔨 Building the project..." -ForegroundColor Yellow
# Use cmd /c to run npm to avoid PowerShell execution policy issues with npm.cmd
cmd /c "npm run build"
if ($LASTEXITCODE -ne 0) {
    Write-Error "❌ Build failed!"
    exit 1
}
Write-Host "✅ Build successful!" -ForegroundColor Green

# Step 3: Create zip archive
Write-Host "📦 Creating zip archive..." -ForegroundColor Yellow
if (-not (Test-Path $BuildDir)) {
    Write-Error "❌ Build directory not found!"
    exit 1
}
Compress-Archive -Path "$BuildDir" -DestinationPath $ArchiveName -Force
Write-Host "✅ Archive created!" -ForegroundColor Green

# Step 4: Upload to server
Write-Host "📤 Uploading to server..." -ForegroundColor Yellow
Write-Host "(You may be prompted for your password)" -ForegroundColor Yellow
scp $ArchiveName "$($Username)@$($RemoteHost):$RemotePath/"
if ($LASTEXITCODE -ne 0) {
    Write-Error "❌ Upload failed!"
    exit 1
}
Write-Host "✅ Upload successful!" -ForegroundColor Green

# Step 5: Deploy on server
Write-Host "🔄 Deploying on server..." -ForegroundColor Yellow
Write-Host "(You may be prompted for your password again)" -ForegroundColor Yellow

# Commands to run on the remote server
# We use single quotes for the outer string to avoid variable expansion by PowerShell
# But we need to insert the archive name variable, so we use format string or concatenation
$RemoteCommands = "cd $RemotePath; " +
    "if [ -d 'html' ]; then " +
    "  BACKUP_NAME='html_backup_$(date +%Y%m%d_%H%M%S)'; " +
    "  mv html `$BACKUP_NAME; " +
    "  echo 'Backup created: `$BACKUP_NAME'; " +
    "fi; " +
    "unzip -o $ArchiveName; " +
    "rm -rf html; " +
    "mv $BuildDir html; " +
    "rm $ArchiveName; " +
    "exit"

ssh -t "$($Username)@$($RemoteHost)" $RemoteCommands

if ($LASTEXITCODE -ne 0) {
    Write-Error "❌ Deployment failed!"
    exit 1
}

Write-Host "✅ Deployment completed successfully!" -ForegroundColor Green
