import * as vscode from "vscode";
import * as mcpPaths from "../mcpPaths";
import { runNpxInTerminal } from "../terminal/runNpx";

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

  const args = ["--cwd", folder.uri.fsPath];
  if (pick.value === "dry") {
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
