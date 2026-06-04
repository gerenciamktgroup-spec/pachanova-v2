const fs = require('fs');
const path = require('path');

const filePaths = [
  path.join(__dirname, '../apps/dashboard/src/app/dashboard/investor/page.tsx')
];

for (const filePath of filePaths) {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf-8');
    
    // Remove lines that are just `// Fase...` or `/* Fase... */` or `{/* Fase... */}`
    // We will do a regex replace for multi-line React comments starting with Fase
    content = content.replace(/\{\/\*\s*Fase[\s\S]*?\*\/\}/gi, '');
    
    // Remove single line comments containing Fase
    const lines = content.split('\n');
    const cleanedLines = lines.filter(line => {
      if (line.trim().startsWith('//') && line.toLowerCase().includes('fase')) {
        return false;
      }
      return true;
    });

    fs.writeFileSync(filePath, cleanedLines.join('\n'), 'utf-8');
    console.log(`Cleaned bloat from ${filePath}`);
  }
}
