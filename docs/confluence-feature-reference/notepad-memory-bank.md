## Command / entry

`GitHubCopilotToolBox.appendNotepadToMemoryBank` — **Append notepad → memory-bank**

## What it does

Reads the **session notepad**, lets you pick a **`memory-bank/**/*.md`** file, shows a **preview** of the appended result, then on **Apply** writes the merged content to disk.

## Reads from

- **`.vscode/copilot-toolbox-notepad.md`** (via `resolveSessionNotepadUri`)
- **`memory-bank/**/*.md`** (glob, up to 200 files) for the picker
- Chosen target **`.md`** file

## Writes / modifies

- **Overwrites** the chosen **`memory-bank/.../*.md`** file with `existing + timestamp + notepad body` after user confirms **Apply**.

## Code

`packages/github-copilot-toolbox/src/commands/memoryBankFromNotepad.ts`.
