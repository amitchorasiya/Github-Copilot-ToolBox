import * as vscode from "vscode";
import * as mcpPaths from "../mcpPaths";
import type { PortProjectMcpJsonMode } from "./portClaudeProjectMcpJson";
import { portClaudeProjectMcpJson } from "./portClaudeProjectMcpJson";

/**
 * Interactive: merge workspace `.mcp.json` (Claude Code / project style) into VS Code `mcp.json`.
 */
export async function portClaudeProjectMcpCommand(): Promise<void> {
  const folder = mcpPaths.getPrimaryWorkspaceFolder();
  if (!folder) {
    vscode.window.showErrorMessage("Open a workspace folder first.");
    return;
  }

  const cfg = vscode.workspace.getConfiguration();
  const insiders = cfg.get<boolean>("copilot-toolbox.useInsidersPaths") === true;

  const pick = await vscode.window.showQuickPick<
    { label: string; description: string; value: PortProjectMcpJsonMode } & vscode.QuickPickItem
  >(
    [
      {
        label: "User mcp.json (merge)",
        description: "Merge .mcp.json servers into global VS Code mcp.json",
        value: "user",
        alwaysShow: true,
      },
      {
        label: "Workspace .vscode/mcp.json (merge)",
        description: "Merge with existing workspace servers",
        value: "workspaceMerge",
        alwaysShow: true,
      },
      {
        label: "Workspace .vscode/mcp.json (overwrite servers)",
        description: "Replace workspace servers with .mcp.json only",
        value: "workspaceOverwrite",
        alwaysShow: true,
      },
      {
        label: "Dry run (Output channel)",
        description: "Log planned merge only",
        value: "dry",
        alwaysShow: true,
      },
    ],
    { title: "Port workspace .mcp.json → VS Code", placeHolder: "Choose target" }
  );
  if (!pick) {
    return;
  }

  const result = await portClaudeProjectMcpJson(folder, pick.value, insiders);
  if (!result.ok) {
    vscode.window.showErrorMessage(result.note);
    return;
  }
  if (result.note) {
    await vscode.window.showInformationMessage(result.note);
  }
}
