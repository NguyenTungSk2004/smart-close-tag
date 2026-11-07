# Contributing to Smart Close Tag

Thank you for your interest in contributing to **Smart Close Tag**! We welcome contributions from developers of all skill levels. Whether you are fixing bugs, improving documentation, submitting feature suggestions, or creating pull requests, your help is deeply appreciated.

---

## 🛠️ Development Setup

### Prerequisites
- [Visual Studio Code](https://code.visualstudio.com/) (version 1.80.0 or higher)
- [Git](https://git-scm.com/)

### Getting Started

1. **Fork and clone the repository:**
   ```bash
   git clone https://github.com/NguyenTungSk2004/smart-close-tag.git
   cd smart-close-tag
   ```

2. **Open the project in VS Code:**
   ```bash
   code .
   ```

3. **Compile the extension:**
   You can compile TypeScript using the project build runner:
   ```bash
   # Or via npm if available in your environment:
   npm run compile
   ```

4. **Run and Debug in VS Code:**
   - Press `F5` (or click **Run > Start Debugging**).
   - This opens a new **Extension Development Host** window with Smart Close Tag running.
   - You can test typing `div/`, `<section>`, `img/`, `Alt+W`, and observe the status bar item.

---

## 🧪 Testing

We take testing seriously to prevent regressions:
- Unit tests are located in `src/test/tagParser.test.ts`.
- Integration tests are located in `src/test/extension.test.ts`.

To run tests:
```bash
npm test
```

Please make sure all existing tests pass and add new tests for any newly introduced features or bug fixes.

---

## 📝 Commit Conventions

We follow clear and semantic commit messages:
- `feat: add support for custom self-closing format`
- `fix: resolve issue with URLs ending in slashes`
- `docs: update README with new keyboard shortcuts`
- `test: add unit tests for nested XML tags`
- `refactor: clean up tagParser logic`

---

## 🚀 Submitting a Pull Request (PR)

1. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
2. Make your changes and commit them with descriptive messages.
3. Ensure the project compiles cleanly and tests pass.
4. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
5. Open a Pull Request against the `main` branch of this repository.
6. Provide a clear explanation of what your PR accomplishes and any relevant issue numbers.

---

## 💡 Code of Conduct

Please be respectful and constructive in all issues, pull requests, and discussions. We are building an open and welcoming developer community!
