"""
DEPRECATED for autonomous / v3 Never-Stop use (as of 2026-06-03).

This legacy Python resolver was the direct cause of the "No se pudo iniciar correctamente la aplicación (0xc0000017)" dialog
when git conflicts arose during heavy parallel autonomous commits / blackboard updates.

REASON: Standalone Python 3.14+ installs (pythoncore-3.14-64) require VC++ Redistributable runtime.

CANONICAL REPLACEMENT (zero external runtime dep, always works in Node env):
  npm run resolve-conflicts -- <file-path>
or
  node resolve-conflicts.js <file-path>

See:
- package.json scripts
- resolve-conflicts.js (the maintained port)
- AGENTS.md (section "Conflict resolution rule" and "Tools & runtimes" under Autonomy v3 / Never-Stop Rules)
- AUTONOMY_POSTMORTEM_IMPROVEMENTS_2026-06-03.md (detailed root cause + fix + scans confirmation)

Rules:
- NEVER invoke python resolve_conflicts.py (or this file) from orchestrator_agent.cjs, index.cjs, schedulers, monitors, bootstrap, or any v3 loop.
- Bootstrap / verifiers must guide the npm script if conflicts are detected.
- On any similar runtime error for a core dev tool, immediately port to native JS/TS + update rules + commit + push.

The logic below is kept for manual / reference use only. It will still function (after VC++ AIO install), but is not part of the autonomous path.

Background full recursive scans (old + fresh post-fix) confirmed: this is the *only* *.py outside node_modules, and there are no requirements.txt / pyproject.toml / setup.py for Python in the project. The entire stack (dashboard, orq, DB, APIs) is Node/Next.js/TS/Drizzle/pnpm only.
"""

import sys
import warnings

file_path = sys.argv[1]

print("WARNING: resolve_conflicts.py is DEPRECATED for v3 autonomous work.", file=sys.stderr)
print("Use instead: npm run resolve-conflicts --", file_path, file=sys.stderr)
print("See AGENTS.md v3 rules and resolve-conflicts.js", file=sys.stderr)

with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

out = []
state = "normal"
for line in lines:
    if line.startswith("<<<<<<< Updated upstream"):
        state = "skip_upstream"
    elif line.startswith("======="):
        state = "keep_stashed"
    elif line.startswith(">>>>>>> Stashed changes"):
        state = "normal"
    else:
        if state == "normal" or state == "keep_stashed":
            out.append(line)

with open(file_path, 'w', encoding='utf-8') as f:
    f.writelines(out)

print("Conflicts resolved in", file_path)

