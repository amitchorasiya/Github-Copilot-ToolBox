#!/usr/bin/env node
/**
 * After `npm run compile`, emits hub HTML for the IntelliJ JCEF shell (same pattern as
 * cloude-code-toolbox/scripts/export-hub-for-intellij.mjs): compiled getHubWebviewHtml,
 * inject --vscode-* into :root before derived tokens, prepend acquireVsCodeApi shim,
 * then JetBrains-only chrome (body class + kicker + extra rules).
 *
 * Run: npm run compile && node scripts/export-hub-for-intellij.mjs
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const __dirname = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const { getHubWebviewHtml } = require("../out/webview/hubWebviewDocument.js");

const csp = [
  "default-src 'none'",
  "style-src 'unsafe-inline'",
  "img-src https: data:",
  "script-src 'unsafe-inline'",
].join("; ");

let html = getHubWebviewHtml(csp);

/** Same ordering as Cloude Code Toolbox — must appear before --pad/--border so color-mix() resolves in JCEF. */
const JCEF_THEME_FALLBACKS = `
      --vscode-foreground: #1e1e1e;
      --vscode-sideBar-background: #e6e6e6;
      --vscode-editor-background: #ffffff;
      --vscode-widget-border: #b0b0b0;
      --vscode-widget-shadow: #000000;
      --vscode-toolbar-hoverBackground: #d0d0d0;
      --vscode-button-background: #0f62fe;
      --vscode-button-foreground: #ffffff;
      --vscode-descriptionForeground: #5c5c5c;
      --vscode-focusBorder: #0f62fe;
      --vscode-font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      --vscode-input-background: #ffffff;
      --vscode-input-foreground: #1e1e1e;
      --vscode-textLink-foreground: #0f62fe;
      --vscode-testing-iconPassed: #388a34;
      --vscode-charts-green: #388a34;
      --vscode-charts-blue: #3b82f6;
      --vscode-charts-purple: #a855f7;
      --vscode-charts-yellow: #eab308;
      --vscode-charts-orange: #f97316;
      --vscode-list-warningForeground: #b8860b;
      --vscode-editorWarning-foreground: #b8860b;
      --vscode-symbolIcon-classForeground: #007acc;
      --vscode-inputValidation-warningBorder: #c9a227;
`;

const rootNeedle = ":root {\n      --pad:";
if (!html.includes(rootNeedle)) {
  console.error("export-hub-for-intellij: expected :root --pad marker not found");
  process.exit(1);
}
html = html.replace(rootNeedle, `:root {\n${JCEF_THEME_FALLBACKS}\n      --pad:`);

const bridgeBeforeMainScript = `  <script>
  (function () {
    window.__copilotPending = [];
    window.copilotBridgePost = null;
    function acquireVsCodeApi() {
      return {
        postMessage: function (m) {
          var s = typeof m === "string" ? m : JSON.stringify(m);
          if (window.copilotBridgePost) {
            window.copilotBridgePost(s);
          } else {
            window.__copilotPending.push(s);
          }
        },
        getState: function () { return null; },
        setState: function () {},
      };
    }
    window.acquireVsCodeApi = acquireVsCodeApi;
  })();
  </script>
`;

const needle = `  <script>\n(function () {\n  var vscode = acquireVsCodeApi();`;
if (!html.includes(needle)) {
  console.error(
    "export-hub-for-intellij: expected hub script marker not found — hubWebviewDocument.ts changed?",
  );
  process.exit(1);
}
html = html.replace(needle, bridgeBeforeMainScript + needle);

