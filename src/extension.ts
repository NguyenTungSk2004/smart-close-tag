import * as vscode from 'vscode';
import { SmartCloseCompletionProvider, UNIVERSAL_DOCUMENT_SELECTOR } from './providers/completionProvider';
import { AutoCloseProvider } from './providers/autoCloseProvider';
import { ToggleManager } from './commands/toggle';
import { wrapWithTagCommand } from './commands/wrapWithTag';

export function activate(context: vscode.ExtensionContext) {
  console.log('[Smart Close Tag] Extension activated successfully.');

  // 1. Register universal completion provider for Tag/ and Tag//
  const completionProvider = vscode.languages.registerCompletionItemProvider(
    UNIVERSAL_DOCUMENT_SELECTOR,
    new SmartCloseCompletionProvider(),
    '/' // Trigger character
  );

  // 2. Register auto-close listener for '>' and '</'
  const autoCloseProvider = new AutoCloseProvider();

  // 3. Register toggle commands and status bar item
  const toggleManager = new ToggleManager();

  // 4. Register wrap with tag command
  const wrapCommand = vscode.commands.registerCommand('smartCloseTag.wrapWithTag', wrapWithTagCommand);

  // Add all disposables to context subscriptions
  context.subscriptions.push(
    completionProvider,
    autoCloseProvider,
    toggleManager,
    wrapCommand
  );
}

export function deactivate() {
  console.log('[Smart Close Tag] Extension deactivated.');
}
