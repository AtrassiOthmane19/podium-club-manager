# ============================================================
#  Podium Club Manager — Démarrage local
# ============================================================

$root   = $PSScriptRoot
$client = Join-Path $root "client"
$server = Join-Path $root "server"

Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "   Podium Club Manager - Démarrage" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# --- 1. Build du frontend ---
Write-Host "[1/3] Compilation du frontend..." -ForegroundColor Yellow
Set-Location $client
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERREUR : la compilation du frontend a échoué." -ForegroundColor Red
    exit 1
}
Write-Host "Frontend compilé." -ForegroundColor Green

# --- 2. Trouver l'IP locale ---
$localIP = (
    Get-NetIPAddress -AddressFamily IPv4 |
    Where-Object { $_.IPAddress -notmatch '^(127\.|169\.)' } |
    Sort-Object PrefixLength |
    Select-Object -First 1 -ExpandProperty IPAddress
)

# --- 3. Démarrer le serveur ---
Write-Host ""
Write-Host "[2/3] Démarrage du serveur..." -ForegroundColor Yellow
Set-Location $server

Write-Host ""
Write-Host "==========================================" -ForegroundColor Green
Write-Host "   Application disponible sur :" -ForegroundColor Green
Write-Host ""
Write-Host "   Ce PC      : http://localhost:5000" -ForegroundColor White
if ($localIP) {
    Write-Host "   Réseau     : http://${localIP}:5000" -ForegroundColor White
    Write-Host ""
    Write-Host "   Partagez cette adresse avec les autres appareils :" -ForegroundColor Cyan
    Write-Host "   http://${localIP}:5000" -ForegroundColor Yellow
}
Write-Host "==========================================" -ForegroundColor Green
Write-Host ""
Write-Host "[3/3] Serveur en cours d'exécution... (Ctrl+C pour arrêter)" -ForegroundColor Yellow
Write-Host ""

node server.js
