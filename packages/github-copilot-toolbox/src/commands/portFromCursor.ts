import * as vscode from "vscode";
import * as mcpPaths from "../mcpPaths";
import { runNpxInTerminal } from "../terminal/runNpx";

export async function portCursorMcp(): Promise<void> {
  const folder = mcpPaths.getPrimaryWorkspaceFolder();
  if (!folder) {
    vscode.window.showErrorMessage("Open a workspace folder first.");
    return;
  }
  const cfg = vscode.workspace.getConfiguration();
  const tag = mcpPaths.npxTag(cfg);

  const mode = await vscode.window.showQuickPick(
    [
      { label: "Write .vscode/mcp.json (overwrite)", value: "force" as const },
      { label: "Merge into existing .vscode/mcp.json", value: "merge" as const },
      { label: "User mcp.json (all workspaces)", value: "user" as const },
      { label: "Dry run (print JSON only)", value: "dry" as const },
    ],
    { title: "Port Cursor MCP → VS Code" }
  );
  if (!mode) {
    return;
  }

  const args: string[] = [];
  if (mode.value === "dry") {
    args.push("--dry-run");
  } else if (mode.value === "user") {
    args.push("-t", "user", "--force");
  } else if (mode.value === "merge") {
    args.push("--merge", "--force");
  } else {
    args.push("--force");
  }

  if (mode.value === "dry") {
    runNpxInTerminal(folder.uri.fsPath, "cursor-mcp-to-github-copilot-port", tag, args, "Cursor MCP port");
    return;
  }

  runNpxInTerminal(
    folder.uri.fsPath,
    "cursor-mcp-to-github-copilot-port",
    tag,
    args,
    "Cursor MCP port"
  );
}
