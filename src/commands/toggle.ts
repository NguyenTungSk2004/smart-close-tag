import * as vscode from 'vscode';
import { ConfigManager } from '../utils/config';
import { wrapWithTagCommand } from './wrapWithTag';

export class ToggleManager implements vscode.Disposable {
  private statusBarItem: vscode.StatusBarItem;
  private configManager: ConfigManager;
  private disposables: vscode.Disposable[] = [];

  constructor() {
    this.configManager = ConfigManager.getInstance();

    this.statusBarItem = vscode.window.createStatusBarItem(
      vscode.StatusBarAlignment.Right,
      100
    );
    this.statusBarItem.command = 'smartCloseTag.showMenu';

    this.updateStatusBar();

    this.disposables.push(
      this.configManager.onDidChange(() => {
        this.updateStatusBar();
      })
    );

    this.disposables.push(
      vscode.commands.registerCommand('smartCloseTag.toggle', () => this.toggle()),
      vscode.commands.registerCommand('smartCloseTag.showMenu', () => this.showMenu()),
      // Backward compatibility command
      vscode.commands.registerCommand('intelliCloseTag.enable', () => this.enableCompat())
    );
  }

  public updateStatusBar(): void {
    const config = this.configManager.getConfig();
    if (!config.showStatusBarItem) {
      this.statusBarItem.hide();
      return;
    }

    if (config.enable) {
      this.statusBarItem.text = '$(tag) Smart Tag: On';
      this.statusBarItem.tooltip = 'Smart Close Tag Pro is ACTIVE (Click for options)';
    } else {
      this.statusBarItem.text = '$(tag) Smart Tag: Off';
      this.statusBarItem.tooltip = 'Smart Close Tag Pro is DISABLED (Click to enable)';
    }

    this.statusBarItem.show();
  }

  public async toggle(): Promise<void> {
    const current = this.configManager.getConfig().enable;
    const newState = !current;
    await this.configManager.setEnabled(newState);

    const msg = newState
      ? 'Smart Close Tag: Đã BẬT thành công! (Active across all files)'
      : 'Smart Close Tag: Đã TẮT.';
    vscode.window.showInformationMessage(msg);
  }

  private async enableCompat(): Promise<void> {
    await this.configManager.setEnabled(true);
    vscode.window.showInformationMessage('Smart Close Tag đã được kích hoạt!');
  }

  public async showMenu(): Promise<void> {
    const config = this.configManager.getConfig();
    const isEnabled = config.enable;

    const items: (vscode.QuickPickItem & { action: () => Promise<void> | void })[] = [
      {
        label: isEnabled ? '$(circle-slash) Tắt Smart Close Tag' : '$(check) Bật Smart Close Tag',
        description: isEnabled ? 'Tạm dừng tự động đóng thẻ' : 'Kích hoạt tự động đóng thẻ',
        action: async () => {
          await this.toggle();
        }
      },
      {
        label: '$(symbol-snippet) Bọc mã với thẻ (Wrap with Tag)',
        description: 'Phím tắt: Alt+W',
        action: async () => {
          await wrapWithTagCommand();
        }
      },
      {
        label: '$(gear) Mở Cài Đặt Smart Close Tag',
        description: 'Tùy chỉnh danh sách ngôn ngữ, void tags, v.v.',
        action: () => {
          vscode.commands.executeCommand('workbench.action.openSettings', 'smartCloseTag');
        }
      }
    ];

    const selected = await vscode.window.showQuickPick(items, {
      title: 'Smart Close Tag Pro - Menu Tác Vụ',
      placeHolder: 'Chọn tác vụ bạn muốn thực hiện'
    });

    if (selected) {
      await selected.action();
    }
  }

  public dispose(): void {
    this.statusBarItem.dispose();
    this.disposables.forEach(d => d.dispose());
  }
}
