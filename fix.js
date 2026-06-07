const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    file = path.resolve(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.ts')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk('C:/Users/LENOVO/Desktop/labotarorio lihue/pachanova/packages/database/src');
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes('.ts')) {
    content = content.replace(/from\s+['"]([^'"]+)\.ts['"]/g, "from '$1'");
    fs.writeFileSync(file, content);
  }
});
console.log('Fixed .ts extensions');
