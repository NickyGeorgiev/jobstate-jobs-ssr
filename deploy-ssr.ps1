# deploy-ssr.ps1
# Run from the root of the SSR project.

$ErrorActionPreference = "Stop"

function Fail($msg) {
    Write-Host $msg -ForegroundColor Red
    exit 1
}

if (-not (Test-Path "next.config.ts")) {
    Fail "next.config.ts was not found. Run this script from the SSR project root."
}

Write-Host "1/3  Building (npm run build)..." -ForegroundColor Cyan

npm run build

if ($LASTEXITCODE -ne 0) {
    Fail "Build failed. Fix the error above before continuing."
}

Write-Host "2/3  Preparing deploy folder..." -ForegroundColor Cyan

if (-not (Test-Path ".next\standalone")) {
    Fail "Missing .next\standalone. Check that output: 'standalone' is set in next.config.ts."
}

if (Test-Path "deploy") {
    Remove-Item -Recurse -Force "deploy"
}

New-Item -ItemType Directory "deploy" | Out-Null

Copy-Item -Recurse -Force ".next\standalone\*" "deploy\"

if (Test-Path ".next\static") {
    New-Item -ItemType Directory "deploy\.next" -Force | Out-Null
    Copy-Item -Recurse -Force ".next\static" "deploy\.next\static"
}

if (Test-Path "public") {
    Copy-Item -Recurse -Force "public" "deploy\public"
}

Write-Host "3/3  Done." -ForegroundColor Green
Write-Host ""
Write-Host "Deploy folder is ready:" -ForegroundColor Green
Write-Host (Resolve-Path "deploy") -ForegroundColor Green
Write-Host ""
Write-Host "Upload the CONTENTS of the deploy folder to the server using FileZilla." -ForegroundColor Yellow
Write-Host "Then restart the Node.js application." -ForegroundColor Yellow