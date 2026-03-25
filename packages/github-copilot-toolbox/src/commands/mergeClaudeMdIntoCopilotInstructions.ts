import * as vscode from "vscode";
import * as mcpPaths from "../mcpPaths";
import {
  buildClaudeMdMigrationBlock,
  mergeClaudeMdBlockIntoInstructions,
} from "./mergeClaudeMdCore";

export type MergeClaudeMdOptions = {
  dryRun: boolean;
  /** When false (default), skip reading `CLAUDE.local.md`. */
  includeLocalMd: boolean;
};

/**
 * Merge repo-root `CLAUDE.md` (and optionally `CLAUDE.local.md`) into `.github/copilot-instructions.md`.
 * No-ops when `CLAUDE.md` is missing or empty.
 */
export async function mergeClaudeMdIntoCopilotInstructions(
  folder: vscode.WorkspaceFolder,
  opts: MergeClaudeMdOptions
): Promise<{ status: "skipped" | "dryRun" | "wrote"; detail?: string }> {
  const claudeUri = vscode.Uri.joinPath(folder.uri, "CLAUDE.md");
  let mainText: string;
  try {
    const buf = await vscode.workspace.fs.readFile(claudeUri);
    mainText = new TextDecoder().decode(buf).trim();
  } catch {
    return { status: "skipped", detail: "No CLAUDE.md at workspace root." };
  }

  if (!mainText) {
    return { status: "skipped", detail: "CLAUDE.md is empty." };
  }

  let localText: string | undefined;
  if (opts.includeLocalMd) {
    const localUri = vscode.Uri.joinPath(folder.uri, "CLAUDE.local.md");
    try {
      const buf = await vscode.workspace.fs.readFile(localUri);
      const t = new TextDecoder().decode(buf).trim();
      if (t) {
        localText = t;
      }
    } catch {
      /* optional file */
    }
  }

  const block = buildClaudeMdMigrationBlock(mainText, localText);
  const gh = vscode.Uri.joinPath(folder.uri, ".github");
  const outUri = vscode.Uri.joinPath(gh, "copilot-instructions.md");

  let existing = "";
  try {
    const doc = await vscode.workspace.fs.readFile(outUri);
    existing = new TextDecoder().decode(doc);
  } catch {
    /* new file */
  }

  const next = mergeClaudeMdBlockIntoInstructions(existing, block);

  if (opts.dryRun) {
    const added = Math.max(0, next.length - existing.length);
    return {
      status: "dryRun",
      detail: `Would update .github/copilot-instructions.md (≈ ${added} chars delta).`,
    };
  }

  try {
    await vscode.workspace.fs.stat(gh);
  } catch {
    await vscode.workspace.fs.createDirectory(gh);
  }

  await vscode.workspace.fs.writeFile(outUri, new TextEncoder().encode(next));
  return { status: "wrote" };
}

/** Command entry: requires workspace folder (shows UI if missing). */
export async function mergeClaudeMdCommand(): Promise<void> {
  const folder = mcpPaths.getPrimaryWorkspaceFolder();
  if (!folder) {
    vscode.window.showErrorMessage("Open a workspace folder first.");
    return;
  }
  const r = await mergeClaudeMdIntoCopilotInstructions(folder, {
    dryRun: false,
    includeLocalMd: true,
  });
  if (r.status === "skipped") {
    vscode.window.showInformationMessage(r.detail ?? "Skipped.");
    return;
  }
  vscode.window.showInformationMessage("Merged CLAUDE.md into .github/copilot-instructions.md.");
}
