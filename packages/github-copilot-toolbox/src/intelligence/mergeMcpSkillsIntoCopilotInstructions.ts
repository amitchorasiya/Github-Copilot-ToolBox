import * as vscode from "vscode";
import {
  buildMcpSkillsAwarenessInstructionsBlock,
  replaceOrAppendAwarenessBlock,
} from "./mergeMcpSkillsIntoCopilotInstructionsCore";

export {
  MCP_SKILLS_AWARENESS_BANNER_END,
  MCP_SKILLS_AWARENESS_BANNER_START,
  buildMcpSkillsAwarenessInstructionsBlock,
  replaceOrAppendAwarenessBlock,
} from "./mergeMcpSkillsIntoCopilotInstructionsCore";

/**
 * Writes or updates `.github/copilot-instructions.md` with a replaceable MCP & skills block.
 */
export async function mergeMcpSkillsAwarenessIntoCopilotInstructions(
  folder: vscode.WorkspaceFolder,
  innerMarkdown: string
): Promise<void> {
  const gh = vscode.Uri.joinPath(folder.uri, ".github");
  const outUri = vscode.Uri.joinPath(gh, "copilot-instructions.md");

  try {
    await vscode.workspace.fs.stat(gh);
  } catch {
    await vscode.workspace.fs.createDirectory(gh);
  }

  const block = buildMcpSkillsAwarenessInstructionsBlock(innerMarkdown);

  let existing = "";
  try {
    const doc = await vscode.workspace.fs.readFile(outUri);
    existing = new TextDecoder().decode(doc);
  } catch {
    /* new file */
  }

  const next = replaceOrAppendAwarenessBlock(existing, block);
  await vscode.workspace.fs.writeFile(outUri, new TextEncoder().encode(next));
}
