param (
    [Parameter(Mandatory=$true)]
    [string]$InstruccionFile
)

if (-not (Test-Path $InstruccionFile)) {
    Write-Host "Error: No se encontró el archivo de instrucciones de Antigravity." -ForegroundColor Red
    exit 1
}

$Instruccion = Get-Content -Path $InstruccionFile -Raw

# Determine output file next to the script (or current dir) so orchestrator / antigravity cycles can always find it
$scriptDir = if ($PSScriptRoot) { $PSScriptRoot } else { Split-Path -Parent $MyInvocation.MyCommand.Path }
if (-not $scriptDir) { $scriptDir = (Get-Location).Path }
$outputFile = Join-Path $scriptDir 'next_feature_grok_output.txt'

Write-Host "Despertando a Grok Build en la terminal (bridge para Antigravity <-> executor)..." -ForegroundColor Cyan
Write-Host "Contenido: $InstruccionFile" -ForegroundColor Gray
Write-Host "Salida capturada en: $outputFile" -ForegroundColor Gray

# Run grok.exe with the full prompt from the file. Capture + tee to the expected output file for parsing **NEXT_BEST_FEATURE:** blocks.
# This makes the "comando que lo invoca" reliable for the singularity cycle between planner and executor.
& "C:\Users\LENOVO\.grok\bin\grok.exe" --single "$Instruccion" --always-approve 2>&1 | Tee-Object -FilePath $outputFile | Out-Host

Write-Host "=== Bridge consult completado. next_feature_grok_output.txt listo para parseo (cierra canal e inyecta). ===" -ForegroundColor Green
