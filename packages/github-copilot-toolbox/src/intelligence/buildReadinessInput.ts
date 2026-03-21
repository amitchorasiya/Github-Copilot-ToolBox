import * as vscode from "vscode";
import type { ReadinessInput } from "./readiness";

async function fileFact(uri: vscode.Uri): Promise<{ exists: boolean; byteLength: number; mtimeMs?: number }> {
  try {
    const st = await vscode.workspace.fs.stat(uri);
    if ((st.type & vscode.FileType.Directory) !== 0) {
      return { exists: true, byteLength: 0 };
    }
    let byteLength = typeof st.size === "number" ? st.size : 0;
    if (byteLength === 0) {
      try {
        const buf = await vscode.workspace.fs.readFile(uri);
        byteLength = buf.byteLength;
      } catch {
        /* keep 0 */
      }
    }
    const mtimeMs = typeof st.mtime === "number" ? st.mtime : undefined;
    return { exists: true, byteLength, mtimeMs };
  } catch {
    return { exists: false, byteLength: 0 };
  }
}

async function dirExists(uri: vscode.Uri): Promise<boolean> {
  try {
    const st = await vscode.workspace.fs.stat(uri);
    return (st.type & vscode.FileType.Directory) !== 0;
  } catch {
    return false;
  }
}

async function countInstructionFiles(root: vscode.Uri): Promise<number> {
  const dir = vscode.Uri.joinPath(root, ".github", "instructions");
  try {
    const entries = await vscode.workspace.fs.readDirectory(dir);
    return entries.filter(([name, t]) => t === vscode.FileType.File && name.endsWith(".instructions.md"))
      .length;
  } catch {
    return 0;
  }
}

async function hasCursorRulesDirFiles(root: vscode.Uri): Promise<boolean> {
  const dir = vscode.Uri.joinPath(root, ".cursor", "rules");
  try {
    const entries = await vscode.workspace.fs.readDirectory(dir);
    return entries.some(
      ([name, t]) =>
        t === vscode.FileType.File && (name.endsWith(".mdc") || name.endsWith(".md"))
    );
  } catch {
    return false;
  }
}

export async function gatherReadinessInput(folder: vscode.WorkspaceFolder): Promise<ReadinessInput> {
  const root = folder.uri;
  const copilotInstructions = await fileFact(
    vscode.Uri.joinPath(root, ".github", "copilot-instructions.md")
  );
  const agentsMd = await fileFact(vscode.Uri.joinPath(root, "AGENTS.md"));
  const workspaceMcpJson = await fileFact(vscode.Uri.joinPath(root, ".vscode", "mcp.json"));
  const cursorrules = await fileFact(vscode.Uri.joinPath(root, ".cursorrules"));
  const instructionFilesInDotGithub = await countInstructionFiles(root);
  const memoryBankDirExists = await dirExists(vscode.Uri.joinPath(root, "memory-bank"));
  const cursorRulesDirHasFiles = await hasCursorRulesDirFiles(root);

  return {
    copilotInstructions,
    agentsMd,
    instructionFilesInDotGithub,
    memoryBankDirExists,
    workspaceMcpJson,
    cursorrules,
    cursorRulesDirHasFiles,
  };
}
