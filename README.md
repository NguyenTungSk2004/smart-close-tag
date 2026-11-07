<p align="center">
  <img src="icon.jpg" alt="Smart Close Tag Logo" width="128" height="128" style="border-radius: 20%;" />
</p>

<h1 align="center">Smart Close Tag</h1>

<p align="center">
  <strong>The ultimate, lightning-fast auto close tag extension for Visual Studio Code.</strong><br>
  Works across <em>ALL</em> file types with zero configuration: HTML, XML, XAML, JSX, TSX, Vue, Svelte, PHP, Blade, Astro, Markdown, and beyond!
</p>

<p align="center">
  <a href="https://marketplace.visualstudio.com/items?itemName=NguyenTungSk2004.smart-close-tag"><img src="https://img.shields.io/visual-studio-marketplace/v/NguyenTungSk2004.smart-close-tag.svg?style=flat-square&color=blue" alt="Marketplace Version" /></a>
  <a href="https://marketplace.visualstudio.com/items?itemName=NguyenTungSk2004.smart-close-tag"><img src="https://img.shields.io/visual-studio-marketplace/i/NguyenTungSk2004.smart-close-tag.svg?style=flat-square&color=success" alt="Installs" /></a>
  <a href="https://marketplace.visualstudio.com/items?itemName=NguyenTungSk2004.smart-close-tag"><img src="https://img.shields.io/visual-studio-marketplace/r/NguyenTungSk2004.smart-close-tag.svg?style=flat-square&color=orange" alt="Rating" /></a>
  <a href="https://github.com/NguyenTungSk2004/smart-close-tag/blob/main/LICENSE"><img src="https://img.shields.io/badge/License-MIT-green.svg?style=flat-square" alt="License: MIT" /></a>
  <a href="https://github.com/NguyenTungSk2004/smart-close-tag"><img src="https://img.shields.io/github/stars/NguyenTungSk2004/smart-close-tag.svg?style=flat-square" alt="GitHub Stars" /></a>
</p>

<p align="center">
  <a href="README.md"><strong>English</strong></a> • 
  <a href="README.vn.md"><strong>Tiếng Việt</strong></a>
</p>

---

## 🌟 Why Smart Close Tag?

Traditional auto-close extensions only work on standard HTML/XML and require clumsy `<tag>` syntax. **Smart Close Tag** elevates your coding productivity with **universal language support**, intuitive **slash shorthand**, attribute intelligence, void tag awareness, and real-time tag wrapping.

Whether you write **React (JSX/TSX)**, **Vue**, **Svelte**, **XAML/AXAML**, **PHP/Blade**, **Astro**, **XML**, or custom template engines, Smart Close Tag works instantly out of the box with zero setup required.

---

## 🚀 Key Features

| Trigger / Shortcut | Action | Result (`|` indicates cursor) |
| :--- | :--- | :--- |
| `div/` + `Tab` / `Enter` | Single Tag Shorthand | `<div>\|</div>` |
| `button class="btn btn-primary" id="submit"/` + `Tab` | Shorthand with Attributes | `<button class="btn btn-primary" id="submit">\|</button>` |
| `img/` + `Tab` / `Enter` | Void / Self-Closing Tag | `<img />\|` |
| `Component//` + `Tab` / `Enter` | Force Self-Closing | `<Component />\|` |
| `<section>` (typing `>`) | Real-time Auto-Close | `<section>\|</section>` |
| `</` (typing `</`) | Auto-Complete Matching Tag | Auto-completes the nearest open tag `</tag>` |
| `Alt + W` (or `Option + W`) | Wrap Selection with Tag | Wraps selected text/code inside custom tag |

---

## 💡 Feature Showcase

### 1. Universal Language Support (No File Type Limits)
Smart Close Tag is **not restricted** to HTML or XML. It activates smoothly across:
- **Web Frontend**: HTML5, React JSX, React TSX, Vue SFC (`.vue`), Svelte, Astro, Angular templates
- **Mobile & Desktop**: XAML (.xaml), Avalonia XAML (.axaml), MAUI, WPF
- **Backend & Templates**: PHP, Blade (.blade.php), Twig, Liquid, ERB, Smarty, ASP.NET, Handlebars
- **Data & Markup**: XML, SVG, MathML, RSS, Markdown (.md), and even unsaved (`untitled`) files!

### 2. Fast Tag Expansion (`TagName/`)
Simply type the tag name followed by a forward slash `/`, then press `Tab` or `Enter`.
```html
div/               → <div>|</div>
Grid.Row/          → <Grid.Row>|</Grid.Row>
local:UserCard/    → <local:UserCard>|</local:UserCard>
custom-element/    → <custom-element>|</custom-element>
```

### 3. Full Attribute Intelligence
Want attributes inside your tag before closing? Just type them naturally before `/`!
```html
div class="container mx-auto" id="app"/
→ <div class="container mx-auto" id="app">|</div>

input type="email" required placeholder="name@email.com"/
→ <input type="email" required placeholder="name@email.com" />
```

### 4. Smart Self-Closing Tags (`TagName//` & Void Elements)
- **Automatic Void Detection**: Standard HTML void elements (`img`, `input`, `br`, `hr`, `meta`, `link`, etc.) automatically generate self-closing tags `<img />` instead of redundant paired tags.
- **Double-Slash Shorthand**: For any custom component or React element, simply append `//`:
```jsx
Avatar src={user.photo}//  → <Avatar src={user.photo} />
```

### 5. Instant Auto-Close on `>` and `</`
- Typing `>` after `<MyComponent>` automatically inserts `</MyComponent>` and centers your cursor.
- Typing `</` scans backwards and completes the nearest unmatched open tag.

