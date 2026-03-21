import * as vscode from "vscode";
import * as mcpPaths from "../mcpPaths";
import { appendCursorrules } from "./migrateCursorrules";
import { initMemoryBank } from "./memoryBankInit";
import { portCursorMcp } from "./portFromCursor";
import { syncCursorRules } from "./rulesToCopilot";

export async function workspaceSetupWizard(): Promise<void> {
  if (!mcpPaths.getPrimaryWorkspaceFolder()) {
    vscode.window.showErrorMessage("Open a workspace folder first.");
    return;
  }

  const step1 = await vscode.window.showInformationMessage(
    "Step 1/4: Initialize memory bank (optional)?",
    "Run memory bank init",
    "Skip",
    "Cancel"
  );
  if (step1 === "Cancel" || step1 === undefined) {
    return;
  }
  if (step1 === "Run memory bank init") {
    await initMemoryBank();
  }

  const step2 = await vscode.window.showInformationMessage(
    "Step 2/4: Sync `.cursor/rules` → Copilot instructions (npx)?",
    "Run rules sync",
    "Skip",
    "Cancel"
  );
  if (step2 === "Cancel") {
    return;
  }
  if (step2 === "Run rules sync") {
    await syncCursorRules();
  }

  const step2b = await vscode.window.showInformationMessage(
    "Step 3/4: Append root `.cursorrules` into `.github/copilot-instructions.md` (if .cursorrules exists)?",
    "Append .cursorrules",
    "Skip",
    "Cancel"
  );
  if (step2b === "Cancel") {
    return;
  }
  if (step2b === "Append .cursorrules") {
    await appendCursorrules();
  }

  const step3 = await vscode.window.showInformationMessage(
    "Step 4/4: Port Cursor `~/.cursor/mcp.json` → workspace `mcp.json`?",
    "Run MCP port",
    "Skip",
    "Cancel"
  );
  if (step3 === "Cancel") {
    return;
  }
  if (step3 === "Run MCP port") {
    await portCursorMcp();
  }

  await vscode.window.showInformationMessage(
    "Wizard complete. Use GitHub Copilot Toolbox views for MCP, workspace files, and the Guide.",
    "OK"
  );
}
