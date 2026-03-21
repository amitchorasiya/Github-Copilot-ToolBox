import * as vscode from "vscode";
import { kitPageHtml, kitCard } from "../webview/modernShell";

/**
 * Lightweight "Composer-like" hub: single webview with shortcuts and tips (not a full Composer clone).
 */
export function openComposerHubPanel(context: vscode.ExtensionContext): void {
  const panel = vscode.window.createWebviewPanel(
    "copilotKitComposerHub",
    "GitHub Copilot Toolbox — Chat hub",
    vscode.ViewColumn.Beside,
    { enableScripts: false }
  );

  panel.iconPath = vscode.Uri.joinPath(
    context.extensionUri,
    "resources",
    "icon.svg"
  );

  panel.webview.html = getComposerHubHtml();
}

function getComposerHubHtml(): string {
  const shortcuts = kitCard(
    "Shortcuts",
    `<ul>
      <li><strong>Open Chat</strong> — <code>GitHub Copilot Toolbox: Open Chat</code></li>
      <li><strong>Inline chat</strong> — default <code>Ctrl+I</code> / <code>Cmd+I</code>; toolbox binding <code>Ctrl+Alt+K</code> / <code>Cmd+Alt+K</code></li>
      <li><strong>Agent + MCP</strong> — Chat → mode <strong>Agent</strong> → tools</li>
    </ul>`
  );

  const workflow = kitCard(
    "Workflow",
    `<p>Copilot uses the <strong>Chat</strong> sidebar and <strong>Agent</strong> mode instead of a separate Composer panel. Pin Chat or use the command above for a Cursor-like rhythm.</p>
    <p><a class="kit-link" href="https://code.visualstudio.com/docs/copilot/chat/copilot-chat">Copilot Chat docs</a>
    <a class="kit-link kit-link--secondary" href="https://code.visualstudio.com/docs/copilot/chat/mcp-servers">MCP in VS Code</a></p>`
  );

  return kitPageHtml({
    title: "Chat hub",
    subtitle:
      "Composer-style multi-step edits map to Copilot Chat + Agent. Use the tree and commands in this toolbox to jump faster.",
    bodyHtml: workflow + shortcuts,
  });
}
