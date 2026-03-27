## Command / entry

`GitHubCopilotToolBox.syncCursorRules` — **Sync Cursor rules → Copilot**

## What it does

Runs **`npx`** package **`cursor-rules-to-github-copilot`** with `--cwd <workspace>` and optional **`--dry-run`**.

## Reads from

- **Cursor rules / project files** as interpreted by the **npx** CLI.

## Writes / modifies

- **npx** CLI writes **`.github/`** instruction files (e.g. **`copilot-instructions.md`**) when not dry-run — extension only **launches** the command.

## Code

`packages/github-copilot-toolbox/src/commands/rulesToCopilot.ts`.
