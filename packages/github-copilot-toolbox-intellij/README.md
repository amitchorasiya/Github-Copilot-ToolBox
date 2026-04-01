# Github Copilot ToolBox — IntelliJ / JetBrains (preview)

Gradle [IntelliJ Platform](https://plugins.jetbrains.com/docs/intellij/welcome.html) plugin: **Tools → Github Copilot ToolBox** tool window with the same **MCP & skills** hub as VS Code (embedded with **JCEF**), command parity, and bundled bridge CLIs (`cursor-mcp-to-github-copilot-port`, `cursor-rules-to-github-copilot`, `github-copilot-memory-bank`) staged from the sibling [VS Code extension](../github-copilot-toolbox/).

Parity and architecture: [INTEGRATION.md](INTEGRATION.md) · roadmap: [ROADMAP.md](ROADMAP.md).

## How the hub is loaded

- **Source:** [`packages/github-copilot-toolbox/src/webview/hubWebviewDocument.ts`](../github-copilot-toolbox/src/webview/hubWebviewDocument.ts) (`getHubWebviewHtml`).
- **Bundled file:** `src/main/resources/hub/hub-body.html` — **generated**; do not edit by hand.
- **Exporter:** [`packages/github-copilot-toolbox/scripts/export-hub-for-intellij.mjs`](../github-copilot-toolbox/scripts/export-hub-for-intellij.mjs) runs after `npm run compile`, calls the compiled `getHubWebviewHtml(csp)`, then:
  - Injects **`--vscode-*` CSS variables** into `:root` **before** `--pad` / `--border` so JCEF can resolve `color-mix()` (there is no VS Code theme bridge in the IDE).
  - Prepends a script that defines **`window.acquireVsCodeApi`** and routes `postMessage` to **`copilotBridgePost`** / **`__copilotPending`** (see `HubJcefPanel.kt`).
  - Appends JetBrains-only CSS (`body.hub-jb-theme`, cards, hygiene tiles, kicker paragraph).
- **Security:** The hub script only accepts **`message`** events from **`vscode-webview://…`** (VS Code) or **`http://github.copilot.toolbox`** (this plugin’s JCEF bridge).

## Requirements

- **JDK 21** (`jvmToolchain(21)` in `build.gradle.kts`)
- **Node.js** on `PATH` for Gradle tasks that install bridge package dependencies

## Sync hub HTML from VS Code sources (required when `hubWebviewDocument.ts` changes)

```bash
cd packages/github-copilot-toolbox
npm install
npm run compile
npm run export:hub-for-intellij
```

From monorepo root: **`npm run export:hub-for-intellij`** or **`npm run intellij:export-hub`**.

Then build the plugin (below). CI runs export before **`./gradlew buildPlugin`**.

## Build

```bash
cd packages/github-copilot-toolbox-intellij
./gradlew buildPlugin
```

Artifact: **`build/distributions/*.zip`** (single plugin archive).

Full pipeline from repo root: **`npm run package:intellij`** (export hub + **`buildPlugin`**).

## Run in a sandbox IDE

```bash
./gradlew runIde
```

Open **View → Tool Windows → Github Copilot ToolBox**.

## Settings

Project file: **`.github/copilot-toolbox-settings.json`** (mirrors VS Code `copilot-toolbox.*`).

## JetBrains Marketplace

**Install:** open **Settings → Plugins → Marketplace**, search **Github Copilot ToolBox**, or use the [JetBrains Plugin Repository search](https://plugins.jetbrains.com/search?search=Github+Copilot+ToolBox) (**plugin id:** `com.amitchorasiya.github.copilot.toolbox`).

**Publish / develop:** see JetBrains docs for [publishing](https://plugins.jetbrains.com/docs/intellij/publishing-plugin.html) and Gradle `publishPlugin` for shipping updates.

## Install from disk

**Settings → Plugins → ⚙ → Install Plugin from Disk…** → select the ZIP under **`build/distributions/`**.
