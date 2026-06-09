const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      if (f !== 'node_modules' && f !== '.next' && f !== '.git' && f !== 'dist') {
        walk(dirPath, callback);
      }
    } else {
      if (f.endsWith('.ts') || f.endsWith('.tsx') || f.endsWith('.js') || f.endsWith('.jsx') || f.endsWith('.mjs')) {
        callback(dirPath);
      }
    }
  });
}

let count = 0;
walk('.', (filePath) => {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;
  
  content = content.replace(/db\.query\.users\b/g, 'db.query.investors');
  content = content.replace(/db\.query\.assets\b/g, 'db.query.properties');
  
  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Updated db.query', filePath);
    count++;
  }
});

console.log(`Updated ${count} files.`);