/** Light theme polish (no second :root — theme vars already merged above). */
const jbFallbackCss = `
<style id="github-copilot-toolbox-jb-fallback">
body.hub-jb-theme {
  background: linear-gradient(180deg, #e8e8e8 0%, #ececec 32%, #ececec 100%) !important;
  color: var(--vscode-foreground);
  padding: 12px 14px 10px !important;
}

.hub-jb-kicker {
  margin: 0 0 10px;
  padding: 8px 12px;
  font-size: 11px;
  line-height: 1.45;
  color: var(--vscode-descriptionForeground);
  background: color-mix(in srgb, #ffffff 88%, var(--vscode-sideBar-background));
  border: 1px solid color-mix(in srgb, var(--vscode-widget-border) 70%, transparent);
  border-radius: 10px;
  box-shadow: 0 1px 0 color-mix(in srgb, var(--vscode-widget-shadow) 35%, transparent);
}

body.hub-jb-theme .pages {
  padding: 6px;
  gap: 6px;
  border-radius: 14px;
  background: color-mix(in srgb, #ffffff 55%, var(--vscode-sideBar-background));
  border: 1px solid color-mix(in srgb, var(--vscode-widget-border) 85%, transparent);
  box-shadow: inset 0 1px 2px rgba(255,255,255,0.65);
}
body.hub-jb-theme .page-btn {
  border-radius: 10px !important;
  font-weight: 700 !important;
  padding: 9px 8px !important;
}
body.hub-jb-theme .page-btn.active {
  box-shadow: 0 2px 8px color-mix(in srgb, var(--vscode-button-background) 35%, transparent) !important;
}

body.hub-jb-theme .one-click-row,
body.hub-jb-theme .thinking-machine-row {
  background: #ffffff !important;
  border: 1px solid color-mix(in srgb, var(--vscode-textLink-foreground) 28%, var(--vscode-widget-border)) !important;
  box-shadow:
    0 1px 0 rgba(0,0,0,0.04),
    0 8px 24px color-mix(in srgb, var(--vscode-textLink-foreground) 8%, transparent) !important;
}

body.hub-jb-theme button.hygiene-tile {
  background: #ffffff !important;
  border: 1px solid color-mix(in srgb, var(--vscode-widget-border) 90%, #ffffff) !important;
  border-radius: 12px !important;
  padding: 10px 12px !important;
  min-height: 56px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
}
body.hub-jb-theme button.hygiene-tile:hover {
  border-color: color-mix(in srgb, var(--vscode-focusBorder) 55%, var(--vscode-widget-border)) !important;
  box-shadow: 0 2px 8px color-mix(in srgb, var(--vscode-focusBorder) 12%, transparent);
}
body.hub-jb-theme .hic {
  font-family: "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji", sans-serif !important;
  font-size: 18px !important;
  line-height: 1.15 !important;
  font-variant-emoji: emoji;
  width: 1.5em;
  text-align: center;
}

body.hub-jb-theme .callout {
  background: #ffffff !important;
  border: 1px solid color-mix(in srgb, var(--vscode-widget-border) 80%, transparent) !important;
  border-radius: 12px !important;
  box-shadow: 0 1px 2px rgba(0,0,0,0.04);
}

body.hub-jb-theme .intel-foot-scan {
  background: color-mix(in srgb, var(--vscode-textLink-foreground) 10%, #ffffff) !important;
  border: 1px solid color-mix(in srgb, var(--vscode-textLink-foreground) 22%, transparent) !important;
  border-radius: 12px !important;
}

body.hub-jb-theme #scroll {
  background: transparent;
}
body.hub-jb-theme .hub-tabs-hint {
  color: var(--vscode-descriptionForeground);
  font-size: 11px;
}

body.hub-jb-theme { -webkit-font-smoothing: antialiased; }
</style>
`;

if (html.includes("</head>")) {
  html = html.replace("</head>", `${jbFallbackCss}</head>`);
} else {
  html = jbFallbackCss + html;
}

html = html.replace("<body>", '<body class="hub-jb-theme">');

if (html.includes('<div class="hub-header">')) {
  html = html.replace(
    '<div class="hub-header">',
    `<div class="hub-header"><p class="hub-jb-kicker">JetBrains — same hub as VS Code. Cursor/Copilot bridges use CLIs bundled in this plugin (local <code>node</code>), not a public <code>npx</code> fetch.</p>`,
  );
}

const out = join(
  __dirname,
  "..",
  "..",
  "github-copilot-toolbox-intellij",
  "src",
  "main",
  "resources",
  "hub",
  "hub-body.html",
);
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, html, "utf8");
console.log("Wrote", out, "(" + Math.round(html.length / 1024) + " KB)");
