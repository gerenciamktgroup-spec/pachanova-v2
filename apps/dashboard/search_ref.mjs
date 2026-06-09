import fs from 'fs';
import path from 'path';

function searchDir(dir, query) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.next') {
        searchDir(filePath, query);
      }
    } else if (filePath.endsWith('.ts') || filePath.endsWith('.tsx') || filePath.endsWith('.js') || filePath.endsWith('.tsx')) {
      const content = fs.readFileSync(filePath, 'utf8');
      if (content.includes(query)) {
        console.log(`Found "${query}" in: ${filePath}`);
      }
    }
  }
}

searchDir('..', 'HologramPncCard');
