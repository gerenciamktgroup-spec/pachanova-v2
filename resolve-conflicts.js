#!/usr/bin/env node
/**
 * resolve-conflicts.js
 * Pure Node/JS port of resolve_conflicts.py
 * Keeps the "Stashed changes" side of git merge conflicts.
 * Usage: node resolve-conflicts.js <file-path>
 */
const fs = require('fs');
const path = require('path');
const filePath = process.argv[2];
if (!filePath) {
  console.error('Usage: node resolve-conflicts.js <file-path>');
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
