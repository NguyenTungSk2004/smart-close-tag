import * as vscode from 'vscode';
import { ConfigManager } from '../utils/config';
import { parseSlashTrigger } from '../utils/tagParser';

export const UNIVERSAL_DOCUMENT_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file' },
  { scheme: 'untitled' },
  { scheme: 'vscode-remote' },
  { scheme: 'vscode-vfs' }
];

export class SmartCloseCompletionProvider implements vscode.CompletionItemProvider {
  private configManager: ConfigManager;

  constructor() {
    this.configManager = ConfigManager.getInstance();
  }

  public provideCompletionItems(
    document: vscode.TextDocument,
    position: vscode.Position
  ): vscode.ProviderResult<vscode.CompletionItem[]> {
    if (!this.configManager.isDocumentEnabled(document)) {
      return [];
    }

    const config = this.configManager.getConfig();
    const line = document.lineAt(position.line);
    const textBeforeCursor = line.text.slice(0, position.character);

    const parsed = parseSlashTrigger(
      textBeforeCursor,
      config.enableAttributesSupport,
      config.selfClosingTags
    );

    if (!parsed) {
      return [];
    }

    const { tagName, attributes, isSelfClosing } = parsed;
    const attrPart = attributes ? ` ${attributes}` : '';

    let label: string;
    let insertSnippet: string;
    let docDescription: string;

    if (isSelfClosing) {
      const selfCloseEnding = config.selfClosingFormat === 'slash' ? ' />' : '>';
      label = `<${tagName}${attrPart}${selfCloseEnding}`;
      insertSnippet = `<${tagName}${attrPart}${selfCloseEnding}$0`;
      docDescription = `Tạo thẻ tự đóng \`${label}\``;
    } else {
      label = `<${tagName}${attrPart}></${tagName}>`;
      insertSnippet = `<${tagName}${attrPart}>$0</${tagName}>`;
      docDescription = `Tạo cặp thẻ đóng mở cho \`<${tagName}>\``;
    }

    const item = new vscode.CompletionItem(label, vscode.CompletionItemKind.Snippet);
    item.insertText = new vscode.SnippetString(insertSnippet);
    item.detail = 'Smart Close Tag (Universal)';
    item.documentation = new vscode.MarkdownString(
      `${docDescription}\n\n*Smart Close Tag Pro - Nhấn Tab hoặc Enter để hoàn thành.*`
    );

    // Replacement range starts from the beginning of the matched tag pattern up to current cursor position
    const startPos = new vscode.Position(position.line, parsed.startIndex);
    item.range = new vscode.Range(startPos, position);

    // Highest priority in suggestion list
    item.sortText = '0000';
    item.preselect = true;

    return [item];
  }
}
