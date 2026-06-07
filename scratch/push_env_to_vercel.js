const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

const envPath = path.join(__dirname, '..', 'apps', 'dashboard', '.env.local');
const envConfig = dotenv.parse(fs.readFileSync(envPath));

console.log("Found environment variables in .env.local:");
console.table(Object.keys(envConfig));

for (const [key, value] of Object.entries(envConfig)) {
  if (!key || !value) continue;
  console.log(`Adding ${key}...`);
  try {
    const escapedValue = value.replace(/"/g, '\\"');
    const environments = ['production', 'development'];
    for (const env of environments) {
      console.log(`  Targeting environment: ${env}`);
      const cmd = `vercel env add ${key} ${env} --value "${escapedValue}" --force --yes`;
      const out = execSync(cmd, { cwd: path.join(__dirname, '..', 'apps', 'dashboard'), stdio: 'pipe' });
      console.log(out.toString());
    }
    console.log(`Success adding ${key} to all environments`);
  } catch (err) {
    console.error(`Error adding ${key}:`, err.message);
  }
}
console.log("All done!");
