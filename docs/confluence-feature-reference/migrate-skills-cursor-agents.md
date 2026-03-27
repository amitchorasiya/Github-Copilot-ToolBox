## Command / entry

`GitHubCopilotToolBox.migrateSkillsCursorToAgents` — **Migrate skills `.cursor` → `.agents`**

## What it does

User picks **scope** (workspace **`.cursor/skills`**, user **`~/.cursor/skills`**, or both) and **copy vs move**. Runs `runMigrationForRoot` to copy/move skill folders to **`.agents/skills`**.

## Reads from

- **`.cursor/skills`** (and/or **`~/.cursor/skills`**) — skill tree contents.

## Writes / modifies

- **Creates** **`.agents/skills/...`**; **move** mode deletes originals under **`.cursor/skills`** after copy (per migration implementation).

## Code

`packages/github-copilot-toolbox/src/commands/migrateSkillsCursorToAgents.ts`, `skills/migrateCursorSkillsToAgents.ts`.
