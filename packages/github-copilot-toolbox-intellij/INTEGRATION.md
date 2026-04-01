# VS Code ↔ IntelliJ integration

## Hub HTML

- **Source of truth:** `packages/github-copilot-toolbox/src/webview/hubWebviewDocument.ts` (`getHubWebviewHtml`).
- **IntelliJ bundle:** `packages/github-copilot-toolbox-intellij/src/main/resources/hub/hub-body.html` produced by `npm run export:hub-for-intellij` (see `scripts/export-hub-for-intellij.mjs`). The exporter runs **`npm run compile`** then **`require(out/webview/hubWebviewDocument.js)`** and calls `getHubWebviewHtml(csp)` so the output matches VS Code (raw slicing of the `.ts` file would break `\u` emoji escapes). It merges **`--vscode-*` variables into `:root` before `--pad` / `--border`** so JCEF resolves `color-mix()`, prepends the **`acquireVsCodeApi`** shim, then appends JetBrains-only CSS: **kicker** under the header, **`body.hub-jb-theme`**, cards and hygiene tiles (aligned with the Cloude Code Toolbox IntelliJ hub exporter pattern).
- **VS Code API shim:** The **exported** HTML prepends a script that assigns `window.acquireVsCodeApi` to a stub whose `postMessage` forwards to `window.copilotBridgePost` or queues `window.__copilotPending`. The main hub script uses `var vscode = acquireVsCodeApi();` (same as VS Code, where the host provides the real API). `HubJcefPanel` injects `copilotBridgePost` after load and flushes the queue.
- **postMessage handling:** The hub’s `message` listener checks **`event.origin`** (`vscode-webview://…` or `http://github.copilot.toolbox`) before handling state updates.

## State payload

`HubStateService.gatherPayload` mirrors `gatherHubPayload` from `mcpSkillsHubView.ts`: MCP rows, skills, workspace kit, `hygiene` (including `copilotInstructionsLines` / `copilotInstructionsMissing`), `hubHost: "intellij"`, and toggles such as `runCursorToCopilotTrack`.

## Commands

`VsCodeHubCommandIds` lists `GitHubCopilotToolBox.*` command ids; `ToolboxParityDispatcher` implements or stubs each. The JCEF hub posts `runCommand` with those ids; `HubCommandBridge` executes the registered `VsCodeHubCommandAction` instances.

## JetBrains Copilot APIs

This plugin does **not** call proprietary JetBrains Copilot internals. Features that depend on VS Code–only APIs (e.g. `workbench.mcp.*`, inline chat) show a notice or open documentation. Deeper IDE integration would use JetBrains’ public extension points and any documented Copilot integration as they stabilize.
