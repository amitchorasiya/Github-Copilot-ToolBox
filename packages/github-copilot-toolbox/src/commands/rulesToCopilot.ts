import * as vscode from "vscode";
import * as mcpPaths from "../mcpPaths";
import { runNpxInTerminal } from "../terminal/runNpx";

/** Sync Cursor rules without quick picks (One Click Setup). */
export function runSyncCursorRulesWithOptions(
  folder: vscode.WorkspaceFolder,
  tag: string,
  dryRun: boolean
): void {
  const args = ["--cwd", folder.uri.fsPath];
  if (dryRun) {
    args.push("--dry-run");
  }
  runNpxInTerminal(
    folder.uri.fsPath,
    "cursor-rules-to-github-copilot",
    tag,
    args,
    "Cursor rules → Copilot"
  );
}

export async function syncCursorRules(): Promise<void> {
  const folder = mcpPaths.getPrimaryWorkspaceFolder();
  if (!folder) {
    vscode.window.showErrorMessage("Open a workspace folder first.");
    return;
  }
  const cfg = vscode.workspace.getConfiguration();
  const tag = mcpPaths.npxTag(cfg);

  const pick = await vscode.window.showQuickPick(
    [
      { label: "Run (write .github/ files)", value: "run" as const },
      { label: "Dry run (preview only)", value: "dry" as const },
    ],
    { title: "Sync Cursor rules → Copilot instructions" }
  );
  if (!pick) {
    return;
  }

  runSyncCursorRulesWithOptions(folder, tag, pick.value === "dry");
}
