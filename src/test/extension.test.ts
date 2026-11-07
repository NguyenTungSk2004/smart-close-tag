import * as assert from 'assert';
import * as vscode from 'vscode';

suite('Smart Close Tag Integration Test Suite', () => {
  test('Commands are registered', async () => {
    const allCommands = await vscode.commands.getCommands(true);
    assert.ok(allCommands.includes('smartCloseTag.toggle'), 'smartCloseTag.toggle should be registered');
    assert.ok(allCommands.includes('smartCloseTag.wrapWithTag'), 'smartCloseTag.wrapWithTag should be registered');
    assert.ok(allCommands.includes('smartCloseTag.showMenu'), 'smartCloseTag.showMenu should be registered');
    assert.ok(allCommands.includes('intelliCloseTag.enable'), 'intelliCloseTag.enable should be registered');
  });

  test('Completion provider is available on untitled documents', async () => {
    const doc = await vscode.workspace.openTextDocument({
      language: 'javascript',
      content: 'Button/'
    });
    const position = new vscode.Position(0, 7);
    const list = await vscode.commands.executeCommand<vscode.CompletionList>(
      'vscode.executeCompletionItemProvider',
      doc.uri,
      position,
      '/'
    );

    assert.ok(list, 'Completion list should be returned');
    assert.ok(list.items.length > 0, 'Should return at least one completion item');
    const item = list.items.find((i: vscode.CompletionItem) => typeof i.label === 'string' && i.label.includes('Button'));
    assert.ok(item, 'Should have completion for Button');
  });
});
