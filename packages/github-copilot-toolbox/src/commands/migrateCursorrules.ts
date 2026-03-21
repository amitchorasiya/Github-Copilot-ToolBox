import * as vscode from "vscode";
import * as mcpPaths from "../mcpPaths";

/** New markers (match extension package `name`). */
const BANNER_START = "<!-- github-copilot-toolbox:cursorrules-begin -->";
const BANNER_END = "<!-- github-copilot-toolbox:cursorrules-end -->";

/** Legacy package id `cursor-copilot-kit` — still recognized for replace. */
const LEGACY_BANNER_START = "<!-- cursor-copilot-kit:cursorrules-begin -->";
const LEGACY_BANNER_END = "<!-- cursor-copilot-kit:cursorrules-end -->";

export async function appendCursorrules(): Promise<void> {
  const folder = mcpPaths.getPrimaryWorkspaceFolder();
  if (!folder) {
    vscode.window.showErrorMessage("Open a workspace folder first.");
    return;
  }

  const rulesUri = vscode.Uri.joinPath(folder.uri, ".cursorrules");
  let rulesText: string;
  try {
    const buf = await vscode.workspace.fs.readFile(rulesUri);
    rulesText = new TextDecoder().decode(buf).trim();
  } catch {
    vscode.window.showErrorMessage("No .cursorrules file found at workspace root.");
    return;
  }

  if (!rulesText) {
    vscode.window.showWarningMessage(".cursorrules is empty.");
    return;
  }

  const gh = vscode.Uri.joinPath(folder.uri, ".github");
  const outUri = vscode.Uri.joinPath(gh, "copilot-instructions.md");

  try {
    await vscode.workspace.fs.stat(gh);
  } catch {
    await vscode.workspace.fs.createDirectory(gh);
  }

  const block = [
    "",
    BANNER_START,
    "",
    "## Migrated from `.cursorrules` (via GitHub Copilot Toolbox)",
    "",
    rulesText,
    "",
    BANNER_END,
    "",
  ].join("\n");

  let existing = "";
  try {
    const doc = await vscode.workspace.fs.readFile(outUri);
    existing = new TextDecoder().decode(doc);
  } catch {
    /* new file */
  }

  let next: string;
  if (!existing) {
    next = `# GitHub Copilot instructions\n${block}`;
  } else {
    const replaced = tryReplaceMigrationBlock(existing, block);
    if (replaced !== null) {
      next = replaced;
    } else {
      next = existing.trimEnd() + block;
    }
  }

  await vscode.workspace.fs.writeFile(outUri, new TextEncoder().encode(next));
  await vscode.window.showTextDocument(outUri);
  vscode.window.showInformationMessage(
    "Merged .cursorrules into .github/copilot-instructions.md (replaceable block)."
  );
}

function tryReplaceMigrationBlock(existing: string, newBlock: string): string | null {
  const pairs: [string, string][] = [
    [BANNER_START, BANNER_END],
    [LEGACY_BANNER_START, LEGACY_BANNER_END],
  ];
  for (const [start, end] of pairs) {
    if (existing.includes(start) && existing.includes(end)) {
      const re = new RegExp(
        `${escapeRe(start)}[\\s\\S]*?${escapeRe(end)}\\n*`,
        "m"
      );
      return existing.replace(re, newBlock);
    }
  }
  return null;
}

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
