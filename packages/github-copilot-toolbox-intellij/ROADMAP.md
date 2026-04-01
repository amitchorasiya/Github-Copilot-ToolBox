# IntelliJ plugin roadmap (snapshot)

- **Command surface:** `GitHubCopilotToolBox.*` ids are registered; `ToolboxParityDispatcher` routes to bundled CLIs, file actions, or VS Code–only notices.
- **Hub:** JCEF loads exported `hub-body.html` (from `packages/github-copilot-toolbox/src/webview/hubWebviewDocument.ts` via `npm run export:hub-for-intellij`); bridge uses `copilotBridgePost` / `__copilotPending`.
- **Hub refresh:** `GithubCopilotHubBridge` pushes `HubStateService` payloads after mutations.

See [INTEGRATION.md](INTEGRATION.md) for the VS Code ↔ IntelliJ contract.
