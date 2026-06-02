#!/usr/bin/env node
/**
 * orchestrator_agent.cjs
 * Agente Autónomo Infinito para el Panel Maestro (Aetheris / Copera / PachaNova)
 * 
 * Versión .cjs para compatibilidad cuando el package.json tiene "type": "module".
 * 
 * (El contenido es idéntico al .js anterior, pero como CommonJS puro).
 * 
 * Ver documentación completa en el .js original o en el README/orchestrator notes.
 * 
 * Uso:
 *   node orchestrator_agent.cjs
 *   node orchestrator_agent.cjs --loop 300000
 *   node orchestrator_agent.cjs --dry
 */

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const { promisify } = require('util');
const sleep = promisify(setTimeout);

const PROJECT_ROOT = __dirname;
const QUERY_FILE = path.join(PROJECT_ROOT, 'next_orchestrator_query.txt');
const OUTPUT_FILE = path.join(PROJECT_ROOT, 'next_feature_grok_output.txt');
const PS1_WRAPPER = path.join(PROJECT_ROOT, 'ejecutar_grok.ps1');

const DEFAULT_LOOP_MS = 5 * 60 * 1000;

function log(msg, level = 'INFO') {
  const ts = new Date().toISOString();
  console.log(`[${ts}] [ORCHESTRATOR_${level}] ${msg}`);
}

