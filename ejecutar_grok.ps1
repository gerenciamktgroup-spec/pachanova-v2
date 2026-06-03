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
# 9H 360 FLOW: ALWAYS use unique output per invocation (timestamp + PID + query hash) to eliminate EBUSY lock contention
# when multiple orq --dry / bg loops / scheduler oversight / bridge calls run concurrently (core + pachanova).
# Orq will poll the specific file printed. Mirrors still created for compatibility.
$ts = Get-Date -Format 'yyyyMMdd-HHmmss'
$procId = $PID
$base = [System.IO.Path]::GetFileNameWithoutExtension($InstruccionFile)
$hash = (Get-FileHash -InputStream ([System.IO.MemoryStream]::new([System.Text.Encoding]::UTF8.GetBytes($Instruccion))) -Algorithm SHA256 -ErrorAction SilentlyContinue).Hash.Substring(0,8)
$uniqueOutputFile = Join-Path $scriptDir ("next_feature_grok_output_" + $base + "_" + $ts + "_" + $procId + "_" + $hash + ".txt")

# Also keep a 'latest' symlink-like copy for tools that expect fixed name (but orq prefers unique now)
$outputFile = Join-Path $scriptDir 'next_feature_grok_output.txt'

Write-Host "Despertando a Grok Build en la terminal (bridge para Antigravity <-> executor) - 9H 360 FLOW UNIQUE OUTPUT..." -ForegroundColor Cyan
Write-Host "Contenido: $InstruccionFile" -ForegroundColor Gray
Write-Host "UNIQUE Salida (for orq poll, lock-free): $uniqueOutputFile" -ForegroundColor Green
Write-Host "Legacy copy: $outputFile" -ForegroundColor Gray

# Run with --prompt-file (safe for long Antigravity queries). Tee to BOTH unique (primary for 360 no-lock) and legacy.
& "C:\Users\LENOVO\.grok\bin\grok.exe" --prompt-file "$InstruccionFile" --always-approve 2>&1 | Tee-Object -FilePath $uniqueOutputFile | Tee-Object -FilePath $outputFile | Out-Host

# Convert unique + legacy to UTF-8 no BOM (for read_file compatibility)
foreach ($f in @($uniqueOutputFile, $outputFile)) {
    if (Test-Path $f) {
        try {
            $content = Get-Content -Path $f
            $utf8NoBom = New-Object System.Text.UTF8Encoding($false)
            [System.IO.File]::WriteAllText($f, ($content -join "`r`n"), $utf8NoBom)
        } catch {}
    }
}

# Extra mirrors for debug / 9h progress (timestamped base)
try {
  $mirrorOut = Join-Path $scriptDir ("next_feature_grok_output_MIRROR_" + $base + "_" + $ts + ".txt")
  Copy-Item -Path $uniqueOutputFile -Destination $mirrorOut -Force -ErrorAction SilentlyContinue
  Write-Host "Extra 9H mirror: $mirrorOut" -ForegroundColor DarkGray
} catch {}

Write-Host "=== Bridge consult completado (9H 360 UNIQUE OUTPUT $uniqueOutputFile). next_feature listo para parseo (cierra canal e inyecta). Ciclo infinito PachaNova Landbank + Fase9/36/42 activo. ===" -ForegroundColor Green
