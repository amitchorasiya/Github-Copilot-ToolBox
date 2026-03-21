import * as vscode from "vscode";

const CANDIDATES = [
  "workbench.action.chat.open",
  "workbench.action.chat.toggle",
  "github.copilot.chat.focus",
];

export async function openCopilotChat(): Promise<void> {
  for (const id of CANDIDATES) {
    try {
      await vscode.commands.executeCommand(id);
      return;
    } catch {
      /* try next */
    }
  }
  vscode.window.showWarningMessage(
    "Could not open Chat automatically. Use the Copilot icon or Command Palette: Chat: Open Chat."
  );
}
