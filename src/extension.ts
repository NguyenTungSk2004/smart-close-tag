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

  // Intercept 'type' command để bắt phím Tab
  const typeCommand = vscode.commands.registerCommand('type', async (args: { text: string }) => {
    const editor = vscode.window.activeTextEditor;
    
    // Chuyển tiếp tất cả các ký tự khác ngoài Tab
    if (!editor || !args || args.text !== '\t') {
      return vscode.commands.executeCommand('default:type', args);
    }

    const document = editor.document;
    const position = editor.selection.active;
    const languageId = document.languageId;
    
    // Chỉ xử lý trong các ngôn ngữ được hỗ trợ
    if (!SUPPORTED_LANGUAGES.has(languageId)) {
      return vscode.commands.executeCommand('default:type', args);
    }

    // Lấy text từ đầu dòng đến vị trí con trỏ
    const line = document.lineAt(position.line);
    const textBeforeCursor = line.text.slice(0, position.character);
    
    // Pattern để match TagName/
    const tagPattern = /([A-Za-z_][\w\.\:\-]*)\/$/.exec(textBeforeCursor);
    
    if (!tagPattern) {
      return vscode.commands.executeCommand('default:type', args);
    }

    const tagName = tagPattern[1];

    // Tính toán vùng cần thay thế
    const startPosition = textBeforeCursor.lastIndexOf(tagName + '/');
    const replaceRange = new vscode.Range(
      new vscode.Position(position.line, startPosition),
      position
    );

    // Thực hiện thay thế
    try {
      const success = await editor.edit(editBuilder => {
        editBuilder.replace(replaceRange, `<${tagName}></${tagName}>`);
      });

      if (success) {
        // Đặt con trỏ vào giữa cặp thẻ
        const cursorPosition = new vscode.Position(
          position.line, 
          startPosition + tagName.length + 2 // độ dài của "<tagName>"
        );
        editor.selection = new vscode.Selection(cursorPosition, cursorPosition);
        
        console.log(`Đã tạo cặp thẻ: <${tagName}></${tagName}>`);
        return; // Không thực hiện tab mặc định
      }
    } catch (error) {
      console.error('Lỗi khi tạo cặp thẻ:', error);
    }
    
    // Fallback: thực hiện tab bình thường
    return vscode.commands.executeCommand('default:type', args);
  });

  // Đăng ký command để enable extension
  const enableCommand = vscode.commands.registerCommand('intelliCloseTag.enable', () => {
    vscode.window.showInformationMessage('Smart Close Tag đã được kích hoạt!');
  });

  context.subscriptions.push(completionProvider, typeCommand, enableCommand);

  // Hiển thị thông báo khi extension được kích hoạt
  vscode.window.showInformationMessage('Smart Close Tag đã sẵn sàng! Gõ TagName/ rồi nhấn Tab để tạo cặp thẻ.');
}

export function deactivate() {
  console.log('Smart Close Tag extension đã được hủy kích hoạt');
}
