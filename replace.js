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
  
  content = content.replace(/schema\.users\b/g, 'schema.investors');
  content = content.replace(/schema\.assets\b/g, 'schema.properties');
  
  // Also check for explicit imports from schema package if any (like scripts)
  content = content.replace(/\bimport\s*\{([^}]*)\busers\b([^}]*)\}\s*from\s*(['"])@pachanova\/database\2/g, (match, p1, p2, p3) => {
    return match.replace(/\busers\b/g, 'investors');
  });

  content = content.replace(/\bimport\s*\{([^}]*)\busers\b([^}]*)\}\s*from\s*(['"])..\/packages\/database\/src\/index\.js\3/g, (match, p1, p2, p3) => {
    return match.replace(/\busers\b/g, 'investors');
  });
  
  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Updated', filePath);
    count++;
  }
});

console.log(`Updated ${count} files.`);
