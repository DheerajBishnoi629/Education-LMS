// test-runner.js
const { execSync } = require('child_process');

console.log('🕵️  Running Angular tests before commit...');

try {
  // execute the test command in CI mode (no watch, headless browser)
  // stdio: 'inherit' allows you to see the test output in your terminal
  execSync('ng test --watch=false --browsers=ChromeHeadless', { stdio: 'inherit' });

  console.log('✅ Tests passed successfully!');
} catch (error) {
  console.error('❌ Tests failed. Commit aborted.');
  // Exit with error code 1 to tell Husky to block the commit
  process.exit(1);
}
