const fs = require('fs');
const path = require('path');
function search(dir) {
  let results = [];
  if (dir.includes('node_modules') || dir.includes('.git') || dir.includes('.next')) return results;
  let files;
  try { files = fs.readdirSync(dir); } catch(e) { return results; }
  for (const f of files) {
    const full = path.join(dir, f);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      results = results.concat(search(full));
    } else if (stat.isFile() && (f.endsWith('.ts') || f.endsWith('.tsx') || f.endsWith('.js') || f.endsWith('.cjs'))) {
      const content = fs.readFileSync(full, 'utf8');
      if (content.includes('computePersonalYieldForUser')) {
        results.push(full);
      }
    }
  }
  return results;
}
console.log(search(process.argv[2] || __dirname));
