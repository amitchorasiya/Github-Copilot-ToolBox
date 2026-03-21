import * as vscode from "vscode";
import * as mcpPaths from "../mcpPaths";
import { evaluateReadiness, formatReadinessMarkdown } from "./readiness";
import { gatherReadinessInput } from "./buildReadinessInput";

export async function showIntelligenceReadiness(): Promise<void> {
  const folder = mcpPaths.getPrimaryWorkspaceFolder();
  if (!folder) {
    vscode.window.showErrorMessage("Open a workspace folder first.");
    return;
  }
  const input = await gatherReadinessInput(folder);
  const checks = evaluateReadiness(input);
  const md = formatReadinessMarkdown(checks);
  const doc = await vscode.workspace.openTextDocument({
    content: md,
    language: "markdown",
  });
  await vscode.window.showTextDocument(doc, { preview: true, viewColumn: vscode.ViewColumn.Active });
  vscode.window.showInformationMessage(
    "GitHub Copilot Toolbox: readiness summary opened — use Command Palette to run suggested commands."
  );
}
