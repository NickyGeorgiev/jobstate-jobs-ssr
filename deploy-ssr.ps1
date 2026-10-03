# deploy-ssr.ps1
# Пуска се от корена на SSR проекта (там, където е next.config.ts).
# Прави всичко от "npm run build" до готов deploy.zip, готов за качване.
# Самото качване през FileZilla/cPanel си остава ръчно, последна стъпка.

$ErrorActionPreference = "Stop"

function Fail($msg) {
    Write-Host $msg -ForegroundColor Red
    exit 1
}

if (-not (Test-Path "next.config.ts")) {
    Fail "Не виждам next.config.ts тук — пусни скрипта от корена на SSR проекта."
}

Write-Host "1/4  Билдвам (npm run build)..." -ForegroundColor Cyan
npm run build
if ($LASTEXITCODE -ne 0) {
    Fail "Билдът гръмна — виж грешката по-горе и не продължавай, докато не се оправи."
}

Write-Host "2/4  Събирам deploy папката..." -ForegroundColor Cyan
if (-not (Test-Path ".next\standalone")) {
    Fail "Липсва .next\standalone — провери дали output: 'standalone' е в next.config.ts."
}
if (Test-Path "deploy") { Remove-Item -Recurse -Force "deploy" }
New-Item -ItemType Directory "deploy" | Out-Null
Copy-Item -Recurse -Force ".next\standalone\*" "deploy\"
Copy-Item -Recurse -Force ".next\static" "deploy\.next\static"
Copy-Item -Recurse -Force "public" "deploy\public"

Write-Host "3/4  Архивирам в deploy.zip..." -ForegroundColor Cyan
$zipPath = "deploy.zip"
if (Test-Path $zipPath) { Remove-Item -Force $zipPath }
Compress-Archive -Path "deploy\*" -DestinationPath $zipPath

Write-Host "4/4  Готово." -ForegroundColor Green
Write-Host ""
Write-Host "  deploy.zip е готов тук: $(Resolve-Path $zipPath)" -ForegroundColor Green
Write-Host ""
Write-Host "  Остава:" -ForegroundColor Yellow
Write-Host "   1. Качи deploy.zip през FileZilla/cPanel File Manager в папката jobs-ssr"
Write-Host "      (презаписва старите файлове — нормално е)."
Write-Host "   2. В File Manager: десен бутон върху zip-а -> Extract, после изтрий zip-а от сървъра."
Write-Host "   3. Setup Node.js App -> Restart."