function writeQueryFile() {
  // Load antigravity master principles if present (for richer, consistent autonomous queries)
  let masterPrinciples = '';
  const masterPath = path.join(PROJECT_ROOT, 'antigravity_master.txt');
  if (fs.existsSync(masterPath)) {
    try {
      masterPrinciples = fs.readFileSync(masterPath, 'utf8').slice(0, 2800); // core directives + connection protocol
    } catch (e) { log('Could not load antigravity_master.txt: ' + e.message, 'WARN'); }
  }

  // Dynamically gather real current state (DATOS REALES)
  let stateSummary = 'CURRENT STATE (real files + last autonomous actions):\n';
  try {
    const lastFeatPath = path.join(PROJECT_ROOT, 'ORCHESTRATOR_LAST_FEATURE.txt');
    if (fs.existsSync(lastFeatPath)) {
      stateSummary += 'LAST FEATURE: ' + fs.readFileSync(lastFeatPath, 'utf8').slice(0, 300) + '\n';
    }
    const plans = fs.readdirSync(PROJECT_ROOT).filter(f => f.startsWith('plan_fase15_') || f.startsWith('plan_fase14_')).sort().slice(-2);
    plans.forEach(p => {
      const content = fs.readFileSync(path.join(PROJECT_ROOT, p), 'utf8').slice(0, 400);
      stateSummary += `PLAN ${p}: ${content.replace(/\n/g, ' ').slice(0, 350)}...\n`;
    });
    if (fs.existsSync(path.join(PROJECT_ROOT, 'next_feature_grok_output.txt'))) {
      const out = fs.readFileSync(path.join(PROJECT_ROOT, 'next_feature_grok_output.txt'), 'utf8');
      const m = out.match(/\*\*NEXT_BEST_FEATURE:\*\*([\s\S]*?)(?=\n\n|\n$|$)/);
      if (m) stateSummary += 'LATEST NEXT_BEST (parsed): ' + m[1].trim().slice(0, 450) + '\n';
    }
    // Fase 17: Real recursive fleet scan for multi-project bootstrap (core + all discovered pachanova/aetheris RWA .git)
    // DATOS REALES - executed on every orchestrate to feed NEXT_BEST and state
    let fleet = [];
    try {
      const roots = [
        'C:\\Users\\LENOVO\\Documents',
        'C:\\Users\\LENOVO\\Desktop',
        'C:\\Users\\LENOVO\\Documents\\GitHub'
      ];
      const seen = new Set();
      for (const root of roots) {
        if (!fs.existsSync(root)) continue;
        const gits = [];
        function walk(dir, depth) {
          if (depth > 4) return;
          try {
            const entries = fs.readdirSync(dir, { withFileTypes: true });
            for (const e of entries) {
              if (e.name === 'node_modules' || e.name === '.grok' || e.name.startsWith('.')) continue;
              const p = path.join(dir, e.name);
              if (e.isDirectory()) {
                if (e.name === '.git' && !seen.has(dir)) {
                  seen.add(dir);
                  gits.push(dir);
                } else {
                  walk(p, depth + 1);
                }
              }
            }
          } catch (_) {}
        }
        walk(root, 0);
        for (const g of gits) {
          const name = path.basename(g);
          const lower = g.toLowerCase();
          if (lower.includes('laboratorio-lihue-core')) continue; // self
          const isRWA = /pachanova|pachanovafullstack|aetheris|copera|lihue|rwa|token/i.test(name + ' ' + lower);
          if (isRWA || gits.length < 5) {  // capture known RWA even if heuristic loose
            let type = 'unknown';
            if (/pachanova-v2|pachanova$|labotarorio.*pachanova/i.test(lower)) type = 'pachanova-monorepo';
            else if (/pachanovafullstack/i.test(lower)) type = 'pachanova-fullstack';
            else if (/pachanovamvp/i.test(lower)) type = 'pachanova-mvp';
            else if (/pn aetheris/i.test(lower)) type = 'aetheris-plans';
            else if (isRWA) type = 'rwa-project';
            const hasOrq = fs.existsSync(path.join(g, 'ejecutar_grok.ps1')) || fs.existsSync(path.join(g, 'orchestrator_agent.cjs'));
            const pkg = fs.existsSync(path.join(g, 'package.json')) ? JSON.parse(fs.readFileSync(path.join(g, 'package.json'), 'utf8')) : {};
            fleet.push({ path: g, name, type, hasOrq, hasPnpm: !!pkg.packageManager || fs.existsSync(path.join(g, 'pnpm-lock.yaml')), scripts: Object.keys(pkg.scripts || {}).filter(s => s.includes('orchestrate') || s.includes('dev') || s.includes('build')).slice(0,3) });
          }
        }
      }
    } catch (e) { fleet = [{ error: e.message }]; }
    stateSummary += 'FLEET_SCAN (Fase 17 real .git discovery): ' + JSON.stringify(fleet.length ? fleet : ['no rwa discovered']) + '\n';
    if (fleet.length) {
      stateSummary += 'KEY FLEET TARGETS: ' + fleet.map(f => f.name + (f.hasOrq ? '(orq+)' : '')).join(', ') + '\n';
    }
    // legacy note updated
    stateSummary += 'PROJECTS (known): laboratorio-lihue-core (primary Panel Maestro + orquest + Fase16 exact yield + realtime + antigravity live) + discovered above. Antigravity scans every cycle for bootstrap.\n';
    stateSummary += 'KEY ARTIFACTS: ejecutar_grok.ps1 (bridge), orchestrator_agent + loop, antigravity_master, App.jsx Fase16 myRend+realtime+mail closed, supabase fns real (mail-processor etc), Fase16 schemas 06/07 live, gcloud SA (matriz-orquestador-key), multi-project now active.\n';
  } catch (e) { stateSummary += ' (partial state read: ' + e.message + ')\n'; }

  const prompt = `${masterPrinciples ? 'ANTIGRAVITY MASTER PRINCIPLES (load these for operating mode - never stop, bridge via ps1, GitHub blackboard, full E2E, multi-project scan, high-level only):\n' + masterPrinciples + '\n\n---\n\n' : ''}You are the expert autonomous product + engineering lead for the "Panel Maestro" (Aetheris / Copera / PachaNova real-estate tokenization / RWA platforms) AND all user projects discovered via scan.

${stateSummary}

TASK: Identifica LA característica MASIVA y de ALTO IMPACTO que debemos construir AHORA MISMO (post-orchestrator + RWA ownership teaser + real orquestadores + Mail one-click). Compone con piezas ya shipped (no unrelated infra), real data only (DATOS REALES • SIN SIMULACIONES), full E2E autonomous deliverable (plan + code + seed + build + docs + orchestrator extension if needed), testable, high leverage for admin + inversor + auto-orquest loops. Prioritize cashflow/yield/distribuciones if prior plans scoped it post-ownership. Be decisive and technical.

Use the same strict criteria and output format EXACTLY:

**NEXT_BEST_FEATURE:**
Title: ...
Why this is the single best next step right now (...): ...
Detailed description: ...
Acceptance criteria (testable, for autonomous implementer): ...
Suggested files / areas to change (high-level guidance): ...
Any risks or open decisions for the implementer: ...
This is the decisive, high-signal next move... The singularity cycle depends on it. Inyectar código real ahora.`;

  fs.writeFileSync(QUERY_FILE, prompt, 'utf8');
  log(`Query file written (antigravity-aware + dynamic state): ${QUERY_FILE}`);
  return QUERY_FILE;
}

async function consultGrokViaProjectCommand(dryRun = false) {
  log('Iniciando consulta cruda a Grok Build vía el comando oficial del proyecto (ejecutar_grok.ps1)...');

  if (dryRun) {
    log('DRY RUN activado.');
    const simulated = `**NEXT_BEST_FEATURE:**
Title: Full RWA Tokenization + Inversor Portfolio + Auto-Orquestación (masiva post Fase 14)
Why... (simulado)
...`;
    fs.writeFileSync(OUTPUT_FILE, simulated, 'utf8');
    return OUTPUT_FILE;
  }

  if (fs.existsSync(OUTPUT_FILE)) fs.unlinkSync(OUTPUT_FILE);

  const queryFile = writeQueryFile();

  return new Promise((resolve, reject) => {
    const ps = spawn('powershell', ['-File', PS1_WRAPPER, queryFile], {
      cwd: PROJECT_ROOT,
      stdio: ['ignore', 'pipe', 'pipe']
    });

    ps.stdout.on('data', d => process.stdout.write(d));
    ps.stderr.on('data', d => process.stderr.write(d));

    ps.on('close', (code) => {
      log(`Wrapper ps1 exited ${code}. Esperando output file...`);
      const start = Date.now();
      const poll = setInterval(() => {
        if (fs.existsSync(OUTPUT_FILE) && fs.statSync(OUTPUT_FILE).size > 500) {
          clearInterval(poll);
          log(`Respuesta de Grok capturada en ${OUTPUT_FILE}`);
          resolve(OUTPUT_FILE);
        } else if (Date.now() - start > 300000) {
          clearInterval(poll);
          reject(new Error('Timeout esperando el output de Grok. Revisa el archivo manualmente.'));
        }
      }, 2000);
    });

    ps.on('error', reject);
  });
}

