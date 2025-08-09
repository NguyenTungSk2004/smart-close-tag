import * as vscode from 'vscode';

const SUPPORTED_LANGUAGES = new Set(['xml', 'xaml', 'AXAML', 'html']);

export function activate(context: vscode.ExtensionContext) {
  console.log('Smart Close Tag extension đã được kích hoạt');

  // Đăng ký completion provider
  const completionProvider = vscode.languages.registerCompletionItemProvider(
    [
      { scheme: 'file', language: 'html' },
      { scheme: 'file', language: 'xml' },
      { scheme: 'file', language: 'xaml' },
      { scheme: 'file', language: 'AXAML' }
    ],
    {
      provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
        const line = document.lineAt(position.line);
        const textBeforeCursor = line.text.slice(0, position.character);
        
        // Kiểm tra pattern TagName/
        const tagMatch = /([A-Za-z_][\w\.\:\-]*)\/$/.exec(textBeforeCursor);
        if (!tagMatch) {
          return [];
        }

        const tagName = tagMatch[1];
        const completionItem = new vscode.CompletionItem(
          `<${tagName}></${tagName}>`,
          vscode.CompletionItemKind.Snippet
        );
        
        completionItem.insertText = new vscode.SnippetString(`<${tagName}>$0</${tagName}>`);
        completionItem.documentation = `Tạo cặp thẻ ${tagName}`;
        completionItem.detail = 'Smart Close Tag';
        
        // Tính toán range để thay thế
        const startPos = textBeforeCursor.lastIndexOf(tagName + '/');
        completionItem.range = new vscode.Range(
          new vscode.Position(position.line, startPos),
          position
        );

        return [completionItem];
      }
    },
    '/' // Trigger character
  );


  // Đăng ký command để enable extension
  const enableCommand = vscode.commands.registerCommand('intelliCloseTag.enable', () => {
    vscode.window.showInformationMessage('Smart Close Tag đã được kích hoạt!');
  });

  context.subscriptions.push(completionProvider, enableCommand);

  // Hiển thị thông báo khi extension được kích hoạt
  vscode.window.showInformationMessage('Smart Close Tag đã sẵn sàng! Gõ TagName/ để hiển thị gợi ý tạo cặp thẻ.');
}

export function deactivate() {
  console.log('Smart Close Tag extension đã được hủy kích hoạt');
}
