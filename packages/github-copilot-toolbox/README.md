# GitHub Copilot Toolbox (VS Code extension)

**Packaging:** `npm run package` in this folder stages the [monorepo root README](../../README.md) (with GitHub URLs for screenshots) into this `README.md` for the `.vsix`, then restores this extension reference. Use `npm run package:extension-readme-only` only if you must package the file below as-is.

**License:** [MIT](LICENSE) · **Marketplace ID:** `amitchorasiya.github-copilot-toolbox` · **npm package name:** `github-copilot-toolbox`

Install: `code --install-extension amitchorasiya.github-copilot-toolbox` (when published) or install from a built `.vsix`.

**Monorepo home:** [Github-Copilot-ToolBox](https://github.com/amitchorasiya/Github-Copilot-ToolBox) — this folder is `packages/github-copilot-toolbox/`.

---

## Table of contents

- [Overview](#overview)
- [Requirements](#requirements)
- [Features](#features)
- [Hub layout (MCP & skills)](#hub-layout-mcp--skills)
- [Command palette](#command-palette)
- [Settings](#settings)
- [Keybinding](#keybinding)
- [Companion npm packages](#companion-npm-packages)
- [Develop & test](#develop--test)
- [Troubleshooting](#troubleshooting)
- [Migrating from `cursorCopilotKit`](#migrating-from-cursorcopilotkit)
- [License](#license)

---

## Overview

**GitHub Copilot Toolbox** adds an activity bar container **Copilot Toolbox** with:

1. **MCP & skills** — Webview hub: **Intelligence** (default tab), **MCP**, **Skills**, **Workspace**. Lists workspace + user MCP servers, local `SKILL.md` skill folders, registry/skills.sh browse, and toolbox commands.
2. **Workspace kit** — Tree checklist for `.cursor/rules`, `.cursorrules`, `memory-bank/`, `.github/copilot-instructions.md`, `.vscode/mcp.json`, plus wizard and open/reveal actions.
3. **Guide & tools** — Tree of common commands (Intelligence, reference doc, notepad, billing links, etc.).

**Command / setting prefix:** `GitHubCopilotToolBox.*` (since extension v0.4.0). Older builds used `cursorCopilotKit` — see [migration](#migrating-from-cursorcopilotkit).

---

## Requirements

| Requirement | Notes |
|-------------|--------|
| VS Code | **1.99+** (MCP + modern Copilot Chat) |
| GitHub Copilot | Signed in; some flows need **Agent** + MCP tools UI |
| Node.js | **18+** for `npx` bridges (port MCP, memory bank, rules sync) |
| Git | On `PATH` for Intelligence “include git” (Windows: `git.exe`) |

---

## Features

### MCP servers

- Reads **workspace** `.vscode/mcp.json` and **user** `mcp.json` (stable vs **Insiders** via setting).
- Chips / commands: **List servers**, **Browse registry**, **Add server**, **Port Cursor → VS Code** (`npx`), **@mcp** browse.

### Skills tab (local)

Scans these **parents** for subfolders that contain `SKILL.md`:

- **Project:** `.github/skills`, `.claude/skills`, `.agents/skills`, `.cursor/skills`
- **User:** `~/.copilot/skills`, `~/.claude/skills`, `~/.agents/skills`, `~/.cursor/skills`

**Important:** Listing is for **open / reveal in editor**. **GitHub Copilot does not automatically load** these as runtime “skills.” Use chat attachments, instructions files, or MCP for live tools.

### Intelligence

| Capability | Description |
|------------|-------------|
| **Cursor → VS Code & Copilot** | Cards: MCP port, memory bank init, Cursor rules → Copilot (`npx`), plus GitHub links to source repos |
| **Scan MCP & Skills awareness** | Markdown report: configured servers + local skill paths + how Agent/MCP vs skills differ |
| **Auto-scan on folder open** | Optional setting: open awareness report (silent toast) + refresh hub when a workspace folder is added |
| **Context pack** | Privacy-aware quick picks → markdown for Chat (`#file:` hints, optional git/diagnostics) |
| **Readiness** | Markdown checklist: instructions, rules, MCP, mtimes, suggested commands |
| **Migrate skills** | Copy/move `.cursor/skills` → `.agents/skills` (workspace and/or user) |

### Workspace kit & Guide

- Missing items can run **npx** scaffolds or templates; present items **open** or **reveal**.
- **Session notepad**, **inline chat** proxy (**Ctrl+Alt+K** / **Cmd+Alt+K**), **translate @-mentions**, **append `.cursorrules`**, reference webview, env checklist, etc.

Full action table (Guide tree) is in the [Features](#features) section above; see Command Palette for every registered title.

---

## Hub layout (MCP & skills)

- **Intelligence** tab first by default: bridges, then context pack / readiness / scan row; optional **auto-open MCP & Skills** checkbox + **Scan now**.
- **MCP** / **Skills** use **Browse** vs **Installed** sub-tabs and the search box (hidden on Intelligence).
- Footer summarizes skill roots and reminds that Copilot does not auto-ingest `SKILL.md` from those paths.

---

## Command palette

All commands are prefixed with **GitHub Copilot Toolbox:** in the palette. Examples:

- `Intelligence — scan MCP & Skills awareness (report)`
- `Intelligence — build context pack for Chat (copy)`
- `Port Cursor MCP → VS Code (npx)`
- `Open workspace mcp.json` / `Open user mcp.json`

Search `GitHub Copilot Toolbox` or `GitHubCopilotToolBox` in Keyboard Shortcuts to rebind.

---

## Settings

| Setting | Purpose |
|---------|---------|
| `GitHubCopilotToolBox.npxTag` | Dist-tag or version for `npx` (default `latest`) |
| `GitHubCopilotToolBox.useInsidersPaths` | Resolve user `mcp.json` under VS Code Insiders |
| `GitHubCopilotToolBox.intelligence.includeGitByDefault` / `includeDiagnosticsByDefault` | Pre-select context pack options |
| `GitHubCopilotToolBox.intelligence.appendNotepadAfterPack` / `openChatAfterPack` | Pre-select follow-ups after pack |
| `GitHubCopilotToolBox.intelligence.autoScanMcpSkillsOnWorkspaceOpen` | After workspace opens (debounced): auto-open awareness, refresh hub, merge MCP/skills into `.github/copilot-instructions.md`; same merge when you run the scan with this enabled |
| `GitHubCopilotToolBox.translateWrapMultilineInFence` | Wrap multiline translation in a code fence |

**Open filtered settings:** Command **Intelligence — open related settings** → `GitHubCopilotToolBox.intelligence`.

---

## Keybinding

- **Ctrl+Alt+K** (Windows/Linux) / **Cmd+Alt+K** (macOS) → **Open inline chat (Cursor-style)**  
  Do not steal VS Code’s **Ctrl+K** chord globally.

---

## Companion npm packages

| Package | Repo |
|---------|------|
| `cursor-mcp-to-github-copilot-port` | [Github-Copilot-ToolBox](https://github.com/amitchorasiya/Github-Copilot-ToolBox) |
| `cursor-rules-to-github-copilot` | [Github-Copilot-Cursor-Rules-Converter](https://github.com/amitchorasiya/Github-Copilot-Cursor-Rules-Converter) |
| `github-copilot-memory-bank` | [Github-Copilot-Memory-Bank](https://github.com/amitchorasiya/Github-Copilot-Memory-Bank) |

---

## Develop & test

```bash
cd packages/github-copilot-toolbox   # from monorepo root
npm install
npm run compile
npm test
```

- **CI:** `.github/workflows/extension-ci.yml` — Ubuntu, Windows, macOS on changes under this package.
- **Manual:** F5 → **Run Extension: GitHub Copilot Toolbox** (`extensionDevelopmentPath` = this folder).

**Intelligence caveat:** Pasted `#file:` lines may not attach like **Add context**; see [docs/intelligence-verification.md](docs/intelligence-verification.md).

---

## Troubleshooting

| Issue | What to try |
|-------|-------------|
| MCP commands missing | Update VS Code + Copilot; MCP UI differs by version. |
| Port / npx fails | Install Node 18+, check network; set `GitHubCopilotToolBox.npxTag` if you need a pinned CLI version. |
| No skills listed | Ensure a **subfolder** under a scanned root contains **`SKILL.md`** (not only loose files at the root). |
| Copilot “ignores” skills | Expected — use awareness report + attach files or maintain `.github/copilot-instructions.md`. |
| Insiders vs stable user MCP | Toggle `GitHubCopilotToolBox.useInsidersPaths` and reopen hub. |
| Auto-scan every startup | Disable `autoScanMcpSkillsOnWorkspaceOpen` in settings or uncheck the Intelligence hub checkbox. |

---

## Migrating from `cursorCopilotKit`

If you used an older build:

1. In **settings.json**, rename keys `cursorCopilotKit.*` → `GitHubCopilotToolBox.*`.
2. In **keybindings.json**, update `command` strings the same way.
3. Reload the window.

---

## Publishing

From **this directory** only:

```bash
npm run compile
npm run package    # vsce package → .vsix
```

The [LICENSE](LICENSE) file is shipped in the VSIX. See the [monorepo README](../../README.md#publishing-vsix--marketplace) for full publish notes.

---

## License

[MIT](LICENSE) — Copyright (c) 2026 amitchorasiya.
