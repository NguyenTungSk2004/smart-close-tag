# Changelog

All notable changes to the **Smart Close Tag** extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.1.0] - 2026-11-07

### 🚀 Added
- **Universal File Support**: Extension now works seamlessly on **ALL** file types (`*`), including React JSX/TSX, Vue, Svelte, PHP, Blade, Astro, Markdown, XML, XAML, AXAML, and unsaved (`untitled`) files.
- **Attributes Support**: Enhanced `TagName/` shorthand to support attributes: e.g. `button class="btn btn-primary" id="sub"/` expands to `<button class="btn btn-primary" id="sub">$0</button>`.
- **Double Slash Self-Closing**: Typing `TagName//` instantly generates self-closing tags `<TagName />$0`.
- **HTML Void Elements Intelligence**: Automatically generates self-closing tags for void elements (`img`, `input`, `br`, `hr`, `meta`, `link`, etc.) instead of redundant paired tags.
- **Real-time Auto-Close on `>`**: Automatically inserts matching closing tag `</tag>` and centers cursor when typing `>` after an opening tag `<tag>`.
- **Smart Completion on `</`**: Automatically scans backwards in the document to find and complete the nearest unclosed opening tag when typing `</`.
- **Wrap Selection with Tag**: New command `smartCloseTag.wrapWithTag` bound to shortcut `Alt+W` (or `Option+W` on macOS) to wrap highlighted code/text with custom tags and automatic indentation.
- **Status Bar Indicator & Quick Menu**: Elegant `$(tag) Smart Tag: On` status bar item with an interactive menu to toggle features, configure settings, or wrap selections.
- **Comprehensive Configuration Schema**: Added 10 customizable settings under `smartCloseTag.*` for fine-grained user control.
- **International SEO Documentation**: Standard English `README.md` with badges, comparison table, and SEO keywords; bilingual Vietnamese `README.vn.md`; and `CONTRIBUTING.md`.
- **Unit Test Suite**: 20 comprehensive unit tests covering all tag parsing, attributes, void elements, and scanners.

### ⚡ Changed
- Upgraded `activationEvents` to `onStartupFinished` for instant, non-blocking activation across all workspaces.
- Removed annoying startup notification popup in favor of the clean Status Bar item.
- Optimized completion priority with `sortText: '0000'` and `preselect: true` for instantaneous Tab/Enter expansion.

### 🐛 Fixed
- Fixed URL and comment false triggers (e.g., `https://domain.com/path/` and `// comment/` no longer trigger tag completions).
- Fixed replacement range calculation for tag shorthand with attributes or duplicate words on the same line.
- Fixed schema restriction that previously blocked execution on remote workspaces (`vscode-remote`, `vscode-vfs`).

---

## [1.0.2] - 2025-08-09

### ⚡ Changed
- Replaced experimental `type` command interception with native VS Code `CompletionItemProvider` for smoother Tab expansion.

---

## [0.0.1] - 2025-01-08

### 🚀 Added
- Initial release with `TagName/` auto-completion for HTML, XML, XAML, and AXAML.
- Automatic cursor positioning between open and close tags.
- Support for special characters in tag names (dots, colons, hyphens).
