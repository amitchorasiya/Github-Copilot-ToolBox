## Command / entry

`GitHubCopilotToolBox.showMcpSkillsAwareness` — **Scan MCP & Skills awareness** (also used by auto-scan).

## What it does

Uses the same **hub payload** as the MCP & Skills webview: lists configured MCP servers and discovered **SKILL.md** skill trees. Opens a **preview Markdown** report in the editor.

If `copilot-toolbox.intelligence.autoScanMcpSkillsOnWorkspaceOpen` is **true** (same setting that triggers auto-scan), it can also **merge** a generated block into **`.github/copilot-instructions.md`** (replaceable banner region).

## Reads from

- `gatherHubPayload(context)` — workspace + user **mcp.json** paths, skills roots, server entries (see hub webview implementation).
- User **mcp.json** path (stable vs Insiders per `useInsidersPaths`).
- Existing **`.github/copilot-instructions.md`** when merging (read → merge → write).

## Writes / modifies

- **Default:** none on disk (report buffer only).
- **Optional:** **`.github/copilot-instructions.md`** — creates `.github/` if needed; updates or appends the **MCP & skills awareness** block when auto-scan merge setting is on.

## Code

`packages/github-copilot-toolbox/src/intelligence/mcpSkillsAwarenessCommand.ts`, `formatMcpSkillsAwareness.ts`, `mergeMcpSkillsIntoCopilotInstructions.ts`, `webview/mcpSkillsHubView.ts`.
