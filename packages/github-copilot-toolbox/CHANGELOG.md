# Changelog

## 0.5.10

- **Docs:** Add **`00-Copilot Toolbox Access.png`** as the first README / site screenshot with step-by-step **Activity Bar → Copilot Toolbox → Side Bar → MCP & skills**; hero and gallery updated; cache `?v=0.5.10`.

## 0.5.9

- **Docs:** README polish; **GitHub Pages** install buttons use `vscode:extension/…` with Marketplace fallback; screenshot cache query `?v=0.5.9`.

## 0.5.8

- **Legal / clarity:** Expanded **Disclaimer** in the monorepo README; added **Disclaimer** to the extension README, Marketplace `description` pointer, and GitHub Pages footer (with link to repo disclaimer). Not a substitute for legal counsel.

## 0.5.7

- **Docs:** Lead README and GitHub Pages gallery with **`02-intelligence-cursor-port.png`** (Cursor → Copilot port hero); site hero image matches.

## 0.5.6

- **Docs:** Replaced hub screenshots in `screenshots/` with higher-resolution captures (~2.5k width) for readable UI in README, Marketplace, and the GitHub Pages site; bumped site asset cache keys.

## 0.5.5

- **Docs:** README refresh (sales-focused intro, hub UI reference for every control); updated extension screenshots in `screenshots/`.

## 0.5.4

- **Branding:** Marketplace icon file is now `resources/marketplace-icon.png` (still rendered from `icon-marketplace.svg` when packaging) so the Extensions detail view picks up updates instead of a stale cached `icon.png`.

## 0.5.3

- **Branding:** Marketplace icon is generated from `resources/icon-marketplace.svg` into `resources/icon.png` during `npm run package` (vsce does not allow SVG for `icon`).

## 0.5.2

- **Skills hub:** **Turn OFF** / **Turn ON** — hides a skill in the hub (extension workspace/global state); folders stay on disk. **Delete…** still moves the folder to trash and clears any hub-off flag for that skill.
- **Awareness report & copilot-instructions block:** project/user skills that are **off** in the hub are listed separately from skills shown as on.

## 0.5.1

- **MCP hub:** **Turn OFF** / **Turn ON** — removes a server from `mcp.json` and stores its JSON in extension workspace/global state until restored; **Remove** deletes the entry from `mcp.json` and clears stash (with confirmation).
- **Skills hub:** **Delete…** — moves a skill folder to the OS trash when it lives under a known project or user skill root (same conventions as discovery).
- **Awareness report & copilot-instructions block:** active vs Toolbox-stashed (off) MCP servers shown separately.

## 0.5.0

- **Intelligence hub — Context hygiene:** snapshot (workspace/user MCP counts, `copilot-instructions.md` lines) plus actions: Copilot/MCP file scan (Output), append session notepad → `memory-bank`, SKILL.md stub, verification checklist, bundled MCP recipe merge, run first test-like task.
- **Commands:** `copilotToolboxConfigScan`, `appendNotepadToMemoryBank`, `createSkillStub`, `verificationChecklist`, `applyBundledMcpRecipe`, `runFirstWorkspaceTestTask` (see Command Palette).
- **Session notepad** path renamed to `.vscode/copilot-toolbox-notepad.md` (one-time migration from `copilot-kit-notepad.md`).
- **Legal / attribution:** `NOTICE` and description note for MIT-licensed inspiration ([everything-claude-code](https://github.com/affaan-m/everything-claude-code)); sample MCP recipe under `resources/mcp-recipes/`.
- **Readiness / MCP awareness:** optional follow-up actions after opening reports (e.g. open workspace `mcp.json`).
- **Tests:** split MCP/skills merge helpers into `mergeMcpSkillsIntoCopilotInstructionsCore.ts`; Vitest `vscode` alias stub so `npm test` works in Node.
- **Monorepo root:** `package.json` `engines` and `npm run package` for packaging from repo root (avoid `npx vsce` at root).

## 0.4.8

- Extension `README.md`: **Screenshots** section uses `raw.githubusercontent.com` URLs so the VS Code **Extensions** details view shows images (relative `screenshots/` only works from the monorepo root on GitHub).

## 0.4.7

- Packaging: `npm run package` stages the monorepo root `README.md` for the `.vsix` (image links rewritten to `raw.githubusercontent.com`), then restores the extension reference `README.md`.
- Added `@vscode/vsce` devDependency and `package:extension-readme-only` for packaging without swapping README.
- Ignore `scripts/**` in `.vscodeignore` so packaging helpers are not shipped in the VSIX.

## 0.4.6

- Previous release baseline (see git history for details).
