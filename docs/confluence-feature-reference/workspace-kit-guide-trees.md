# Feature: Workspace kit tree

- **Workspace kit** tree (`copilotKitWorkspace`) — `WorkspaceKitProvider`
- **Guide & tools** was removed in **0.5.17**; use the **MCP & skills** hub tiles and Command Palette for the same commands.

## Workspace kit

**Workspace kit:** shows whether key paths exist (`.cursor/rules`, `.cursorrules`, `memory-bank/`, `.github/copilot-instructions.md`, `.vscode/mcp.json`) and offers **Open** / **Create / sync** (runs the matching Toolbox command) or **One Click Setup** on the top row.

**Code:** `packages/github-copilot-toolbox/src/tree/workspaceKitProvider.ts`.
