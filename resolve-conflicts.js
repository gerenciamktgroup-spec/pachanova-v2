#!/usr/bin/env node
/**
 * resolve-conflicts.js
 *
 * CANONICAL / SUPPORTED resolver for v3 Never-Stop autonomous work (git blackboard commits, parallel plans, etc.).
 *
 * - Pure Node/JS, zero external runtime dependencies (no Python, no VC++ requirement).
 * - Keeps the "Stashed changes" side of git merge conflicts (same semantics as the legacy py).
 * - Registered in package.json as "resolve-conflicts".
 *
 * Preferred usage (cross-platform):
 *   npm run resolve-conflicts -- <file-path>
 *
 * Direct:
 *   node resolve-conflicts.js <file-path>
 *
 * See:
 * - AGENTS.md (Autonomy v3 rules: "Conflict resolution rule", "Tools & runtimes", "End-of-cycle discipline")
 * - AUTONOMY_POSTMORTEM_IMPROVEMENTS_2026-06-03.md (0xc0000017 root cause, full scans confirmation, self-heal)
 * - resolve_conflicts.py (legacy, heavily deprecated with warnings; do not use from loops)
 *
 * v3 rule: Bootstrap, orq, schedulers, monitors, and verifiers MUST guide/use the npm script if conflicts appear.
 * On runtime errors for core dev tools → port to native + update rules + commit + push immediately.
 *
 * Background full scans (recursive *.py + no pyproject/requirements) confirmed this project has no Python
 * runtime or build dependencies. The stack is Node/Next/TS/Drizzle/pnpm only. This JS eliminates a
 * class of autonomous pauses.
 */
const fs = require('fs');
const path = require('path');
const filePath = process.argv[2];
if (!filePath) {
  console.error('Usage: npm run resolve-conflicts -- <file-path>');
  console.error('   or: node resolve-conflicts.js <file-path>');
  process.exit(1);
}
const fullPath = path.resolve(filePath);
if (!fs.existsSync(fullPath)) {
  console.error('File not found:', fullPath);
  process.exit(1);
}
const content = fs.readFileSync(fullPath, 'utf8');
const lines = content.split(/\r?\n/);
const out = [];
let state = 'normal';
for (const line of lines) {
  if (line.startsWith('<<<<<<< Updated upstream')) {
    state = 'skip_upstream';
  } else if (line.startsWith('=======')) {
    state = 'keep_stashed';
  } else if (line.startsWith('>>>>>>> Stashed changes')) {
    state = 'normal';
  } else {
    if (state === 'normal' || state === 'keep_stashed') {
      out.push(line);
    }
  }
}
fs.writeFileSync(fullPath, out.join('\n') + (content.endsWith('\n') ? '\n' : ''), 'utf8');
console.log('Conflicts resolved in', fullPath);
