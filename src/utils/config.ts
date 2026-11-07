import * as vscode from 'vscode';

export interface SmartCloseTagConfig {
  enable: boolean;
  enableForAllFiles: boolean;
  includedLanguages: string[];
  excludedLanguages: string[];
  enableAttributesSupport: boolean;
  enableAutoCloseOnGreaterThan: boolean;
  enableAutoCloseOnSlash: boolean;
  selfClosingFormat: 'slash' | 'void';
  selfClosingTags: string[];
  showStatusBarItem: boolean;
}

const DEFAULT_SELF_CLOSING_TAGS = [
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr'
];

export class ConfigManager {
  private static instance: ConfigManager;
  private config!: SmartCloseTagConfig;
  private onDidChangeEmitter = new vscode.EventEmitter<SmartCloseTagConfig>();
  public readonly onDidChange = this.onDidChangeEmitter.event;

  private constructor() {
    this.reloadConfig();
    vscode.workspace.onDidChangeConfiguration((e: vscode.ConfigurationChangeEvent) => {
      if (e.affectsConfiguration('smartCloseTag')) {
        this.reloadConfig();
        this.onDidChangeEmitter.fire(this.config);
      }
    });
  }

  public static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  public reloadConfig(): void {
    const ws = vscode.workspace.getConfiguration('smartCloseTag');
    const customSelfClosing = ws.get<string[]>('selfClosingTags', []);
    const mergedSelfClosing = Array.from(new Set([...DEFAULT_SELF_CLOSING_TAGS, ...customSelfClosing]));

    this.config = {
      enable: ws.get<boolean>('enable', true),
      enableForAllFiles: ws.get<boolean>('enableForAllFiles', true),
      includedLanguages: ws.get<string[]>('includedLanguages', ['*']),
      excludedLanguages: ws.get<string[]>('excludedLanguages', []),
      enableAttributesSupport: ws.get<boolean>('enableAttributesSupport', true),
      enableAutoCloseOnGreaterThan: ws.get<boolean>('enableAutoCloseOnGreaterThan', true),
      enableAutoCloseOnSlash: ws.get<boolean>('enableAutoCloseOnSlash', true),
      selfClosingFormat: ws.get<'slash' | 'void'>('selfClosingFormat', 'slash'),
      selfClosingTags: mergedSelfClosing,
      showStatusBarItem: ws.get<boolean>('showStatusBarItem', true)
    };
  }

  public getConfig(): SmartCloseTagConfig {
    return this.config;
  }

  /**
   * Check whether Smart Close Tag features should run for a given document
   */
  public isDocumentEnabled(document: vscode.TextDocument): boolean {
    if (!this.config.enable) {
      return false;
    }

    const languageId = document.languageId;

    // Check explicit exclusion list first
    if (this.config.excludedLanguages && this.config.excludedLanguages.includes(languageId)) {
      return false;
    }

    // If universal mode is on, all languages are enabled
    if (this.config.enableForAllFiles) {
      return true;
    }

    // Check included languages (supports '*' wildcard)
    if (
      this.config.includedLanguages.includes('*') ||
      this.config.includedLanguages.includes(languageId)
    ) {
      return true;
    }

    return false;
  }

  public async setEnabled(value: boolean, target: vscode.ConfigurationTarget = vscode.ConfigurationTarget.Global): Promise<void> {
    const ws = vscode.workspace.getConfiguration('smartCloseTag');
    await ws.update('enable', value, target);
  }
}
