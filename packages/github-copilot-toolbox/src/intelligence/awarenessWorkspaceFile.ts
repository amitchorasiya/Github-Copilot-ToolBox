import * as vscode from "vscode";

/** Written under `.github/` on each MCP & Skills scan (overwritten). */
export const MCP_SKILLS_AWARENESS_FILENAME = "copilot-toolbox-mcp-skills-awareness.md";

/** Workspace-relative path for docs and Copilot instructions. */
export const MCP_SKILLS_AWARENESS_RELATIVE = `.github/${MCP_SKILLS_AWARENESS_FILENAME}`;

/**
 * Overwrites the workspace awareness markdown (creates `.github` if needed).
 */
export async function writeMcpSkillsAwarenessWorkspaceFile(
  folder: vscode.WorkspaceFolder,
  markdown: string
): Promise<void> {
  const gh = vscode.Uri.joinPath(folder.uri, ".github");
  try {
    await vscode.workspace.fs.stat(gh);
  } catch {
    await vscode.workspace.fs.createDirectory(gh);
  }
  const uri = vscode.Uri.joinPath(gh, MCP_SKILLS_AWARENESS_FILENAME);
  await vscode.workspace.fs.writeFile(uri, new TextEncoder().encode(markdown));
}
