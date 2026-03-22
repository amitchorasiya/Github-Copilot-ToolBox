# GitHub Copilot Toolbox (VS Code extension)

## One place for Copilot-related setup

**In plain terms:** Copilot only works as well as the setup around it—but that setup is usually scattered across files, machines, and habits. **GitHub Copilot Toolbox** is **one dedicated Copilot Toolbox in VS Code**: you can **see** what’s configured, **standardize** how teams move to Copilot (including from Cursor), and **give Chat better context** while each developer still **chooses** what to share.

**For engineering teams, that means:**

- **Faster path from Cursor to Copilot** — guided actions to port connections (MCP), rules, and scaffold a memory bank.
- **Discover and add servers and skills from one hub** — browse catalogs, see what’s already installed, fewer raw config edits.
- **A single checklist view** — workspace vs personal setup, local skill folders, rules, instructions, and memory bank so the repo matches what you think you shipped.
- **Smarter context for Chat** — structured “context packs” and readiness flows, with **explicit** choices so teams stay aligned on what Copilot is allowed to see.

---

**Packaging:** `npm run package` in this folder stages the [monorepo root README](../../README.md) (with GitHub URLs for screenshots) into this `README.md` for the `.vsix`, then restores this extension reference. Use `npm run package:extension-readme-only` only if you must package the file below as-is.

**License:** [MIT](LICENSE) · **Marketplace ID:** `amitchorasiya.github-copilot-toolbox` · **npm package name:** `github-copilot-toolbox`

Install: `code --install-extension amitchorasiya.github-copilot-toolbox` (when published) or install from a built `.vsix`.

