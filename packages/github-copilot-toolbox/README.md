# Github Copilot ToolBox (MCP, Skills, Cursor/Claude → Copilot)

## After install: open Copilot Toolbox

**Not a standalone app**—inside **Visual Studio Code** (this package) or a **JetBrains IDE** via the [sibling plugin](https://github.com/amitchorasiya/Github-Copilot-ToolBox/tree/main/packages/github-copilot-toolbox-intellij) (same hub UI).

1. Install **Github Copilot ToolBox (MCP, Skills, Cursor/Claude → Copilot)**, then **reload the window** if prompted.
2. **Activity Bar** (icons on the **far left**) → click **Copilot Toolbox** (outline **brain** — twin lobes; **`currentColor`**; tight `viewBox` so it matches default bar icon scale).
3. **Side Bar** → click **MCP & skills** to open the **hub** (tabs: **Intelligence**, **MCP**, **Skills**, **Workspace**, **Awesomeness**). Tabs show **emoji** plus a **tint per section**; **`aria-label`** uses plain names. From the **secondary sidebar** (beside Chat), the hub lives under the short container title **Copilot Toolbox** (same wording as the Activity Bar).

**Missing the icon?** **Command Palette** (**Ctrl+Shift+P** / **⌘⇧P**) → type **GitHub Copilot Toolbox** → run a command, or **Developer: Reload Window**, then repeat steps 2–3.

![Activity Bar → Copilot Toolbox; Side Bar → MCP & skills hub](https://raw.githubusercontent.com/amitchorasiya/Github-Copilot-ToolBox/main/screenshots/00-copilot-toolbox-access.png?v=1.0.17)

## One place for Copilot-related setup

**In plain terms:** Copilot only works as well as the setup around it—but that setup is usually scattered across files, machines, and habits. **Github Copilot ToolBox (MCP, Skills, Cursor/Claude → Copilot)** is **one dedicated Copilot Toolbox** in [**VS Code**](https://marketplace.visualstudio.com/items?itemName=amitchorasiya.github-copilot-toolbox) or a [**JetBrains IDE**](https://plugins.jetbrains.com/search?search=Github+Copilot+ToolBox) (same hub): you can **see** what’s configured, **standardize** how teams move to Copilot (**from Cursor, Claude Code, or both**), and **give Chat better context** while each developer still **chooses** what to share.

**For engineering teams, that means:**

- **Faster path from Cursor or Claude Code to Copilot** — MCP ports, Cursor rules or **`CLAUDE.md`**, skill-folder migration (**.cursor** or **.claude**), project **`.mcp.json`**, memory bank — including **One Click** with **dual migration tracks** (bundled CLIs where applicable).
- **Discover and add servers and skills from one hub** — browse catalogs, see what’s already installed, fewer raw config edits.
- **A single checklist view** — workspace vs personal setup, local skill folders, rules, instructions, and memory bank so the repo matches what you think you shipped.
- **Smarter context for Chat** — structured “context packs” and readiness flows, with **explicit** choices so teams stay aligned on what Copilot is allowed to see.

**One Click Setup** (hub → Intelligence, top card) runs your configured **Cursor** and **Claude Code** migration steps and follow-ups using **bundled Node CLIs** (no `npx`) after you confirm the risk modal — toggle tracks with the **Cursor → Copilot** / **Claude Code → Copilot** checkboxes or under **Settings → One Click Setup → General**. **Thinking Machine Mode** is the master switch for **session priming** (MCP/skills awareness + context pack); first enable shows **Engage**; turning it off clears acknowledgment so **Engage** can run again next time. See the [monorepo README](https://github.com/amitchorasiya/Github-Copilot-ToolBox/blob/main/README.md#one-click-setup-and-thinking-machine-mode) for full detail.

---

**Packaging:** `npm run package` in this folder stages the [monorepo root README](../../README.md) (with GitHub URLs for screenshots) into this `README.md` for the `.vsix`, then restores this extension reference. Use `npm run package:extension-readme-only` only if you must package the file below as-is.

**License:** [MIT](LICENSE) · **VS Code Marketplace:** [`amitchorasiya.github-copilot-toolbox`](https://marketplace.visualstudio.com/items?itemName=amitchorasiya.github-copilot-toolbox) · **npm package name:** `github-copilot-toolbox` · **Version:** 1.0.17 · **JetBrains:** [Marketplace search — Github Copilot ToolBox](https://plugins.jetbrains.com/search?search=Github+Copilot+ToolBox) · plugin **`0.1.3`** · **Site:** [copilottoolbox.layai.co](https://copilottoolbox.layai.co) — static **GitHub Pages** site in monorepo [`docs/`](https://github.com/amitchorasiya/Github-Copilot-ToolBox/tree/main/docs); **Light/Dark** preference is saved in the browser (`localStorage` key **`cpltb_theme_v1`**).

Install VS Code: `code --install-extension amitchorasiya.github-copilot-toolbox` or install from a built `.vsix`. Install on JetBrains: **Settings → Plugins → Marketplace** and search **Github Copilot ToolBox**, or **Install Plugin from Disk…** using the ZIP from [`npm run package:intellij`](https://github.com/amitchorasiya/Github-Copilot-ToolBox/blob/main/README.md#intellij-plugin-zip).

**Monorepo home:** [Github-Copilot-ToolBox](https://github.com/amitchorasiya/Github-Copilot-ToolBox) — this folder is `packages/github-copilot-toolbox/`.

**IntelliJ IDEA / JetBrains:** A **JetBrains plugin** in the same monorepo ([`packages/github-copilot-toolbox-intellij/`](../github-copilot-toolbox-intellij/)) embeds this hub via JCEF — install from the [JetBrains Marketplace](https://plugins.jetbrains.com/search?search=Github+Copilot+ToolBox) (**plugin id** `com.amitchorasiya.github.copilot.toolbox`) or build with **`npm run package:intellij`** from the repo root after exporting the hub. The hub script validates **`postMessage`** origins (`vscode-webview://…` or `http://github.copilot.toolbox`).

---

## Table of contents

- [After install: open Copilot Toolbox](#after-install-open-copilot-toolbox)
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
- [Disclaimer](#disclaimer)
- [License](#license)

---

## Overview

**Github Copilot ToolBox (MCP, Skills, Cursor/Claude → Copilot)** adds **Copilot Toolbox** with:

1. **MCP & skills** — Webview hub: **Intelligence** (default; **Cursor** and **Claude Code** bridge rows, hygiene, context & readiness), **MCP**, **Skills**, **Workspace** (checklist + every toolbox command as searchable tiles), **Awesomeness** ([Awesome Copilot](https://github.com/github/awesome-copilot): Copilot Chat prompt, CLI marketplace, catalog links).
2. **Workspace kit** — Tree checklist for rules, memory bank, `copilot-instructions.md`, `mcp.json`, plus **One Click Setup** (top row).

**Commands:** `GitHubCopilotToolBox.*`. **Settings:** `copilot-toolbox.*` (commands keep the legacy prefix; settings use `copilot-toolbox` so the Settings UI shows **Copilot Toolbox** instead of splitting “GitHub”).

VS Code resolves README images relative to this package folder. Screenshots live at the [monorepo `screenshots/`](https://github.com/amitchorasiya/Github-Copilot-ToolBox/tree/main/screenshots) root, so embeds below use **absolute** `raw.githubusercontent.com` URLs (same as the published `.vsix` / Marketplace README).

## Screenshots

**What you see in VS Code**—real UI, not mockups. **Opening the hub** is explained at the top: [After install: open Copilot Toolbox](#after-install-open-copilot-toolbox). Hub captures below are **high-resolution** (~2.5k width) where noted.

**Intelligence** (hub): **Cursor → Copilot** and **Claude Code → Copilot** bridge rows (MCP, rules, memory bank, `CLAUDE.md`, `.mcp.json`, skills), then context pack, readiness, MCP & Skills scan.

![Intelligence: Port Cursor MCP, rules, and memory bank to VS Code & Copilot](https://raw.githubusercontent.com/amitchorasiya/Github-Copilot-ToolBox/main/screenshots/02-intelligence-cursor-port.png?v=1.0.17)

![Intelligence tab: Cursor and Claude Code bridges to VS Code and Copilot](https://raw.githubusercontent.com/amitchorasiya/Github-Copilot-ToolBox/main/screenshots/01-intelligence-cursor-to-vscode-copilot.png?v=1.0.17)

![Intelligence: context pack and readiness actions](https://raw.githubusercontent.com/amitchorasiya/Github-Copilot-ToolBox/main/screenshots/02-intelligence-context-readiness.png?v=1.0.17)

**MCP**: installed workspace/user servers and registry browse.

![MCP: installed workspace servers (Browse / Installed)](https://raw.githubusercontent.com/amitchorasiya/Github-Copilot-ToolBox/main/screenshots/03-mcp-browse-workspace-servers.png?v=1.0.17)

![MCP: registry browse & search](https://raw.githubusercontent.com/amitchorasiya/Github-Copilot-ToolBox/main/screenshots/04-mcp-registry-search.png?v=1.0.17)

**Skills**: catalog (skills.sh) and local installed `SKILL.md` trees.

![Skills: catalog (skills.sh)](https://raw.githubusercontent.com/amitchorasiya/Github-Copilot-ToolBox/main/screenshots/05-skills-catalog-skills-sh.png?v=1.0.17)

![Skills: installed local skill folders](https://raw.githubusercontent.com/amitchorasiya/Github-Copilot-ToolBox/main/screenshots/06-skills-installed-local.png?v=1.0.17)

**Workspace** checklist and **Intelligence** hub (context hygiene).

![Workspace kit checklist](https://raw.githubusercontent.com/amitchorasiya/Github-Copilot-ToolBox/main/screenshots/07-workspace-checklist.png?v=1.0.17)

![Intelligence: context hygiene, snapshot, and quick actions](https://raw.githubusercontent.com/amitchorasiya/Github-Copilot-ToolBox/main/screenshots/08-workspace-toolbox-commands.png?v=1.0.17)

**Reference diagram** (Mermaid export; not a live UI capture).

![Cursor vs Copilot capability map (diagram)](https://raw.githubusercontent.com/amitchorasiya/Github-Copilot-ToolBox/main/screenshots/mermaid-copilot-map.png?v=1.0.17)

---

## MCP & skills hub: every tab, toggle, and button

Open **MCP & skills** from the **Side Bar** after selecting **Copilot Toolbox** in the **Activity Bar** (see [After install: open Copilot Toolbox](#after-install-open-copilot-toolbox) above). The **secondary sidebar** uses the same hub with container title **Copilot Toolbox**. Same reference as the [monorepo README](https://github.com/amitchorasiya/Github-Copilot-ToolBox#mcp--skills-hub-every-tab-toggle-and-button).

### Main tabs (top)

In the UI, each tab is labeled with an emoji (🧠 **Intelligence**, 🔌 **MCP**, 📚 **Skills**, 📋 **Workspace**, ⭐ **Awesomeness**) and a **distinct tint** when active or hovered; the table below uses plain names.

| Tab | Purpose |
|-----|---------|
| **Intelligence** | **Cursor → VS Code & Copilot** and **Claude Code → VS Code & Copilot** bridge rows, **Context hygiene**, **Context & readiness**, **One Click** + **Thinking Machine** cards, auto-scan footer. Default tab. |
| **MCP** | **Browse** registry or **Installed** workspace + user `mcp.json` servers. |
| **Skills** | **Browse** skills.sh or **Installed** local `SKILL.md` folders under standard roots. |
| **Workspace** | **Workspace checklist** and **All toolbox commands** (searchable tiles). |
| **Awesomeness** | **[Awesome Copilot](https://github.com/github/awesome-copilot)** — copy a **Chat prompt** for Copilot to help pick plugins, **Copilot CLI** shortcuts (install, register marketplace, CLI session), open **catalog** / repo (search stays on the website). |

### Browse vs Installed (MCP and Skills)

| Sub-tab | Purpose |
|---------|---------|
| **Browse** | Remote catalog search; **MCP → Browse** shows an extra **chip** row. |
| **Installed** | Filter/manage on-disk config and discovered skills. |

### One Click row (Intelligence only)

| Control | What it does |
|---------|----------------|
| **⚙** | Opens **Settings** filtered to `copilot-toolbox.oneClickSetup` (migration tracks, per-step enums, workspace vs user scope for auto-scan, etc.). |
| **One Click Setup** | Modal: you accept responsibility for all changes. Buttons: **I understand — run setup** (default path) or **Skip Copilot CLI + Chat (this run only)** to omit CLI Chat settings + global npm for that invocation without changing saved settings. Then runs the configured flow: **Cursor track** (optional `.cursor/skills` migrate, rules CLI, `.cursorrules`, Cursor MCP port) and/or **Claude Code track** (`CLAUDE.md` merge, `.claude/skills` migrate, workspace `.mcp.json` port), then shared **memory bank** init (`--cursor-rules` only if Cursor track is on), optional auto-scan, awareness, readiness, config scan, optional Copilot Chat **cloud Claude** flag, optional **Copilot CLI + Chat** User settings (and optional global `npm install -g @github/copilot` in a terminal — prints **`npm bin -g`** for PATH, **PowerShell** on Windows), best-effort **New Copilot CLI Session**, optional test task. **Local** vs **Copilot CLI** in Chat is the footer/palette session type, not **# Toolbox**. Uses **bundled** bridge CLIs (no `npx`). |
| **Cursor → Copilot** / **Claude Code → Copilot** checkboxes | Toggle `runCursorToCopilotTrack` and `runClaudeCodeToCopilotTrack` (both default **on**). |

### Thinking Machine Mode row (Intelligence only)

| Control | What it does |
|---------|----------------|
| **Checkbox** | `copilot-toolbox.thinkingMachineMode.enabled` — Workspace when a folder is open, else User. First enable → **Engage** modal; unchecking clears acknowledgment so **Engage** can show again. |
| **⚙** | Opens **Settings** filtered to `copilot-toolbox.thinkingMachineMode`. |

### Search box

Hidden on **Intelligence**. Elsewhere: filters registry/skills results, installed servers/skills, or workspace command tiles.

### MCP chips (MCP → Browse)

| Chip | Action |
|------|--------|
| **Registry** | `workbench.mcp.browseServers` |
| **Add server** | `workbench.mcp.addConfiguration` |
| **List (native)** | `workbench.mcp.listServer` |
| **Port Cursor → VS Code** | `npx` cursor MCP port bridge |
| **Refresh** | Reload hub payload |

Palette: **`GitHubCopilotToolBox.mcpBrowseRegistry`** still opens the extension’s registry browse (no duplicate chip vs **Registry**).

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

### Intelligence → Claude Code → VS Code & Copilot

| Primary button | Action |
|----------------|--------|
| **Run merge** | **`mergeClaudeMdIntoCopilotInstructions`** — `CLAUDE.md` → replaceable block in `.github/copilot-instructions.md`. |
| **Choose target…** | **`portClaudeProjectMcp`** — merge workspace `.mcp.json` into user or workspace VS Code `mcp.json` (dry-run → Output). |
| **Run migration** | **`migrateSkillsClaudeToAgents`** — `.claude/skills` → `.agents/skills`. |
| **Run npx init** / **Without npx** | Same **memory bank** scaffold as the Cursor row (shared). |

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

- Checklist: **One Click Setup** (top), **Open**, **Create / sync** per row.
- **All toolbox commands**: grouped tiles (Intelligence, Chat & session, Rules & instructions, MCP bridges, Workspace setup, Docs & environment)—each tile runs the matching **`GitHubCopilotToolBox.*`** command.

### Auto-scan footer (Intelligence only, bottom bar)

| Control | What it does |
|---------|----------------|
| **Checkbox** | `copilot-toolbox.intelligence.autoScanMcpSkillsOnWorkspaceOpen` — on folder open: awareness report, hub refresh, merge MCP/skills block into `.github/copilot-instructions.md`; same merge when **Scan now** runs with this on. Persists to **Workspace** settings when a folder is open, otherwise **User**. |
| **Scan now** | Runs awareness + refresh now (and instructions merge when checkbox on). |

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
- **Cursor → Copilot in the UI:** Port Cursor MCP, init memory bank, sync rules, migrate **`.cursor/skills`**—**`npx`** on primary buttons where applicable, **Without npx** bundled CLI, **GitHub** links for source.
- **Claude Code → Copilot in the UI:** Merge **`CLAUDE.md`**, port workspace **`.mcp.json`**, migrate **`.claude/skills`**—extension-side or quick-pick flows; **One Click** can run all of the above with **dual tracks** (defaults both on).
- **Workspace kit tree:** Same checklist targets (rules, memory bank, instructions, `mcp.json`) with **Open** / **Create** / **One Click Setup**.
- **No false promises on skills:** Local **`SKILL.md`** trees are **discovered and openable**; the UI states clearly that **Copilot does not auto-load** arbitrary skill folders—use attachments, instructions, or MCP for live tools.

**Every hub control** is documented in [MCP & skills hub: every tab, toggle, and button](#mcp--skills-hub-every-tab-toggle-and-button). **Every command title** appears under **GitHub Copilot Toolbox:** in the Command Palette.

---

## Command palette

All commands are prefixed with **GitHub Copilot Toolbox:** in the palette. Examples:

- `Intelligence — scan MCP & Skills awareness (save to .github)`
- `Intelligence — open Toolbox CLI repo on GitHub…` (quick pick; legacy per-repo commands still exist)
- `Intelligence — build context pack for Chat (copy)`
- `Port Cursor MCP → VS Code (npx)` · `Port Cursor MCP → VS Code (manual — no npx)`
- `Intelligence — port workspace .mcp.json to VS Code` · `Intelligence — migrate skills .claude → .agents` · `Merge CLAUDE.md into Copilot instructions`
- `Memory bank setup (open docs — no npx)` · `Cursor rules → Copilot (manual — no npx)` · `reveal .cursor/.agents skill folders`
- `Open workspace mcp.json` / `Open user mcp.json`
- `Install Copilot CLI & configure Chat` — runs `npm install -g @github/copilot`; the terminal prints **`npm bin -g`** (global executables folder — correct on Windows and Unix; **PowerShell** on Windows). Sets User **`github.copilot.chat.backgroundAgent.enabled`** and related **`github.copilot.chat.*`** keys, then best-effort **New Copilot CLI Session** (VS Code **GitHub Copilot Chat** — not Cursor chat). **Local vs Copilot CLI** in Chat is the **footer / palette** session type, not the **# Toolbox** chip. Requires Node 22+; see GitHub docs.
- `Register Awesome Copilot plugin marketplace (Copilot CLI)` — runs `copilot plugin marketplace add github/awesome-copilot` so you can install plugins with `copilot plugin install <name>@awesome-copilot` ([Awesome Copilot](https://github.com/github/awesome-copilot) catalog; browse on [awesome-copilot.github.com](https://awesome-copilot.github.com)). Does not bundle the catalog.
- `Copy Awesome Copilot prompt for Copilot Chat` — copies a starter prompt (edit bracketed lines) so GitHub Copilot Chat can help choose plugins and CLI steps; hub tab **Awesomeness** has the same action as a tile.
- `Open Copilot CLI session in Chat` — focuses GitHub Copilot Chat, then **New Copilot CLI Session**; if the footer still shows **Local** (vs **Copilot CLI**), the toast explains that the **# GitHub Copilot Toolbox** chip is only context — use the footer menu or palette **New Copilot CLI Session**.

Search `GitHub Copilot Toolbox` or `GitHubCopilotToolBox` in Keyboard Shortcuts to rebind.

---

## Settings

| Setting | Purpose |
|---------|---------|
| `copilot-toolbox.npxTag` | Dist-tag or version for `npx` (default `latest`) |
| `copilot-toolbox.useInsidersPaths` | Resolve user `mcp.json` under VS Code Insiders |
| `copilot-toolbox.intelligence.includeGitByDefault` / `includeDiagnosticsByDefault` | Pre-select context pack options |
| `copilot-toolbox.intelligence.appendNotepadAfterPack` / `openChatAfterPack` | Pre-select follow-ups after pack |
| `copilot-toolbox.intelligence.autoScanMcpSkillsOnWorkspaceOpen` | After workspace opens (debounced): auto-open awareness, refresh hub, merge MCP/skills into `.github/copilot-instructions.md`; same merge when you run the scan with this enabled |
| `copilot-toolbox.oneClickSetup.*` | **One Click Setup** (sections: **General**, **Memory Bank**, **Rules**, **Skills**, **Claude Code**, **MCP**, **Follow-ups**): **`runCursorToCopilotTrack`** / **`runClaudeCodeToCopilotTrack`** (both default **on** — hub checkboxes mirror these); `settingsScope`; **`initMemoryBankMode`** + **`initMemoryBankCursorRules`** (only when Cursor track is on) + **`initMemoryBankIncludeClaudeMd`** (reserved for future CLI); **`syncCursorRulesMode`** + **`appendCursorrules`**; **`migrateSkillsTarget`** + `migrateSkillsMode`; **Claude Code:** **`mergeClaudeMdMode`** (default **apply**), **`mergeClaudeLocalMd`** (default **off**), **`migrateClaudeSkillsTarget`** (default **workspace**) + **`migrateClaudeSkillsMode`**, **`portClaudeCodeMcp`** (default **user** — merges workspace **`.mcp.json`** `mcpServers`/`servers` into VS Code `mcp.json`); **`portCursorMcp`**; **`instructionMergeAfterOneClick`**; `runAwarenessScan`, `runReadiness`, `runConfigScan`, `runFirstTestTask`; **`enableClaudeCopilotChatAgent`** (Copilot Chat cloud Claude — not Claude Code migration); **`enableCopilotCliChatSettings`** (default **on** — Background Agent + `terminalChatLocation` + CLI branch/session flags; runs **New Copilot CLI Session** when Copilot provides it); **`installCopilotCliGlobalDuringOneClick`** (default **on** — `npm install -g @github/copilot`; terminal prints npm global **bin** path for PATH). |
| `copilot-toolbox.translateWrapMultilineInFence` | Wrap multiline translation in a code fence |

**Open filtered settings:** Command **Intelligence — open related settings** → `copilot-toolbox.intelligence`. Command **Intelligence — open One Click Setup settings** → `copilot-toolbox.oneClickSetup`.

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

**Claude Code** migration pieces (**`CLAUDE.md`**, `.mcp.json`, `.claude/skills`) ship **inside this extension** (no extra npm package).

---

## Develop & test

```bash
cd packages/github-copilot-toolbox   # from monorepo root
npm install
npm run compile
npm test
```

- **CI:** `.github/workflows/extension-ci.yml` — Ubuntu, Windows, macOS on changes under this package.
- **Manual:** F5 → **Run Extension: Github Copilot ToolBox** (`extensionDevelopmentPath` = this folder).

**Intelligence caveat:** Pasted `#file:` lines may not attach like **Add context**; see [docs/intelligence-verification.md](docs/intelligence-verification.md).

---

## Troubleshooting

| Issue | What to try |
|-------|-------------|
| MCP commands missing | Update VS Code + Copilot; MCP UI differs by version. |
| Port / npx fails | Install Node 18+, check network; set `copilot-toolbox.npxTag` if you need a pinned CLI version. Prefer **Without npx** / **One Click** bundled CLIs when offline. |
| Claude **`.mcp.json`** port no-op | File must exist at **workspace root**; entries under `mcpServers` or `servers`. Use **dry run** to log planned merge in **Output → GitHub Copilot Toolbox**. |
| No skills listed | Ensure a **subfolder** under a scanned root contains **`SKILL.md`** (not only loose files at the root). |
| Copilot “ignores” skills | Expected — use awareness report + attach files or maintain `.github/copilot-instructions.md`. |
| Insiders vs stable user MCP | Toggle `copilot-toolbox.useInsidersPaths` and reopen hub. |
| Auto-scan every startup | Disable `autoScanMcpSkillsOnWorkspaceOpen` in settings or uncheck the Intelligence hub checkbox. |
| **`copilot` not found** after global npm | Run **`npm bin -g`** and add that folder to **User** `PATH` (Windows: often under `%AppData%\npm`; the install terminal prints it). |
| Chat stays on **Local** after Toolbox automation | Normal — use Chat **footer** → **Copilot CLI** or palette **New Copilot CLI Session**; org policy or **`backgroundAgent.enabled`** can hide CLI. |
| **Claude Code** extension asks to log in | Expected. **Anthropic** sign-in is separate from this extension and from **GitHub Copilot**; having **`claude` CLI** installed does not guarantee the VS Code Claude extension skips login. |

---

## Publishing

From **this directory** only:

```bash
npm run compile
npm run package    # vsce package → .vsix
```

The [LICENSE](LICENSE) file is shipped in the VSIX. See the [monorepo README](../../README.md#publishing-vsix--marketplace) for full publish notes.

---

## Security (hub webview)

The MCP & skills hub handles `postMessage` only when **`event.origin`** is a VS Code webview (`vscode-webview://…`) or the IntelliJ JCEF synthetic origin (`http://github.copilot.toolbox`). Messages from other origins are ignored.

---

## Disclaimer

**Independence and trademarks.** **Github Copilot ToolBox (MCP, Skills, Cursor/Claude → Copilot)** is **independent** software. It is **not** affiliated with, endorsed by, sponsored by, or maintained by Microsoft, GitHub, Cursor, OpenAI, Anthropic, or other vendors of products referenced in this README. Product names may be **trademarks** of their respective owners. For Microsoft’s VS Code naming and branding expectations, see [Visual Studio Code brand guidelines](https://code.visualstudio.com/brand).

**MIT “AS IS”.** This extension is licensed under the [MIT License](LICENSE): provided **without warranty**, with **limited liability**—see the full license in the package and repository.

**Not professional services.** The extension and docs are **not** a security assessment, legal review, or substitute for your team’s own evaluation of MCP servers, skills, credentials, and AI usage.

**Third parties and `npx`.** Features may invoke **`npx`** (and other tooling), browse remote registries or catalogs, or modify files such as `mcp.json` and `.github/copilot-instructions.md`. **npm packages**, **MCP servers**, **catalogs**, and **VS Code / Copilot** behavior are outside this project’s control. Review terms, security, and suitability before you run or connect anything.

**Your responsibility.** You are responsible for backups, secrets hygiene, and complying with your policies and applicable law when using this extension.

---

## License

[MIT](LICENSE) — Copyright (c) 2026 amitchorasiya.
