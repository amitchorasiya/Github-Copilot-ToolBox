import * as vscode from "vscode";

const INLINE_CANDIDATES = [
  "inlineChat.start",
  "editor.action.inlineChat.start",
  "github.copilot.generate",
  "workbench.action.chat.open",
];

export async function openInlineChatCursorStyle(): Promise<void> {
  for (const id of INLINE_CANDIDATES) {
    try {
      await vscode.commands.executeCommand(id);
      return;
    } catch {
      /* try next */
    }
  }
  vscode.window.showWarningMessage(
    "Inline chat not available. Install GitHub Copilot and try Ctrl+I (default inline chat)."
  );
}
