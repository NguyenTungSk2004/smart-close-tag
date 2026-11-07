import * as vscode from 'vscode';
import { ConfigManager } from '../utils/config';
import { parseOpenTagOnGreaterSign, findMatchingOpenTag } from '../utils/tagParser';

export class AutoCloseProvider implements vscode.Disposable {
  private configManager: ConfigManager;
  private disposable: vscode.Disposable;
  private isProcessingEdit = false;

  constructor() {
    this.configManager = ConfigManager.getInstance();
    this.disposable = vscode.workspace.onDidChangeTextDocument(this.handleDocumentChange, this);
  }

  public dispose(): void {
    this.disposable.dispose();
  }

  private async handleDocumentChange(event: vscode.TextDocumentChangeEvent): Promise<void> {
    if (this.isProcessingEdit || event.contentChanges.length === 0) {
      return;
    }

    const editor = vscode.window.activeTextEditor;
    if (!editor || editor.document !== event.document) {
      return;
    }

    if (!this.configManager.isDocumentEnabled(event.document)) {
      return;
    }

    const config = this.configManager.getConfig();

    for (const change of event.contentChanges) {
      // 1. Check if user typed '>'
      if (change.text === '>' && config.enableAutoCloseOnGreaterThan) {
        await this.handleGreaterSign(editor, change, config.selfClosingTags);
      }
      // 2. Check if user typed '/' right after '<'
      else if (change.text === '/' && config.enableAutoCloseOnSlash) {
        await this.handleSlashSign(editor, change, config.selfClosingTags);
      }
    }
  }

  private async handleGreaterSign(
    editor: vscode.TextEditor,
    change: vscode.TextDocumentContentChangeEvent,
    selfClosingTags: string[]
  ): Promise<void> {
    const document = editor.document;
    const cursorPos = change.range.start.translate(0, 1);
    const line = document.lineAt(cursorPos.line);
    const textBeforeCursor = line.text.slice(0, cursorPos.character);

    const openTag = parseOpenTagOnGreaterSign(textBeforeCursor, selfClosingTags);
    if (!openTag) {
      return;
    }

    this.isProcessingEdit = true;
    try {
      const closeTagText = `</${openTag}>`;
      const success = await editor.edit(
        (editBuilder: vscode.TextEditorEdit) => {
          editBuilder.insert(cursorPos, closeTagText);
        },
        { undoStopBefore: false, undoStopAfter: false }
      );

      if (success) {
        // Place cursor between open and close tag
        editor.selection = new vscode.Selection(cursorPos, cursorPos);
      }
    } finally {
      this.isProcessingEdit = false;
    }
  }

  private async handleSlashSign(
    editor: vscode.TextEditor,
    change: vscode.TextDocumentContentChangeEvent,
    selfClosingTags: string[]
  ): Promise<void> {
    const document = editor.document;
    const cursorPos = change.range.start.translate(0, 1);
    const line = document.lineAt(cursorPos.line);
    const textBeforeCursor = line.text.slice(0, cursorPos.character);

    // Only trigger if typing '</'
    if (!textBeforeCursor.endsWith('</')) {
      return;
    }

    // Limit backward scan up to 500 lines above cursor for high performance
    const startLine = Math.max(0, cursorPos.line - 500);
    const rangeToScan = new vscode.Range(new vscode.Position(startLine, 0), cursorPos);
    const textToScan = document.getText(rangeToScan);

    const matching = findMatchingOpenTag(textToScan, selfClosingTags);
    if (!matching) {
      return;
    }

    this.isProcessingEdit = true;
    try {
      const completionText = `${matching.tagName}>`;
      await editor.edit(
        (editBuilder: vscode.TextEditorEdit) => {
          editBuilder.insert(cursorPos, completionText);
        },
        { undoStopBefore: false, undoStopAfter: false }
      );
    } finally {
      this.isProcessingEdit = false;
    }
  }
}
