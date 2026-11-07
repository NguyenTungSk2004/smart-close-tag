import * as vscode from 'vscode';

export async function wrapWithTagCommand(): Promise<void> {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showInformationMessage('Vui lòng mở một file để sử dụng tính năng bọc thẻ.');
    return;
  }

  const selection = editor.selection;
  const selectedText = editor.document.getText(selection);

  const rawInput = await vscode.window.showInputBox({
    title: 'Smart Close Tag: Wrap Selection with Tag',
    prompt: 'Nhập tên thẻ (hỗ trợ thuộc tính, ví dụ: div, button class="btn", local:Card)',
    placeHolder: 'div class="container"',
    validateInput: (val: string) => {
      const trimmed = val.trim();
      if (!trimmed) {
        return 'Tên thẻ không được để trống.';
      }
      const tagMatch = /^([A-Za-z_][\w\.\:\-]*)/.exec(trimmed);
      if (!tagMatch) {
        return 'Tên thẻ không hợp lệ.';
      }
      return null;
    }
  });

  if (!rawInput) {
    return;
  }

  const trimmed = rawInput.trim();
  const match = /^([A-Za-z_][\w\.\:\-]*)(.*)/.exec(trimmed);
  if (!match) {
    return;
  }

  const tagName = match[1];
  const attributes = match[2].trim();
  const openTag = attributes ? `<${tagName} ${attributes}>` : `<${tagName}>`;
  const closeTag = `</${tagName}>`;

  // Detect indent options
  const tabSize = (editor.options.tabSize as number) || 2;
  const insertSpaces = (editor.options.insertSpaces as boolean) ?? true;
  const indentUnit = insertSpaces ? ' '.repeat(tabSize) : '\t';

  await editor.edit((editBuilder: vscode.TextEditorEdit) => {
    for (const sel of editor.selections) {
      const text = editor.document.getText(sel);

      if (text.includes('\n')) {
        // Multi-line selection: indent inner lines
        const lines = text.split(/\r?\n/);
        const indented = lines.map((line: string) => (line.length > 0 ? indentUnit + line : line)).join('\n');
        const wrapped = `${openTag}\n${indented}\n${closeTag}`;
        editBuilder.replace(sel, wrapped);
      } else {
        // Single line
        const wrapped = `${openTag}${text}${closeTag}`;
        editBuilder.replace(sel, wrapped);
      }
    }
  });
}
