import * as vscode from "vscode";

export async function openIntelligenceSettings(): Promise<void> {
  await vscode.commands.executeCommand(
    "workbench.action.openSettings",
    "GitHubCopilotToolBox.intelligence"
  );
}
