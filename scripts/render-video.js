const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const configPath = args[0];

if (!configPath) {
  console.error('Usage: node render-video.js <config-path>');
  process.exit(1);
}

try {
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  
  const remotionCommand = `npx remotion render src/index.tsx VideoComposition --props='${configPath}' ${config.outputPath}`;
  
  execSync(remotionCommand, { stdio: 'inherit' });
  
} catch (error) {
  console.error('Rendering failed:', error.message);
  process.exit(1);
}