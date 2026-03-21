import * as vscode from "vscode";

export const MCP_SKILLS_AWARENESS_BANNER_START =
  "<!-- github-copilot-toolbox:mcp-skills-awareness-begin -->";
export const MCP_SKILLS_AWARENESS_BANNER_END =
  "<!-- github-copilot-toolbox:mcp-skills-awareness-end -->";

export function buildMcpSkillsAwarenessInstructionsBlock(innerMarkdown: string): string {
  return [
    "",
    MCP_SKILLS_AWARENESS_BANNER_START,
    "",
    innerMarkdown.trim(),
    "",
    MCP_SKILLS_AWARENESS_BANNER_END,
    "",
  ].join("\n");
}

/** Replace the marked block if present; otherwise append. `existing` may be empty. */
export function replaceOrAppendAwarenessBlock(existing: string, block: string): string {
  const trimmed = existing.trim();
  if (!trimmed) {
    return `# GitHub Copilot instructions\n${block}`;
  }
  if (
    trimmed.includes(MCP_SKILLS_AWARENESS_BANNER_START) &&
    trimmed.includes(MCP_SKILLS_AWARENESS_BANNER_END)
  ) {
    const re = new RegExp(
      `${escapeRe(MCP_SKILLS_AWARENESS_BANNER_START)}[\\s\\S]*?${escapeRe(MCP_SKILLS_AWARENESS_BANNER_END)}\\n*`,
      "m"
    );
    return trimmed.replace(re, block);
  }
  return trimmed + block;
}

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

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