**Monorepo home:** [Github-Copilot-ToolBox](https://github.com/amitchorasiya/Github-Copilot-ToolBox) — this folder is `packages/github-copilot-toolbox/`.

---

## Table of contents

- [One place for Copilot-related setup](#one-place-for-copilot-related-setup)
- [Screenshots](#screenshots)
- [MCP & skills hub: every tab, toggle, and button](#mcp--skills-hub-every-tab-toggle-and-button)
- [Requirements](#requirements)
- [Features (at a glance)](#features-at-a-glance)
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

**GitHub Copilot Toolbox** adds **Copilot Toolbox** with:

1. **MCP & skills** — Webview hub: **Intelligence** (default), **MCP**, **Skills**, **Workspace** (checklist + every toolbox command as searchable tiles).
2. **Workspace kit** — Tree checklist for rules, memory bank, `copilot-instructions.md`, `mcp.json`, wizard.
3. **Guide & tools** — Tree of shortcuts to the same flows.

**Command / setting prefix:** `GitHubCopilotToolBox.*` (since extension v0.4.0). Older builds used `cursorCopilotKit` — see [migration](#migrating-from-cursorcopilotkit).

VS Code resolves README images relative to this package folder. Screenshots live at the [monorepo `screenshots/`](https://github.com/amitchorasiya/Github-Copilot-ToolBox/tree/main/screenshots) root, so embeds below use **absolute** `raw.githubusercontent.com` URLs (same as the published `.vsix` / Marketplace README).

## Screenshots

**What you get after install**—real hub UI, not mockups. Captures are **high-resolution** (~2.5k width) for legible detail in the Marketplace and on GitHub.

**Intelligence** (hub): **Port Cursor → Copilot** (MCP, rules, memory bank), then broader bridges, context pack, readiness, MCP & Skills scan.

![Intelligence: Port Cursor MCP, rules, and memory bank to VS Code & Copilot](https://raw.githubusercontent.com/amitchorasiya/Github-Copilot-ToolBox/main/screenshots/02-intelligence-cursor-port.png?v=0.5.7)

![Intelligence tab: Cursor to VS Code and Copilot bridges](https://raw.githubusercontent.com/amitchorasiya/Github-Copilot-ToolBox/main/screenshots/01-intelligence-cursor-to-vscode-copilot.png?v=0.5.7)

![Intelligence: context pack and readiness actions](https://raw.githubusercontent.com/amitchorasiya/Github-Copilot-ToolBox/main/screenshots/02-intelligence-context-readiness.png?v=0.5.7)

**MCP**: installed workspace/user servers and registry browse.

![MCP: installed workspace servers (Browse / Installed)](https://raw.githubusercontent.com/amitchorasiya/Github-Copilot-ToolBox/main/screenshots/03-mcp-browse-workspace-servers.png?v=0.5.7)

![MCP: registry browse & search](https://raw.githubusercontent.com/amitchorasiya/Github-Copilot-ToolBox/main/screenshots/04-mcp-registry-search.png?v=0.5.7)

**Skills**: catalog (skills.sh) and local installed `SKILL.md` trees.

![Skills: catalog (skills.sh)](https://raw.githubusercontent.com/amitchorasiya/Github-Copilot-ToolBox/main/screenshots/05-skills-catalog-skills-sh.png?v=0.5.7)

![Skills: installed local skill folders](https://raw.githubusercontent.com/amitchorasiya/Github-Copilot-ToolBox/main/screenshots/06-skills-installed-local.png?v=0.5.7)

**Workspace** checklist and **Intelligence** hub (context hygiene).

![Workspace kit checklist](https://raw.githubusercontent.com/amitchorasiya/Github-Copilot-ToolBox/main/screenshots/07-workspace-checklist.png?v=0.5.7)

![Intelligence: context hygiene, snapshot, and quick actions](https://raw.githubusercontent.com/amitchorasiya/Github-Copilot-ToolBox/main/screenshots/08-workspace-toolbox-commands.png?v=0.5.7)

**Reference diagram** (Mermaid export; not a live UI capture).

![Cursor vs Copilot capability map (diagram)](https://raw.githubusercontent.com/amitchorasiya/Github-Copilot-ToolBox/main/screenshots/mermaid-copilot-map.png?v=0.5.7)

---

## MCP & skills hub: every tab, toggle, and button

Open **MCP & skills** from the **Copilot Toolbox** activity bar. Same reference as the [monorepo README](https://github.com/amitchorasiya/Github-Copilot-ToolBox#mcp--skills-hub-every-tab-toggle-and-button); duplicated here for package-folder readers.

### Main tabs (top)

| Tab | Purpose |
|-----|---------|
| **Intelligence** | Bridges, **Context hygiene** tiles, **Context & readiness**, auto-scan controls. Default tab. |
| **MCP** | **Browse** registry or **Installed** workspace + user `mcp.json` servers. |
| **Skills** | **Browse** skills.sh or **Installed** local `SKILL.md` folders under standard roots. |
| **Workspace** | **Workspace checklist** and **All toolbox commands** (searchable tiles). |

### Browse vs Installed (MCP and Skills)

| Sub-tab | Purpose |
|---------|---------|
| **Browse** | Remote catalog search; **MCP → Browse** shows an extra **chip** row. |
| **Installed** | Filter/manage on-disk config and discovered skills. |

### Auto-scan row (Intelligence only)

| Control | What it does |
|---------|----------------|
| **Checkbox** | `GitHubCopilotToolBox.intelligence.autoScanMcpSkillsOnWorkspaceOpen` — on folder open: awareness report, hub refresh, merge MCP/skills block into `.github/copilot-instructions.md`; same merge when **Scan now** runs with this on. |
| **Scan now** | Runs awareness + refresh now (and instructions merge when checkbox on). |

### Search box

Hidden on **Intelligence**. Elsewhere: filters registry/skills results, installed servers/skills, or workspace command tiles.

### MCP chips (MCP → Browse)

| Chip | Action |
|------|--------|
| **Registry** | `workbench.mcp.browseServers` |
| **Add server** | `workbench.mcp.addConfiguration` |
| **List (native)** | `workbench.mcp.listServer` |
| **Port Cursor → VS Code** | `npx` cursor MCP port bridge |
| **@mcp registry** | Extension registry browse |
| **Refresh** | Reload hub payload |

### Intelligence → Context hygiene

| Tile | Action |
|------|--------|
| **Snapshot** | Read-only MCP + instructions file stats. |
| **Scan Copilot/MCP files** | Heuristic secret-shaped scan → Output. |
| **Notepad → memory-bank** | Append session notepad into `memory-bank/**/*.md`. |
| **New SKILL.md stub** | `.github/skills/<name>/SKILL.md`. |
| **Verification checklist** | Multi-pick pre-ship checklist. |
| **Bundled MCP recipe** | Merge sample server into `.vscode/mcp.json`. |
| **Run first test task** | Run a `tasks.json` task (heuristic). |

### Intelligence → Cursor → VS Code & Copilot

| Primary button | Action |
|----------------|--------|
| **Run npx port** | Port Cursor `mcp.json` → VS Code. |
| **GitHub** | Port CLI repo. |
| **Run npx init** | Memory bank `npx` scaffold + instructions merge. |
| **GitHub** | Memory bank repo. |
| **Run converter** | Cursor rules → Copilot instruction files. |
| **GitHub** | Converter repo. |
| **Run migration** | `.cursor/skills` → `.agents/skills`. |

### Intelligence → Context & readiness

| Button | Action |
|--------|--------|
| **Run scan** | MCP & Skills awareness markdown report. |
| **Build pack** | Context pack for Chat (quick picks). |
| **Run readiness** | Readiness markdown summary. |
| **Open settings** | Intelligence-related settings. |

### MCP → Browse / Installed

- **Install** / **Load more** on registry cards (Browse).
- **Turn OFF / Turn ON / Remove / Edit mcp.json** on installed server cards (stash behavior for OFF/ON; Remove clears stash/entry).

### Skills → Browse / Installed

- **Install (project)** / **Install (global)** on catalog cards.
- **Turn OFF / Turn ON / Delete… / Open SKILL.md / Reveal folder** on installed skill cards.

### Workspace

- Checklist: **Run wizard**, **Open**, **Create / sync** per row.
- **All toolbox commands**: grouped tiles (Intelligence, Chat & session, Rules & instructions, MCP bridges, Workspace setup, Docs & environment)—each tile runs the matching **`GitHubCopilotToolBox.*`** command.

### Footer

Legend for skill roots and MCP/skill **Turn OFF** semantics.

### View title

**Refresh** on **MCP & skills** and **Workspace kit** views reloads state.

---

## Requirements

| Requirement | Notes |
|-------------|--------|
| VS Code | **1.99+** (MCP + modern Copilot Chat) |
| GitHub Copilot | Signed in; some flows need **Agent** + MCP tools UI |
| Node.js | **18+** for `npx` bridges (port MCP, memory bank, rules sync) |
| Git | On `PATH` for Intelligence “include git” (Windows: `git.exe`) |

---

## Features (at a glance)

- **One hub for MCP + skills:** Workspace and user **`mcp.json`**, **registry** and **skills.sh** browse, **Turn OFF** stash for servers, **hub-only hide** for skills, **Install** flows without leaving VS Code.
- **Intelligence that matches how teams work:** **Awareness report**, **context pack**, **readiness**, **config scan**, **notepad → memory-bank**, **bundled MCP recipes**, **verification**—each available as a labeled button or tile.
- **Cursor → Copilot bridges in the UI:** Port MCP, init memory bank, sync rules, migrate skill folders—**`npx`** behind primary buttons, **GitHub** links for source.
- **Workspace kit tree:** Same checklist targets (rules, memory bank, instructions, `mcp.json`) with **Open** / **Create** / **wizard**.
- **No false promises on skills:** Local **`SKILL.md`** trees are **discovered and openable**; the UI states clearly that **Copilot does not auto-load** arbitrary skill folders—use attachments, instructions, or MCP for live tools.

**Every hub control** is documented in [MCP & skills hub: every tab, toggle, and button](#mcp--skills-hub-every-tab-toggle-and-button). **Every command title** appears under **GitHub Copilot Toolbox:** in the Command Palette.

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
