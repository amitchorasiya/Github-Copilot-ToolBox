import * as vscode from "vscode";

/** Companion repos for Cursor → VS Code / Copilot bridge CLIs. */
export const INTELLIGENCE_BRIDGE_REPOS = {
  mcpPort: "https://github.com/amitchorasiya/Github-Copilot-Cursor-MCP-Port",
  memoryBank: "https://github.com/amitchorasiya/Github-Copilot-Memory-Bank",
  rulesConverter: "https://github.com/amitchorasiya/Github-Copilot-Cursor-Rules-Converter",
} as const;

async function openUrl(url: string): Promise<void> {
  await vscode.env.openExternal(vscode.Uri.parse(url));
}

export async function openIntelligenceRepoMcpPort(): Promise<void> {
  await openUrl(INTELLIGENCE_BRIDGE_REPOS.mcpPort);
}

export async function openIntelligenceRepoMemoryBank(): Promise<void> {
  await openUrl(INTELLIGENCE_BRIDGE_REPOS.memoryBank);
}

export async function openIntelligenceRepoRulesConverter(): Promise<void> {
  await openUrl(INTELLIGENCE_BRIDGE_REPOS.rulesConverter);
}
