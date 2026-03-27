## Command / entry

`GitHubCopilotToolBox.copilotToolboxConfigScan` — **Copilot/MCP config scan** (hygiene / secret-shaped patterns).

## What it does

Reads selected **JSON/Markdown config files**, runs **heuristic regexes** for common token shapes (e.g. `ghp_`, `sk-`, `AKIA…`), **masks** matches in the report, and prints results to the **Output** channel **GitHub Copilot Toolbox**.

## Reads from

- **`.vscode/mcp.json`** (workspace)
- **User `mcp.json`** (path from `mcpPaths.userMcpJsonPath`, Insiders-aware)
- **`.github/copilot-instructions.md`**

## Writes / modifies

- **None** to project files — output channel only.

## Code

`packages/github-copilot-toolbox/src/commands/copilotConfigScan.ts`.
