## Mechanism

Registered at extension activation: `registerMcpSkillsAutoScanOnWorkspaceOpen`.

## What it does

When **`copilot-toolbox.intelligence.autoScanMcpSkillsOnWorkspaceOpen`** is **true**, schedules (debounced ~1.2 s) a run of the same handler as **MCP & Skills awareness** after workspace folders are added or on startup if a folder is open.

## Reads from

- Same as **MCP & Skills awareness** (hub payload, optional merge path).

## Writes / modifies

- Same as awareness: normally **report only**; may **merge into** **`.github/copilot-instructions.md`** if that same boolean setting is used for merge (see awareness command).

## Code

`packages/github-copilot-toolbox/src/intelligence/workspaceAutoScan.ts` (calls into `showMcpSkillsAwareness` from `extension.ts`).
