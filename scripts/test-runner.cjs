const path = require('path');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
let currentSuite = '';

global.suite = function(name, fn) {
  const previousSuite = currentSuite;
  currentSuite = currentSuite ? `${currentSuite} > ${name}` : name;
  console.log(`\n📦 Suite: ${currentSuite}`);
  try {
    fn();
  } finally {
    currentSuite = previousSuite;
  }
};

global.test = function(name, fn) {
  totalTests++;
  try {
    fn();
    passedTests++;
    console.log(`  ✅ ${name}`);
  } catch (err) {
    failedTests++;
    console.error(`  ❌ ${name}`);
    console.error(`     Error: ${err.message}`);
    if (err.stack) {
      console.error(err.stack.split('\n').slice(0, 3).join('\n'));
    }
  }
};

console.log('🚀 Running Unit Tests...');

try {
  require('../out/test/tagParser.test.js');
} catch (e) {
  console.error('Fatal test loading error:', e);
  process.exit(1);
}

console.log('\n=======================================');
console.log(`Test Results: ${passedTests}/${totalTests} passed (${failedTests} failed)`);
console.log('=======================================');

if (failedTests > 0) {
  process.exit(1);
}
