# Github-Copilot-ToolBox

Monorepo for developers moving from **Cursor** to **Visual Studio Code** with **GitHub Copilot**: MCP configuration, rules and instructions, and a **VS Code extension** that surfaces setup, **Intelligence** tooling, and `npx` bridges in one place.

**License:** [MIT](LICENSE) · **Extension (Marketplace):** `amitchorasiya.github-copilot-toolbox` · **Repository:** [github.com/amitchorasiya/Github-Copilot-ToolBox](https://github.com/amitchorasiya/Github-Copilot-ToolBox)

---

## Table of contents

- [What’s in this repo](#whats-in-this-repo)
- [Extension screenshots](#extension-screenshots)
- [Why it exists](#why-it-exists)
- [Quick start (extension)](#quick-start-extension)
- [Install the extension](#install-the-extension)
- [Companion tools (npm + GitHub)](#companion-tools-npm--github)
- [Repository layout](#repository-layout)
- [Development](#development)
- [CI](#ci)
- [Publishing (VSIX / Marketplace)](#publishing-vsix--marketplace)
- [Configuration & commands](#configuration--commands)
- [Security & privacy](#security--privacy)
- [Contributing](#contributing)
- [Disclaimer](#disclaimer)

---

## What’s in this repo

| Deliverable | Purpose |
|-------------|---------|
| **[GitHub Copilot Toolbox](packages/github-copilot-toolbox/)** | VS Code extension: **MCP & skills** hub, **workspace kit**, **Guide & tools**, **Intelligence** (context packs, readiness, MCP/Skills awareness report, auto-scan on folder open, `.cursor`→`.agents` skill migration), Cursor→Copilot `npx` bridges from the UI |
| **[memory-bank/](memory-bank/)** | Optional project memory files for you and Copilot (not required to build the extension) |
| **[packages/cursor-mcp-to-github-copilot-port/](packages/cursor-mcp-to-github-copilot-port/)** | Placeholder README for the MCP port CLI layout; the CLI is published separately on npm |

The extension does **not** replace GitHub Copilot or Cursor; it helps you **align configs** and **see** what’s configured (MCP servers, local `SKILL.md` trees, instructions files).

### Extension screenshots

**Intelligence** (hub): Cursor → VS Code bridges, context pack, readiness, MCP & Skills scan.

![Intelligence tab: Cursor to VS Code and Copilot bridges](screenshots/01-intelligence-cursor-to-vscode-copilot.png)

![Intelligence: context pack and readiness actions](screenshots/02-intelligence-context-readiness.png)

**MCP**: workspace and user servers, registry browse.

![MCP: browse workspace servers](screenshots/03-mcp-browse-workspace-servers.png)

![MCP: registry search](screenshots/04-mcp-registry-search.png)

**Skills**: catalog (skills.sh) and local installed `SKILL.md` trees.

![Skills: catalog (skills.sh)](screenshots/05-skills-catalog-skills-sh.png)

![Skills: installed local skill folders](screenshots/06-skills-installed-local.png)

**Workspace kit** and **Guide**: checklist and command tree.

![Workspace kit checklist](screenshots/07-workspace-checklist.png)

![Guide and toolbox commands](screenshots/08-workspace-toolbox-commands.png)

**Reference diagram** (exported map of Cursor vs Copilot surfaces; not a live UI capture).

![Cursor vs Copilot capability map (diagram)](screenshots/mermaid-copilot-map.png)

---

## Why it exists

- **Different formats:** Cursor uses `~/.cursor/mcp.json` and `mcpServers`; VS Code + Copilot expect `mcp.json` with a `servers` object and `stdio` / `http` types.
- **Different “skills” story:** Local `SKILL.md` folders are useful for humans and for tools that read them; **Copilot does not automatically ingest** arbitrary skill folders—the extension lists them for **browse / open** and documents that in the UI.
- **One sidebar:** Open workspace and user MCP, run port/sync/memory-bank CLIs, and run Intelligence flows without hunting commands.

---

## Quick start (extension)

```bash
git clone https://github.com/amitchorasiya/Github-Copilot-ToolBox.git
cd Github-Copilot-ToolBox/packages/github-copilot-toolbox
npm install
npm run compile
```

From the **monorepo root** (after dependencies are installed under the package above):

```bash
npm run compile    # same as npm run compile --prefix packages/github-copilot-toolbox
npm test
```

**Run in VS Code:** open this repository → **Run and Debug** → **Run Extension: GitHub Copilot Toolbox** (see [`.vscode/launch.json`](.vscode/launch.json)).

Full extension documentation: **[packages/github-copilot-toolbox/README.md](packages/github-copilot-toolbox/README.md)**.

---

## Install the extension

- **Marketplace (when published):** search for **GitHub Copilot Toolbox** or install by id:  
  `code --install-extension amitchorasiya.github-copilot-toolbox`
- **From VSIX:** build with `npm run package` inside `packages/github-copilot-toolbox/`, then **Install from VSIX…** in VS Code.

**Requirements:** VS Code **1.99+**, **GitHub Copilot**, **Node.js 18+** for `npx` bridges. **Git** on `PATH` for optional Intelligence “include git” (Windows: [Git for Windows](https://git-scm.com/download/win)).

---

## Companion tools (npm + GitHub)

These work alongside the extension; the **Intelligence** hub links to their repos and can run several via `npx`.

| npm package | Role | GitHub |
|-------------|------|--------|
| `cursor-mcp-to-github-copilot-port` | Port Cursor `mcp.json` → VS Code `mcp.json` | [Github-Copilot-ToolBox](https://github.com/amitchorasiya/Github-Copilot-ToolBox) |
| `github-copilot-memory-bank` | Scaffold `memory-bank/` + merge Copilot instructions | [Github-Copilot-Memory-Bank](https://github.com/amitchorasiya/Github-Copilot-Memory-Bank) |
| `cursor-rules-to-github-copilot` | Generate Copilot instruction files from `.cursor/rules` | [Github-Copilot-Cursor-Rules-Converter](https://github.com/amitchorasiya/Github-Copilot-Cursor-Rules-Converter) |

---

## Repository layout

```
.
├── LICENSE                          # MIT (applies to repo contents; see package LICENSEs)
├── README.md                        # This file
├── package.json                     # Private monorepo helper scripts (compile / test / package:extension)
├── packages/
│   ├── github-copilot-toolbox/      # VS Code extension — publish VSIX / Marketplace from HERE
│   │   ├── LICENSE                  # MIT (bundled in .vsix)
│   │   ├── package.json
│   │   ├── src/
│   │   └── README.md
│   └── cursor-mcp-to-github-copilot-port/   # Placeholder for optional vendored CLI
├── memory-bank/                     # Project docs for agents / Copilot
├── screenshots/                     # README and docs: extension UI captures + reference diagram
└── .github/workflows/               # extension-ci.yml → multi-OS build + tests
```

---

## Development

1. `cd packages/github-copilot-toolbox && npm install`
2. `npm run compile` — TypeScript → `out/`
3. `npm test` — Vitest (unit tests for Intelligence helpers, skills, etc.)
4. F5 — extension host

**Tech stack (extension):** TypeScript, VS Code API `^1.99`, Vitest. See [packages/github-copilot-toolbox/README.md](packages/github-copilot-toolbox/README.md) for settings, keybindings, and caveats (`#file:` vs Add context, etc.).

---

## CI

Workflow: [`.github/workflows/extension-ci.yml`](.github/workflows/extension-ci.yml)

- Triggers on changes under `packages/github-copilot-toolbox/**`, root `package.json`, or the workflow file.
- **Matrix:** Ubuntu, Windows, macOS — `npm install`, `npm run compile`, `npm test`, verifies `out/extension.js` exists.

---

## Publishing (VSIX / Marketplace)

Always use **`packages/github-copilot-toolbox/`** as the extension root (matches `repository.directory` in that `package.json`).

```bash
cd packages/github-copilot-toolbox
npm install
npm run compile
npm run package          # stages monorepo README (+ screenshot URLs) for Marketplace, then vsce package
# npx vsce publish       # when you are logged in to the publisher (from this directory)
```

The `.vsix` **README** is the **monorepo root** [`README.md`](README.md) (same content as on GitHub), with image paths rewritten to `raw.githubusercontent.com` so the Marketplace page shows screenshots. The extension’s detailed command reference stays in [`packages/github-copilot-toolbox/README.md`](packages/github-copilot-toolbox/README.md) on disk and is restored after each package run.

From monorepo root: `npm run package:extension` (after `npm install` in the package directory).

The **`LICENSE`** file in `packages/github-copilot-toolbox/` is included in the VSIX for Marketplace compliance.

---

## Configuration & commands

Extension settings and command IDs use the prefix **`GitHubCopilotToolBox`** (v0.4.0+). Older builds used `cursorCopilotKit` — migrate `settings.json` and custom keybindings if you upgrade.

Notable settings (see extension README for the full list):

- `GitHubCopilotToolBox.npxTag`, `useInsidersPaths`
- `GitHubCopilotToolBox.intelligence.*` (context pack defaults, **auto-scan MCP & Skills on workspace open**, etc.)
- `GitHubCopilotToolBox.translateWrapMultilineInFence`

Open filtered settings: Command Palette → **Intelligence: open related settings** (or search `GitHubCopilotToolBox` in Settings UI).

---

## Security & privacy

- **MCP configs** may contain paths, env vars, or secrets. Treat `mcp.json` as sensitive; do not commit secrets.
- The extension **starts terminals** for `npx` bridges and may **spawn `git`** for optional Intelligence sections—only run servers and commands you trust.
- **skills.sh** / registry features call **public HTTP APIs**; review network use in corporate environments.

---

## Contributing

Issues and PRs are welcome. Please:

- Run `npm run compile` and `npm test` under `packages/github-copilot-toolbox/` before submitting.
- Keep changes focused; match existing TypeScript and doc style.

---

## License

This repository is released under the **MIT License**. See [LICENSE](LICENSE). The VS Code extension package includes its own [packages/github-copilot-toolbox/LICENSE](packages/github-copilot-toolbox/LICENSE) for distribution in `.vsix`.

---

## Disclaimer

This project is an independent tooling monorepo. It is **not** affiliated with, endorsed by, or maintained by Microsoft, GitHub, Cursor, or Anthropic. **GitHub Copilot**, **VS Code**, and **Cursor** are trademarks of their respective owners.
