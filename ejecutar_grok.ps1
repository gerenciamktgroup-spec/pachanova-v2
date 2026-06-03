param (
    [Parameter(Mandatory=$false)]
    [string]$InstruccionFile,

    # New for v3 infinite work on context exhaustion (512k limit in Grok Build TUI / PS sessions)
    [switch]$ResilientV3,
    [switch]$LoopInfinite,
    [int]$MaxRestarts = 1000
)

if (-not ($ResilientV3 -or $LoopInfinite)) {
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
} else {
    # In resilient mode the loop at the bottom handles execution (including auto resume instructions on context signals)
    $scriptDir = if ($PSScriptRoot) { $PSScriptRoot } else { Split-Path -Parent $MyInvocation.MyCommand.Path }
    if (-not $scriptDir) { $scriptDir = (Get-Location).Path }
}

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

# =============================================================================
# v3 CONTEXT EXHAUSTION + INFINITE WORK PROTOCOL (for Grok Build in PowerShell)
# When the Grok Build TUI context window fills (~512k effective / compaction point),
# we MUST: save all worked state (git + snapshot), then re-execute / re-bootstrap
# the whole autonomous loop so we generate "trabajo infinito" without loss.
# This complements the AI rules in AGENTS.md.
# =============================================================================

function Invoke-V3ContextPersist {
    param([string]$Reason = "context-window-full-or-bridge-exit")
    $ts = Get-Date -Format 'yyyyMMDD-HHmmss'
    $snapshot = Join-Path $scriptDir ("CONTEXT_SAVE_bridge_" + $ts + "_" + $Reason.Replace(' ','-') + ".md")
    $gitHead = (git rev-parse --short HEAD 2>$null) -join ''
    $status = (git status --porcelain 2>$null | Select-Object -First 20) -join "`n"

    $content = @"
# v3 CONTEXT WINDOW SAVE (Grok Build PS Bridge)
Date: $(Get-Date -Format o)
Reason: $Reason
Script: ejecutar_grok.ps1 (resilient launcher for Antigravity <-> Grok Build)
Git HEAD: $gitHead
Instruction last used: $InstruccionFile
Unique output: $uniqueOutputFile

## State snapshot (for perfect resume in next Grok Build session)
- Load latest: AGENTS.md (v3 rules + new Context Exhaustion Protocol), AUTONOMY_POSTMORTEM_*, latest window_PROGRESS_*.md or CONTEXT_SAVE_*.md
- Latest commit: $gitHead
- Uncommitted at save time: 
$status

## Resume instruction for next Grok Build session (copy-paste or auto-generated)
Previous Grok Build session in PowerShell hit context limit / compaction.
This bridge saved the work.
1. Start new Grok Build session (or let the PS loop re-invoke).
2. Bootstrap FULL v3: read AGENTS.md, this snapshot, latest postmortem, latest orq --dry or plan files, real PNC numbers from code / orq, Master manual invariants.
3. Continue exactly the autonomous loop from the last high-impact task (Landbank Master, Fase, real data push, MCP, etc.).
4. Use todo_write to restore previous todos if any were active.
5. Never stop. Persist at end of every sub-window.

## How this was triggered
The PS launcher (or AI) detected context pressure or process exit after Grok Build TUI filled its window.
All work up to this point is in git + this file + blackboard docs.
Next invocation of the bridge / orq will continue the infinite work.

Ciclo infinito garantizado. DATOS REALES. Master manual. Nunca parar.
"@
    try {
        Set-Content -Path $snapshot -Value $content -Encoding UTF8
        Write-Host "v3 CONTEXT SAVE written: $snapshot" -ForegroundColor Yellow
    } catch { Write-Host "Snapshot write failed: $_" -ForegroundColor Red }

    # Force persist of everything worked so far (the rule for both AI and PS)
    try {
        git add . 2>$null | Out-Null
        $commitMsg = "v3 CONTEXT-SAVE (PS bridge): $Reason | $(Get-Date -Format o) | snapshot $snapshot | head $gitHead"
        git commit -m $commitMsg 2>&1 | Out-Null
        git push origin main 2>&1 | Out-Null
        Write-Host "v3 CONTEXT-SAVE git commit+push done for infinite work." -ForegroundColor Green
    } catch {
        Write-Host "Git persist during context save (non-fatal, will retry next): $_" -ForegroundColor DarkYellow
    }
}

