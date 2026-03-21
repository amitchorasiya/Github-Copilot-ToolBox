import * as vscode from "vscode";

type GuideRow = { id: string; label: string; cmd: string; icon: string };

export class GuideTreeProvider implements vscode.TreeDataProvider<GuideTreeItem> {
  getTreeItem(element: GuideTreeItem): vscode.TreeItem {
    return element;
  }

  async getChildren(): Promise<GuideTreeItem[]> {
    const rows: GuideRow[] = [
      {
        id: "intel-pack",
        label: "Intelligence: build context pack (Chat)",
        cmd: "GitHubCopilotToolBox.buildContextPack",
        icon: "package",
      },
      {
        id: "intel-aware",
        label: "Intelligence: scan MCP & Skills awareness (report)",
        cmd: "GitHubCopilotToolBox.showMcpSkillsAwareness",
        icon: "search",
      },
      {
        id: "intel-ready",
        label: "Intelligence: readiness summary",
        cmd: "GitHubCopilotToolBox.showIntelligenceReadiness",
        icon: "shield",
      },
      {
        id: "intel-cfg",
        label: "Intelligence: related settings",
        cmd: "GitHubCopilotToolBox.openIntelligenceSettings",
        icon: "settings-gear",
      },
      {
        id: "intel-repo-mcp",
        label: "Intelligence: MCP port — GitHub (cursor-mcp-to-github-copilot-port)",
        cmd: "GitHubCopilotToolBox.openIntelligenceRepoMcpPort",
        icon: "link-external",
      },
      {
        id: "intel-repo-mem",
        label: "Intelligence: Memory bank — GitHub (github-copilot-memory-bank)",
        cmd: "GitHubCopilotToolBox.openIntelligenceRepoMemoryBank",
        icon: "link-external",
      },
      {
        id: "intel-repo-rules",
        label: "Intelligence: Rules converter — GitHub (cursor-rules-to-github-copilot)",
        cmd: "GitHubCopilotToolBox.openIntelligenceRepoRulesConverter",
        icon: "link-external",
      },
      {
        id: "intel-mig-skills",
        label: "Intelligence: migrate skills .cursor/skills → .agents/skills",
        cmd: "GitHubCopilotToolBox.migrateSkillsCursorToAgents",
        icon: "folder-library",
      },
      {
        id: "ref",
        label: "Cursor vs Copilot reference",
        cmd: "GitHubCopilotToolBox.openCursorCopilotReference",
        icon: "book",
      },
      {
        id: "inline",
        label: "Inline chat (Cursor-style)",
        cmd: "GitHubCopilotToolBox.openInlineChatCursorStyle",
        icon: "comment",
      },
      {
        id: "hub",
        label: "Chat hub (Composer tips)",
        cmd: "GitHubCopilotToolBox.openComposerHub",
        icon: "layout-panel",
      },
      {
        id: "pad",
        label: "Open session notepad",
        cmd: "GitHubCopilotToolBox.openSessionNotepad",
        icon: "notebook",
      },
      {
        id: "copy",
        label: "Copy notepad → clipboard",
        cmd: "GitHubCopilotToolBox.copySessionNotepad",
        icon: "copy",
      },
      {
        id: "pru",
        label: "Copilot billing / usage (PRU)",
        cmd: "GitHubCopilotToolBox.openCopilotBillingDocs",
        icon: "graph",
      },
      {
        id: "env",
        label: "Environment sync checklist",
        cmd: "GitHubCopilotToolBox.openEnvSyncChecklist",
        icon: "checklist",
      },
      {
        id: "append",
        label: "Append .cursorrules → copilot-instructions",
        cmd: "GitHubCopilotToolBox.appendCursorrules",
        icon: "arrow-right",
      },
      {
        id: "xlate",
        label: "Translate selection (@ → Copilot-ish)",
        cmd: "GitHubCopilotToolBox.translateContextSelection",
        icon: "symbol-misc",
      },
    ];
    return rows.map((r) => new GuideTreeItem(r));
  }
}

export class GuideTreeItem extends vscode.TreeItem {
  constructor(row: GuideRow) {
    super(row.label, vscode.TreeItemCollapsibleState.None);
    this.id = row.id;
    this.iconPath = new vscode.ThemeIcon(row.icon);
    this.command = {
      command: row.cmd,
      title: row.label,
    };
  }
}
