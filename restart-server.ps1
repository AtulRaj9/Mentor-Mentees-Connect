# PowerShell script to cleanly restart the Vite dev server
Write-Host "Stopping any running Node processes on port 8080..." -ForegroundColor Yellow

# Find and stop processes using port 8080
$processes = Get-NetTCPConnection -LocalPort 8080 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique
foreach ($pid in $processes) {
    if ($pid) {
        Write-Host "Stopping process $pid..." -ForegroundColor Yellow
        Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
    }
}

Start-Sleep -Seconds 2

Write-Host "Starting Vite dev server..." -ForegroundColor Green
Write-Host "Server will be available at: http://localhost:8080" -ForegroundColor Cyan
Write-Host ""

npm start

