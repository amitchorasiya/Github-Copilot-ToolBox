# Changelog

## 0.4.7

- Packaging: `npm run package` stages the monorepo root `README.md` for the `.vsix` (image links rewritten to `raw.githubusercontent.com`), then restores the extension reference `README.md`.
- Added `@vscode/vsce` devDependency and `package:extension-readme-only` for packaging without swapping README.
- Ignore `scripts/**` in `.vscodeignore` so packaging helpers are not shipped in the VSIX.

## 0.4.6

- Previous release baseline (see git history for details).