# Resilient / Infinite mode for "trabajo infinito" when Grok Build context fills in PS
if ($ResilientV3 -or $LoopInfinite -or -not $InstruccionFile) {
    Write-Host "=== v3 RESILIENT INFINITE MODE ACTIVATED (context 512k handling + auto re-execute) ===" -ForegroundColor Magenta
    Write-Host "This PS launcher will save state on every run / exit and re-bootstrap the full autonomous v3 loop." -ForegroundColor Gray

    $restartCount = 0
    while ($restartCount -lt $MaxRestarts) {
        $restartCount++
        $ts = Get-Date -Format 'yyyyMMdd-HHmmss'
        Write-Host "[v3-infinite] Starting Grok Build bridge iteration #$restartCount at $ts" -ForegroundColor Cyan

        # If no instruction or special resume mode, generate a resume-from-blackboard instruction on the fly
        $effectiveInstruccionFile = $InstruccionFile
        if (-not $effectiveInstruccionFile -or $restartCount -gt 1) {
            $resumeFile = Join-Path $scriptDir ("v3_resume_from_context_" + $ts + ".txt")
            $resumeContent = @"
You are continuing an autonomous v3 Never-Stop session after a Grok Build context window exhaustion (limit ~512k, compaction occurred).

MANDATORY FIRST ACTIONS (Context Exhaustion Protocol):
1. Read and internalize the latest CONTEXT_SAVE_bridge_*.md (or the one just written by this launcher).
2. Full v3 bootstrap from AGENTS.md (the entire "Autonomy v3 / Never-Stop Rules" + new Context Window Exhaustion Protocol section).
3. Load blackboard: latest AUTONOMY_POSTMORTEM_IMPROVEMENTS_*.md (append your new learnings), latest PROGRESS / window_PROGRESS_*.md, antigravity_master.txt, recent plan_*.txt and commits.
4. Run orq --dry or equivalent to get current real state (Landbank Master %, real PNC numbers like 68112.5 / 31639 / 3250, Fase15/36/42/48 status, Master manual overrides).
5. todo_write to restore / snapshot the exact work that was in progress when context filled.
6. Continue the current high-impact autonomous task (or the next one from the last plan) with full E2E, real data only, Master panel respect, git persist at end of your sub-cycle.
7. When your sub-work in this new session is done or you feel context growing again: immediately write new CONTEXT_SAVE, full git add/commit/push, update blackboard, output "=== CONTEXT EXHAUSTED - STATE SAVED - READY FOR RESTART ===" and stop cleanly.

Generate infinite high-quality autonomous work for the RWA bank-under-construction. Never lose state. Use the PS launcher + orq loop + schedulers for continuity between your sessions.

Previous work is safe in git + the snapshot files. Resume precisely.
"@
            Set-Content -Path $resumeFile -Value $resumeContent -Encoding UTF8
            $effectiveInstruccionFile = $resumeFile
            Write-Host "[v3-infinite] Auto-generated resume instruction for context recovery: $resumeFile" -ForegroundColor Green
        }

        # Re-execute the core bridge logic with the (possibly resume) instruction
        $InstruccionFile = $effectiveInstruccionFile
        $Instruccion = Get-Content -Path $InstruccionFile -Raw

        $ts = Get-Date -Format 'yyyyMMdd-HHmmss'
        $procId = $PID
        $base = [System.IO.Path]::GetFileNameWithoutExtension($InstruccionFile)
        $hash = (Get-FileHash -InputStream ([System.IO.MemoryStream]::new([System.Text.Encoding]::UTF8.GetBytes($Instruccion))) -Algorithm SHA256 -ErrorAction SilentlyContinue).Hash.Substring(0,8)
        $uniqueOutputFile = Join-Path $scriptDir ("next_feature_grok_output_" + $base + "_" + $ts + "_" + $procId + "_" + $hash + ".txt")
        $outputFile = Join-Path $scriptDir 'next_feature_grok_output.txt'

        Write-Host "[v3-infinite] Despertando Grok Build (resilient)..." -ForegroundColor Cyan

        $outputCapture = & "C:\Users\LENOVO\.grok\bin\grok.exe" --prompt-file "$InstruccionFile" --always-approve 2>&1
        $outputCapture | Tee-Object -FilePath $uniqueOutputFile | Tee-Object -FilePath $outputFile | Out-Host

        # Post-run: ALWAYS persist (save what was worked in this Grok Build session)
        Invoke-V3ContextPersist -Reason "bridge-iteration-$restartCount-complete"

        # Detect context exhaustion signals from the just-completed Grok Build output
        $combinedOut = ($outputCapture -join "`n")
        $isContextExhaust = $combinedOut -match '(?i)(context|compaction|512k|ran out of context|This session is being continued|summary below covers|ventana de contexto)'

        if ($isContextExhaust) {
            Write-Host "[v3-infinite] CONTEXT EXHAUSTION DETECTED in Grok Build output. Extra snapshot + will re-execute full bootstrap next iteration." -ForegroundColor Yellow
            Invoke-V3ContextPersist -Reason "explicit-context-exhaust-from-grok-output"
            # The next loop iteration will auto-generate a fresh resume instruction that tells the *new* Grok Build session to load the save and continue.
        }

        # Small sleep to avoid tight loop on fast failures; the orq 5m loop + schedulers provide the real cadence
        Start-Sleep -Seconds 10
    }

    Write-Host "v3 resilient infinite loop exited after $MaxRestarts restarts (safety). Run again to continue infinite work." -ForegroundColor Red
    exit 0
}
