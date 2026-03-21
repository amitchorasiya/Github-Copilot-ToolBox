import * as vscode from "vscode";
import * as mcpPaths from "../mcpPaths";

const NOTEPAD_REL = ".vscode/copilot-kit-notepad.md";

const DEFAULT_CONTENT = `# GitHub Copilot Toolbox — session notepad

Pin context here for **this session**. Before chatting, run **GitHub Copilot Toolbox: Copy notepad to clipboard** and paste into Copilot if needed.

---

`;

export async function openSessionNotepad(): Promise<void> {
  const folder = mcpPaths.getPrimaryWorkspaceFolder();
  if (!folder) {
    vscode.window.showErrorMessage("Open a workspace folder first.");
    return;
  }
  const uri = vscode.Uri.joinPath(folder.uri, ...NOTEPAD_REL.split("/"));
  try {
    await vscode.workspace.fs.stat(uri);
  } catch {
    const enc = new TextEncoder();
    await vscode.workspace.fs.writeFile(uri, enc.encode(DEFAULT_CONTENT));
  }
  const doc = await vscode.workspace.openTextDocument(uri);
  await vscode.window.showTextDocument(doc);
}

/** Append a markdown block to the session notepad (creates file with default header if missing). */
export async function appendToSessionNotepad(markdownBlock: string): Promise<void> {
  const folder = mcpPaths.getPrimaryWorkspaceFolder();
  if (!folder) {
    vscode.window.showErrorMessage("Open a workspace folder first.");
    return;
  }
  const uri = vscode.Uri.joinPath(folder.uri, ...NOTEPAD_REL.split("/"));
  const enc = new TextEncoder();
  const dec = new TextDecoder();
  let body = "";
  try {
    const buf = await vscode.workspace.fs.readFile(uri);
    body = dec.decode(buf);
  } catch {
    await vscode.workspace.fs.writeFile(uri, enc.encode(DEFAULT_CONTENT));
    body = DEFAULT_CONTENT;
  }
  const stamp = `\n\n---\n\n## Appended context pack — ${new Date().toISOString()}\n\n`;
  await vscode.workspace.fs.writeFile(
    uri,
    enc.encode(`${body.trimEnd()}${stamp}${markdownBlock}\n`)
  );
}

export async function copySessionNotepadToClipboard(): Promise<void> {
  const folder = mcpPaths.getPrimaryWorkspaceFolder();
  if (!folder) {
    vscode.window.showErrorMessage("Open a workspace folder first.");
    return;
  }
  const uri = vscode.Uri.joinPath(folder.uri, ...NOTEPAD_REL.split("/"));
  try {
    const buf = await vscode.workspace.fs.readFile(uri);
    const text = new TextDecoder().decode(buf);
    await vscode.env.clipboard.writeText(text);
    vscode.window.showInformationMessage("Notepad copied to clipboard — paste into Copilot Chat.");
  } catch {
    vscode.window.showErrorMessage(
      "Create the notepad first: GitHub Copilot Toolbox: Open session notepad."
    );
  }
}
