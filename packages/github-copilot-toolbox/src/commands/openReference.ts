import * as vscode from "vscode";
import * as path from "node:path";
import * as fs from "node:fs/promises";
import { kitPageHtml } from "../webview/modernShell";
import { markdownToKitBody } from "../webview/mdToKitHtml";

export async function openCursorCopilotReference(
  context: vscode.ExtensionContext
): Promise<void> {
  const mdPath = path.join(
    context.extensionPath,
    "resources",
    "cursor-vs-copilot-reference.md"
  );
  let md: string;
  try {
    md = await fs.readFile(mdPath, "utf8");
  } catch {
    await vscode.window.showErrorMessage(
      "GitHub Copilot Toolbox: could not read cursor-vs-copilot-reference.md"
    );
    return;
  }

  const panel = vscode.window.createWebviewPanel(
    "copilotKitReference",
    "GitHub Copilot Toolbox — Cursor vs Copilot",
    vscode.ViewColumn.Beside,
    { enableScripts: false }
  );

  panel.iconPath = vscode.Uri.joinPath(
    context.extensionUri,
    "resources",
    "icon.svg"
  );

  const bodyHtml = markdownToKitBody(md);
  panel.webview.html = kitPageHtml({
    title: "Cursor vs GitHub Copilot",
    subtitle:
      "Quick reference for rules, chat context, shortcuts, and workflow — styled to match your theme.",
    bodyHtml,
  });
}