### 6. Wrap Selection with Tag (`Alt + W`)
1. Select any code block or text snippet.
2. Press `Alt + W` (Windows/Linux) or `Option + W` (macOS).
3. Type your desired tag (e.g., `div class="card"` or `ScrollView`).
4. Press `Enter` — your selection is neatly wrapped with proper indentation!

### 7. Sleek Status Bar & Quick Menu
Click the `$(tag) Smart Tag: On` item in the VS Code status bar to quickly toggle the extension, open configuration settings, or trigger tag wrapping.

---

## ⚙️ Extension Settings

Customize Smart Close Tag in **File > Preferences > Settings** (or press `Ctrl+,` and search for `smartCloseTag`):

| Setting | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `smartCloseTag.enable` | `boolean` | `true` | Enable or disable Smart Close Tag features globally. |
| `smartCloseTag.enableForAllFiles` | `boolean` | `true` | Enable Smart Close Tag across all file types (`*`). |
| `smartCloseTag.includedLanguages` | `array` | `["*"]` | List of language IDs where Smart Close Tag is active (supports `*` wildcard). |
| `smartCloseTag.excludedLanguages` | `array` | `[]` | List of language IDs to explicitly exclude (e.g. `["plaintext"]`). |
| `smartCloseTag.enableAttributesSupport` | `boolean` | `true` | Allow typing attributes before `/` (e.g. `div class="box"/`). |
| `smartCloseTag.enableAutoCloseOnGreaterThan` | `boolean` | `true` | Automatically insert matching closing tag when typing `>`. |
| `smartCloseTag.enableAutoCloseOnSlash` | `boolean` | `true` | Automatically complete matching closing tag when typing `</`. |
| `smartCloseTag.selfClosingFormat` | `string` | `"slash"` | Self-closing format: `"slash"` (`<img />`) or `"void"` (`<img>`). |
| `smartCloseTag.selfClosingTags` | `array` | `[]` | Additional custom tag names to treat as self-closing void elements. |
| `smartCloseTag.showStatusBarItem` | `boolean` | `true` | Show the Smart Close Tag status bar indicator. |

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Command | When |
| :--- | :--- | :--- |
| `Alt + W` (Win/Linux) / `Option + W` (Mac) | `smartCloseTag.wrapWithTag` | In editor with text selected |
| `Tab` or `Enter` | Accept Tag Expansion | When autocomplete dropdown displays tag snippet |

---

## 📊 Comparison: Smart Close Tag vs Alternatives

| Feature | Built-in VS Code | Auto Close Tag | Smart Close Tag Pro |
| :--- | :---: | :---: | :---: |
| Works in ANY file type (`*`) | ❌ | ❌ (HTML/XML only) | **✅ Full Universal** |
| `TagName/` Shorthand | ❌ | ❌ | **✅ Yes** |
| Tag with Attributes (`tag class="x"/`) | ❌ | ❌ | **✅ Yes** |
| Double Slash Self-Closing (`Tag//`) | ❌ | ❌ | **✅ Yes** |
| Void Element Recognition (`img`, `input`) | Partial | ❌ | **✅ Fully Configurable** |
| Auto Close on `>` | HTML only | ✅ | **✅ Universal** |
| Auto Complete on `</` | HTML only | ✅ | **✅ Universal** |
| Wrap Selection with Tag (`Alt+W`) | ❌ | ❌ | **✅ Built-in** |
| Interactive Status Bar & Quick Menu | ❌ | ❌ | **✅ Included** |

---

## 📦 Installation

### Option 1: Via VS Code Marketplace (Recommended)
<p>
  <a href="https://marketplace.visualstudio.com/items?itemName=NguyenTungSk2004.smart-close-tag">
    <img src="https://img.shields.io/badge/Visual_Studio_Marketplace-Install_Free-007ACC?style=for-the-badge&logo=visual-studio-code&logoColor=white" alt="Install from Marketplace" />
  </a>
</p>

1. Open **Visual Studio Code**.
2. Press `Ctrl + Shift + X` (or `Cmd + Shift + X` on macOS) to open the Extensions view.
3. Search for `Smart Close Tag` (or `NguyenTungSk2004.smart-close-tag`).
4. Click **Install**.

### Option 2: Via VS Code Quick Open
Press `Ctrl + P` (or `Cmd + P` on macOS) and run:
```bash
ext install NguyenTungSk2004.smart-close-tag
```

### Option 3: Via Command Line (CLI)
```bash
code --install-extension NguyenTungSk2004.smart-close-tag
```

---

## ⭐ Support & Reviews

If **Smart Close Tag** saves you time and boosts your productivity, please consider giving it a **[5-star review on VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=NguyenTungSk2004.smart-close-tag&ssr=false#review-details)** and starring the [GitHub repository](https://github.com/NguyenTungSk2004/smart-close-tag)! Your support helps the extension reach more developers worldwide.

---

## 🤝 Contributing

Contributions, bug reports, and feature requests are very welcome!
Please check out our [Contributing Guide](CONTRIBUTING.md) to get started.

- GitHub Repository: [https://github.com/NguyenTungSk2004/smart-close-tag](https://github.com/NguyenTungSk2004/smart-close-tag)
- Report Issues: [Issue Tracker](https://github.com/NguyenTungSk2004/smart-close-tag/issues)

---

## 📄 License

This extension is licensed under the [MIT License](LICENSE).

Made with ❤️ by [NguyenTungSk2004](https://github.com/NguyenTungSk2004).
