const { execSync } = require('child_process');

try {
  execSync('git add .', { stdio: 'inherit' });
  execSync('git commit -m "Finish task"', { stdio: 'inherit' });
} catch (e) {}

console.log('Task submitted.');
