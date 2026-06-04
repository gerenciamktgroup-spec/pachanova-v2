param()

$Host.UI.RawUI.WindowTitle = "ANTIGRAVITY AUTONOMOUS MONITOR - 10H LOOP"
$Host.UI.RawUI.BackgroundColor = "Black"
$Host.UI.RawUI.ForegroundColor = "Green"
Clear-Host

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "   🚀 ANTIGRAVITY & GROK - MONITOR AUTÓNOMO EN VIVO 🚀   " -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "Modo Autónomo: ACTIVADO (Bucle de 10 Horas)" -ForegroundColor Yellow
Write-Host "Presiona Ctrl+C para cerrar este monitor (el agente no se detendrá)." -ForegroundColor Gray
Write-Host "------------------------------------------------------------" -ForegroundColor DarkGray

$tasksDir = "C:\Users\LENOVO\.gemini\antigravity-ide\brain\ea60cddd-02dd-4274-a381-a85a71020e4b\.system_generated\tasks"
$logsDir = "C:\Users\LENOVO\.gemini\antigravity-ide\brain\ea60cddd-02dd-4274-a381-a85a71020e4b\.system_generated\logs"

$latestTaskLog = Get-ChildItem -Path $tasksDir -Filter "*.log" | Sort-Object LastWriteTime -Descending | Select-Object -First 1

Write-Host "[SISTEMA] Conectando con los nervios centrales del agente..." -ForegroundColor Magenta

if ($latestTaskLog) {
    Write-Host "[MONITOR] Tailing el log más reciente del sistema: $($latestTaskLog.Name)" -ForegroundColor Magenta
    Write-Host "------------------------------------------------------------" -ForegroundColor DarkGray
    
    # Usamos un bucle para poder revisar si hay actividad nueva y mantener la terminal viva
    Get-Content $latestTaskLog.FullName -Wait -Tail 20
} else {
    Write-Host "[!] No se encontraron logs de tareas activos en tiempo real." -ForegroundColor Red
    while ($true) {
        $time = Get-Date -Format "HH:mm:ss"
        Write-Host "[$time] El agente está en espera de la siguiente señal del cron..." -ForegroundColor Green
        Start-Sleep -Seconds 10
    }
}
