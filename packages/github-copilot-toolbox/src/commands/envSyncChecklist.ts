import * as vscode from "vscode";

export async function showEnvSyncChecklist(): Promise<void> {
  const lines = [
    "## Cursor → VS Code environment checklist",
    "",
    "Copy items into your notes; check off as you go.",
    "",
    "### Editor",
    "- [ ] Install **GitHub Copilot** + sign in",
    "- [ ] VS Code **1.99+** for MCP support",
    "- [ ] Optional: import useful settings from Cursor `settings.json` (many keys differ — merge manually)",
    "",
    "### This workspace",
    "- [ ] **MCP:** Port `~/.cursor/mcp.json` → `.vscode/mcp.json` (GitHub Copilot Toolbox)",
    "- [ ] **Rules:** `npx cursor-rules-to-github-copilot` or append `.cursorrules`",
    "- [ ] **Memory:** `npx github-copilot-memory-bank init` (optional)",
    "- [ ] **Session notepad:** `.vscode/copilot-toolbox-notepad.md`",
    "",
    "### Extensions",
    "- [ ] Reinstall Marketplace equivalents for Cursor-only extensions",
    "- [ ] Keybindings: consider **Ctrl+Alt+K** for inline chat (GitHub Copilot Toolbox)",
    "",
    "### Docs",
    "- [ ] **GitHub Copilot Toolbox: Open Cursor vs Copilot reference**",
    "- [ ] **Copilot billing / PRU** command for quota links",
    "",
  ];

  const doc = await vscode.workspace.openTextDocument({
    content: lines.join("\n"),
    language: "markdown",
  });
  await vscode.window.showTextDocument(doc, { preview: true });
  vscode.window.showInformationMessage(
    "Checklist is an unsaved buffer — copy or save if you want to keep it."
  );
}
