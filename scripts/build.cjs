const path = require('path');
const tsPath = 'C:/Users/nguye/AppData/Local/Programs/Microsoft VS Code/c4453f8ea4/resources/app/extensions/node_modules/typescript/lib/typescript.js';
const ts = require(tsPath);

console.log('[Build] Using TypeScript version:', ts.version);

const rootDir = path.resolve(__dirname, '..');
const configPath = ts.findConfigFile(rootDir, ts.sys.fileExists, 'tsconfig.json');

if (!configPath) {
  console.error('[Build Error] tsconfig.json not found!');
  process.exit(1);
}

const configFile = ts.readConfigFile(configPath, ts.sys.readFile);
const parsed = ts.parseJsonConfigFileContent(configFile.config, ts.sys, rootDir);

console.log('[Build] Compiling files:', parsed.fileNames.map(f => path.relative(rootDir, f)));

const program = ts.createProgram(parsed.fileNames, parsed.options);
const emitResult = program.emit();

const allDiagnostics = ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics);

let hasError = false;
for (const diag of allDiagnostics) {
  const message = ts.flattenDiagnosticMessageText(diag.messageText, '\n');
  if (diag.file) {
    const { line, character } = diag.file.getLineAndCharacterOfPosition(diag.start);
    console.log(`[Diagnostic] ${diag.file.fileName} (${line + 1},${character + 1}): ${message}`);
  } else {
    console.log(`[Diagnostic] ${message}`);
  }
  if (diag.category === ts.DiagnosticCategory.Error) {
    hasError = true;
  }
}

if (hasError) {
  console.error('[Build Failed] TypeScript errors detected.');
  process.exit(1);
} else {
  console.log('[Build Success] TypeScript compilation completed without errors!');
}
