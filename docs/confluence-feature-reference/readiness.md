## Command / entry

`GitHubCopilotToolBox.showIntelligenceReadiness` — **Intelligence — readiness summary**

## What it does

Scans the workspace for common Copilot-related artifacts, evaluates **pass/fail-style checks**, and opens a **preview Markdown document** (unsaved buffer) with the summary. Offers buttons to run **MCP & Skills scan** or open **workspace mcp.json**.

## Reads from

Workspace root, via `gatherReadinessInput`:

- `.github/copilot-instructions.md` (exists, size)
- `AGENTS.md`
- `.github/instructions/*.instructions.md` (count)
- `memory-bank/` (directory exists)
- `.vscode/mcp.json`
- `.cursorrules`
- `.cursor/rules/` (any `.md` / `.mdc` files)

## Writes / modifies

- **None on disk** — report is an **in-memory** text document in the editor only.

## Code

`packages/github-copilot-toolbox/src/intelligence/readinessCommand.ts`, `buildReadinessInput.ts`, `readiness.ts`.
