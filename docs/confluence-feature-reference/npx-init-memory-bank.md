## Command / entry

`GitHubCopilotToolBox.initMemoryBank` — **Init memory bank**

## What it does

Runs **`npx github-copilot-memory-bank`** with `init --cwd <workspace>` plus user-chosen flags: **`--dry-run`**, **`--cursor-rules`**, **`--force`**.

## Reads from

- Workspace path; **npx tag** from settings.

## Writes / modifies

- **npx** package scaffolds **`memory-bank/`** (and optionally **`.cursor/rules`**) — extension does not write those files directly.

## Code

`packages/github-copilot-toolbox/src/commands/memoryBankInit.ts`.
