## Scope

Miscellaneous **Toolbox** commands that mostly **open UI**, **external URLs**, or **run small helpers** without a dedicated “reads / writes” contract in-repo.

## Examples (non-exhaustive)

| Command | Typical effect |
| --- | --- |
| `workspaceSetupWizard` | Legacy entry: points to **One Click Setup** / settings (no duplicate step-by-step wizard) |
| `openComposerHub` | Opens **Composer hub** webview/panel |
| `openSessionNotepad` / `copySessionNotepad` | See **Session notepad** page |
| `openCopilotChat` | Opens Copilot Chat |
| `openInstructionsPicker` | UI to pick instruction files |
| `appendCursorrules` / `createCursorrulesTemplate` | **`.cursorrules`** / template helpers |
| `openCursorCopilotReference` | Opens bundled reference doc |
| `openCopilotBillingDocs` / `openEnvSyncChecklist` | External / checklist webviews |
| `translateContextSelection` | Rewrites **selection** in editor (user confirms) |
| `openInlineChatCursorStyle` | Proxies to inline chat |
| `openIntelligenceRepo*` | Opens GitHub repos in browser |
| `toggleMcpDiscovery` | Toggles discovery-related setting |
| `refreshMcpView` / `refreshWorkspaceView` | Refreshes tree/webview data |

## Writes / modifies

**Varies** — many are **read-only** or **open-only**. **translateContextSelection** and **cursorrules** helpers may **edit** active or specific files after confirmation; see respective `commands/*.ts` files.

## Code

`packages/github-copilot-toolbox/src/extension.ts` (registrations) and individual files under `packages/github-copilot-toolbox/src/commands/`.