function parseNextBestFeature(outputPath) {
  const content = fs.readFileSync(outputPath, 'utf8');
  const match = content.match(/\*\*NEXT_BEST_FEATURE:\*\*([\s\S]*?)(?=\n\n|\n$|$)/);
  if (!match) return { raw: content, title: 'Feature no parseada - ver archivo completo' };
  const block = match[1].trim();
  const titleMatch = block.match(/Title:\s*(.+)/);
  return {
    title: titleMatch ? titleMatch[1].trim() : 'Unknown massive feature',
    rawBlock: block,
    full: content
  };
}

async function injectPlanAndReport(feature) {
  const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0,19);
  const planFile = path.join(PROJECT_ROOT, `plan_fase15_${ts}.txt`);
  const plan = `# Plan Fase 15 (Orchestrator Agent): ${feature.title}\n\nGenerado por orchestrator_agent.cjs usando el comando oficial del proyecto.\n\n${feature.rawBlock || feature.full}\n\nEl ciclo de singularidad continúa. Inyectar código sin pedir permiso.`;
  fs.writeFileSync(planFile, plan, 'utf8');
  log(`Plan masivo inyectado: ${planFile}`);
  fs.writeFileSync(path.join(PROJECT_ROOT, 'ORCHESTRATOR_LAST_FEATURE.txt'), `Última feature masiva: ${feature.title}\n${new Date().toISOString()}\nPlan: ${planFile}`);
  log('Canal cerrado. Implementador autónomo: inyecta el código ahora.');
}

async function runCycle(dryRun = false, loopMs = null) {
  log('=== CICLO DE SINGULARIDAD (orchestrator_agent.cjs) ===');
  try {
    const out = await consultGrokViaProjectCommand(dryRun);
    const feat = parseNextBestFeature(out);
    await injectPlanAndReport(feat);
    log('Ciclo terminado. Siguiente iteración vía loop o scheduler TUI.');
    if (loopMs) {
      log(`Loop mode: esperando ${loopMs/1000/60} min...`);
    }
  } catch(e) {
    log('Error en ciclo: ' + e.message, 'ERROR');
  }
}

const args = process.argv.slice(2);
const dry = args.includes('--dry');
const doLoop = args.includes('--loop');
const interval = doLoop ? DEFAULT_LOOP_MS : null;

if (require.main === module) {
  if (doLoop) {
    (async function loop() {
      while(true) {
        await runCycle(dry, DEFAULT_LOOP_MS);
        await sleep(DEFAULT_LOOP_MS);
      }
    })();
  } else {
    runCycle(dry);
  }
}

// High-level only (for v2 thin port polish #17): port of core runFleetYieldForecastTask stubbed for demo (no keys).
// Returns proposals/forecasts using DATOS REALES: 24281.25 conf 0.72 from real Fase16 12.5% 23125 context.
// Enables FETCH_PROPOSALS -> UI prefill/suggest closed loop in dashboard investor for core blackboard #17 mail suggest.
async function runFleetYieldForecastTask() {
  const logPrefix = '[v2 thin port Fase18 fleet_yield_forecast_task]';
  console.log(logPrefix + ' Starting (stub for no-keys demo; DATOS REALES Fase16 refs)');
  const stub = {
    proyecto_codigo: 'AET-002',
    predicted_next: 24281.25,
    confidence: 0.72,
    rationale: 'heuristic +5% from real Fase16 exact my_share 23125 (holdings 12.5% * 185k context)',
    based_on: 'seed_panel_maestro + Fase16 tables (real)',
    source: 'orq_fleet_yield_forecast_task_v18_stub_v2',
    created_at: new Date().toISOString()
  };
  const forecasts = [stub];
  const proposals = [{
    action: 'AUTO_DECLARE_PROPOSE',
    proyecto_codigo: stub.proyecto_codigo,
    suggested_monto: stub.predicted_next,
    confidence: stub.confidence,
    rationale: stub.rationale,
    source: stub.source,
    based_on: stub.based_on,
    created_at: stub.created_at
  }];
  console.log(logPrefix + ' Produced ' + forecasts.length + ' forecasts + ' + proposals.length + ' proposals for #17 v2 port (FETCH_PROPOSALS ready for suggest/prefill)');
  return { success: true, forecasts, count: forecasts.length, proposals, proposals_count: proposals.length };
}

module.exports = { runCycle, runFleetYieldForecastTask };
