# Cursor vs GitHub Copilot in VS Code — quick reference

## Rules / project instructions

| Cursor | Copilot (VS Code) |
|--------|-------------------|
| `.cursorrules` (repo root) | `.github/copilot-instructions.md` |
| `.cursor/rules/*.mdc`, `.md` | `.github/copilot-instructions.md` + `.github/instructions/*.instructions.md` (with `applyTo` globs) |

**This toolbox:** sync `.cursor/rules` with `npx cursor-rules-to-github-copilot`, or **GitHub Copilot Toolbox: Append .cursorrules to Copilot instructions**.

## Context in chat

| Cursor | Copilot / VS Code (typical) |
|--------|----------------------------|
| `@file` / `@Files` | `#file:path` or attach via **Add context** |
| `@codebase` | `@workspace` (semantic search) |
| `@web` | Web / fetch tools in **Agent** mode (when enabled) |
| `@docs` | Documentation MCP or pasted links |

Syntax is **not** auto-translated by the editor; use this table when composing prompts.

## Inline edit / chat shortcuts

| Cursor | Copilot (default) |
|--------|-------------------|
| **Ctrl+K** (inline edit) | **Ctrl+I** / **Cmd+I** (inline chat) |

**GitHub Copilot Toolbox** adds **Ctrl+Alt+K** ( **Cmd+Alt+K** on Mac) → inline chat when enabled in Keyboard Shortcuts, or run **GitHub Copilot Toolbox: Open inline chat (Cursor-style)**.

> **Warning:** Binding **Ctrl+K** yourself overrides VS Code’s chord prefix; many shortcuts start with Ctrl+K.

## Chat UI

- **Cursor Composer** — multi-file panel workflow.  
- **Copilot** — Chat sidebar + **Agent** mode + **inline** chat. Use **GitHub Copilot Toolbox: Open Chat** to focus chat quickly.

## Usage limits (PRU / Business)

Copilot **Business** and similar plans may meter **premium** or **agent** usage. See current billing docs:

- [GitHub Copilot billing](https://docs.github.com/en/billing/concepts/about-billing-for-github-copilot)
- [Copilot plans](https://github.com/features/copilot/plans)

There is no stable public API in the extension host for live PRU counters; check **GitHub.com → Settings → Copilot** (or your org admin).

## Notepads vs repo instructions

- **Cursor Notepads** — session-friendly pinned notes.  
- **Copilot** — mainly **repo** instructions + chat context.

**GitHub Copilot Toolbox session notepad:** `.vscode/copilot-kit-notepad.md` — **Copy notepad to clipboard** before sending a chat, or keep it open split with Chat.

## Settings sync (Cursor → VS Code)

- Export **Cursor** settings JSON and **merge carefully** into VS Code `settings.json` (many keys differ).  
- **MCP:** use **Port Cursor MCP** in this kit.  
- **Extensions:** reinstall equivalents from the Marketplace; this kit cannot auto-map every Cursor-only extension.

---

*Generated for the GitHub Copilot Toolbox extension. Not affiliated with Cursor or GitHub.*
