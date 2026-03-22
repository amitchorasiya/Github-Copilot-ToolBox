import * as vscode from "vscode";
import { appendCursorrules } from "./commands/migrateCursorrules";
import { createCursorrulesTemplate } from "./commands/createCursorrulesTemplate";
import { openComposerHubPanel } from "./commands/composerPanel";
import { showEnvSyncChecklist } from "./commands/envSyncChecklist";
import { openInlineChatCursorStyle } from "./commands/inlineChatProxy";
import { initMemoryBank } from "./commands/memoryBankInit";
import { openCopilotBillingDocs } from "./commands/openPruDocs";
import { openCursorCopilotReference } from "./commands/openReference";
import { openCopilotChat } from "./commands/openCopilot";
import { openInstructionsPicker } from "./commands/openInstructionsPicker";
import { portCursorMcp } from "./commands/portFromCursor";
import { syncCursorRules } from "./commands/rulesToCopilot";
import { runCopilotToolboxConfigScan } from "./commands/copilotConfigScan";
import { appendNotepadToMemoryBank } from "./commands/memoryBankFromNotepad";
import { applyBundledMcpRecipe } from "./commands/mcpRecipeCommand";
import { createSkillStubCommand } from "./commands/skillStubCommand";
import { runVerificationChecklist } from "./commands/verificationCommand";
import { runFirstWorkspaceTestTask } from "./commands/runFirstTestTask";
import { copySessionNotepadToClipboard, openSessionNotepad } from "./commands/sessionNotepad";
import { toggleMcpDiscovery } from "./commands/toggleDiscovery";
import { translateCursorContextInSelection } from "./commands/translateContext";
import {
  openIntelligenceRepoMemoryBank,
  openIntelligenceRepoMcpPort,
  openIntelligenceRepoRulesConverter,
} from "./commands/openIntelligenceGithubRepos";
import { migrateSkillsCursorToAgents } from "./commands/migrateSkillsCursorToAgents";
import { openIntelligenceSettings } from "./commands/openIntelligenceSettings";
import { workspaceSetupWizard } from "./commands/workspaceSetupWizard";
import { runBuildContextPackFlow } from "./intelligence/contextPackCommand";
import { showMcpSkillsAwareness } from "./intelligence/mcpSkillsAwarenessCommand";
import { registerMcpSkillsAutoScanOnWorkspaceOpen } from "./intelligence/workspaceAutoScan";
import { showIntelligenceReadiness } from "./intelligence/readinessCommand";
import * as mcpPaths from "./mcpPaths";
import { mcpAddServerNative, mcpBrowseRegistry } from "./registry/mcpInstall";
import { GuideTreeProvider } from "./tree/guideTreeProvider";
import { MCP_CMD } from "./tree/mcpTreeProvider";
import { WorkspaceKitProvider } from "./tree/workspaceKitProvider";
import {
  MCP_SKILLS_HUB_VIEW_ACTIVITY,
  MCP_SKILLS_HUB_VIEW_SECONDARY,
  McpSkillsHubViewProvider,
} from "./webview/mcpSkillsHubView";

export function activate(context: vscode.ExtensionContext): void {
  const mcpHubActivity = new McpSkillsHubViewProvider(context);
  const mcpHubSecondary = new McpSkillsHubViewProvider(context);
  const refreshMcpHubs = (): void => {
    mcpHubActivity.refresh();
    mcpHubSecondary.refresh();
  };

  const kitProvider = new WorkspaceKitProvider();
  const guideProvider = new GuideTreeProvider();

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(MCP_SKILLS_HUB_VIEW_ACTIVITY, mcpHubActivity),
    vscode.window.registerWebviewViewProvider(MCP_SKILLS_HUB_VIEW_SECONDARY, mcpHubSecondary),
    vscode.window.registerTreeDataProvider("copilotKitWorkspace", kitProvider),
    vscode.window.registerTreeDataProvider("copilotKitGuide", guideProvider)
  );

  const sub = (d: vscode.Disposable) => context.subscriptions.push(d);

  sub(
    vscode.commands.registerCommand("GitHubCopilotToolBox.refreshMcpView", () => refreshMcpHubs())
  );
  sub(
    vscode.commands.registerCommand("GitHubCopilotToolBox.refreshWorkspaceView", () =>
      kitProvider.refresh()
    )
  );

  sub(
    vscode.commands.registerCommand("GitHubCopilotToolBox.openWorkspaceMcp", async () => {
      try {
        await vscode.commands.executeCommand(MCP_CMD.openWorkspaceMcp);
      } catch {
        vscode.window.showErrorMessage(
          "Could not open workspace mcp.json. Install GitHub Copilot and use a recent VS Code."
        );
      }
    })
  );

  sub(
    vscode.commands.registerCommand("GitHubCopilotToolBox.openUserMcp", async () => {
      try {
        await vscode.commands.executeCommand(MCP_CMD.openUserMcp);
      } catch {
        vscode.window.showErrorMessage("Could not open user mcp.json.");
      }
    })
  );

  sub(
    vscode.commands.registerCommand("GitHubCopilotToolBox.mcpListServers", async () => {
      try {
        await vscode.commands.executeCommand(MCP_CMD.listServer);
      } catch {
        vscode.window.showErrorMessage("MCP: List Servers not available in this VS Code build.");
      }
    })
  );

  sub(vscode.commands.registerCommand("GitHubCopilotToolBox.mcpBrowseRegistry", mcpBrowseRegistry));
  sub(vscode.commands.registerCommand("GitHubCopilotToolBox.mcpAddServer", mcpAddServerNative));
  sub(vscode.commands.registerCommand("GitHubCopilotToolBox.portCursorMcp", portCursorMcp));
  sub(vscode.commands.registerCommand("GitHubCopilotToolBox.syncCursorRules", syncCursorRules));
  sub(vscode.commands.registerCommand("GitHubCopilotToolBox.initMemoryBank", initMemoryBank));
  sub(
    vscode.commands.registerCommand("GitHubCopilotToolBox.workspaceSetupWizard", workspaceSetupWizard)
  );
  sub(vscode.commands.registerCommand("GitHubCopilotToolBox.openCopilotChat", openCopilotChat));
  sub(
    vscode.commands.registerCommand("GitHubCopilotToolBox.toggleMcpDiscovery", toggleMcpDiscovery)
  );
  sub(
    vscode.commands.registerCommand("GitHubCopilotToolBox.openInstructionsPicker", openInstructionsPicker)
  );

  sub(vscode.commands.registerCommand("GitHubCopilotToolBox.appendCursorrules", appendCursorrules));
  sub(
    vscode.commands.registerCommand("GitHubCopilotToolBox.createCursorrulesTemplate", createCursorrulesTemplate)
  );
  sub(
    vscode.commands.registerCommand("GitHubCopilotToolBox.openCursorCopilotReference", () =>
      openCursorCopilotReference(context)
    )
  );
  sub(
    vscode.commands.registerCommand("GitHubCopilotToolBox.openInlineChatCursorStyle", openInlineChatCursorStyle)
  );
  sub(
    vscode.commands.registerCommand("GitHubCopilotToolBox.openComposerHub", () =>
      openComposerHubPanel(context)
    )
  );
  sub(vscode.commands.registerCommand("GitHubCopilotToolBox.openSessionNotepad", openSessionNotepad));
  sub(
    vscode.commands.registerCommand("GitHubCopilotToolBox.copySessionNotepad", copySessionNotepadToClipboard)
  );
  sub(vscode.commands.registerCommand("GitHubCopilotToolBox.openCopilotBillingDocs", openCopilotBillingDocs));
  sub(
    vscode.commands.registerCommand("GitHubCopilotToolBox.openEnvSyncChecklist", showEnvSyncChecklist)
  );
  sub(
    vscode.commands.registerCommand(
      "GitHubCopilotToolBox.translateContextSelection",
      translateCursorContextInSelection
    )
  );
  sub(vscode.commands.registerCommand("GitHubCopilotToolBox.buildContextPack", runBuildContextPackFlow));
  sub(
    vscode.commands.registerCommand("GitHubCopilotToolBox.showMcpSkillsAwareness", () =>
      showMcpSkillsAwareness(context)
    )
  );
  sub(
    vscode.commands.registerCommand("GitHubCopilotToolBox.showIntelligenceReadiness", showIntelligenceReadiness)
  );
  sub(
    vscode.commands.registerCommand("GitHubCopilotToolBox.openIntelligenceSettings", openIntelligenceSettings)
  );
  sub(
    vscode.commands.registerCommand("GitHubCopilotToolBox.openIntelligenceRepoMcpPort", openIntelligenceRepoMcpPort)
  );
  sub(
    vscode.commands.registerCommand(
      "GitHubCopilotToolBox.openIntelligenceRepoMemoryBank",
      openIntelligenceRepoMemoryBank
    )
  );
  sub(
    vscode.commands.registerCommand(
      "GitHubCopilotToolBox.openIntelligenceRepoRulesConverter",
      openIntelligenceRepoRulesConverter
    )
  );
  sub(
    vscode.commands.registerCommand(
      "GitHubCopilotToolBox.migrateSkillsCursorToAgents",
      migrateSkillsCursorToAgents
    )
  );

  sub(
    vscode.commands.registerCommand("GitHubCopilotToolBox.copilotToolboxConfigScan", runCopilotToolboxConfigScan)
  );
  sub(
    vscode.commands.registerCommand("GitHubCopilotToolBox.appendNotepadToMemoryBank", appendNotepadToMemoryBank)
  );
  sub(vscode.commands.registerCommand("GitHubCopilotToolBox.createSkillStub", createSkillStubCommand));
  sub(vscode.commands.registerCommand("GitHubCopilotToolBox.verificationChecklist", runVerificationChecklist));
  sub(
    vscode.commands.registerCommand("GitHubCopilotToolBox.applyBundledMcpRecipe", () =>
      applyBundledMcpRecipe(context)
    )
  );
  sub(
    vscode.commands.registerCommand("GitHubCopilotToolBox.runFirstWorkspaceTestTask", runFirstWorkspaceTestTask)
  );

  sub(
    vscode.commands.registerCommand(
      "GitHubCopilotToolBox.openKitTarget",
      async (uriStr: string, isDirectory: boolean) => {
        const uri = vscode.Uri.parse(uriStr);
        try {
          if (isDirectory) {
            await vscode.commands.executeCommand("revealInExplorer", uri);
          } else {
            await vscode.window.showTextDocument(uri);
          }
        } catch {
          await vscode.window.showTextDocument(uri);
        }
      }
    )
  );

  const folder = vscode.workspace.workspaceFolders?.[0];
  if (folder) {
    const w = vscode.workspace.createFileSystemWatcher(
      new vscode.RelativePattern(folder, ".vscode/mcp.json")
    );
    w.onDidChange(() => refreshMcpHubs());
    w.onDidCreate(() => refreshMcpHubs());
    w.onDidDelete(() => refreshMcpHubs());
    sub(w);

    const kitGlobs = [
      ".cursorrules",
      "memory-bank/**",
      ".github/copilot-instructions.md",
      ".cursor/rules/**",
    ];
    for (const g of kitGlobs) {
      const kw = vscode.workspace.createFileSystemWatcher(
        new vscode.RelativePattern(folder, g)
      );
      kw.onDidChange(() => kitProvider.refresh());
      kw.onDidCreate(() => kitProvider.refresh());
      kw.onDidDelete(() => kitProvider.refresh());
      sub(kw);
    }
  }

  const cfg = vscode.workspace.getConfiguration();
  const userMcp = vscode.Uri.file(
    mcpPaths.userMcpJsonPath(cfg.get<boolean>("GitHubCopilotToolBox.useInsidersPaths") === true)
  );
  sub(
    vscode.workspace.onDidSaveTextDocument((doc) => {
      if (doc.uri.fsPath === userMcp.fsPath) {
        refreshMcpHubs();
      }
    })
  );

  sub(
    vscode.workspace.onDidChangeConfiguration((e) => {
      if (e.affectsConfiguration("GitHubCopilotToolBox.useInsidersPaths")) {
        refreshMcpHubs();
      }
      if (e.affectsConfiguration("GitHubCopilotToolBox.intelligence.autoScanMcpSkillsOnWorkspaceOpen")) {
        refreshMcpHubs();
      }
    })
  );

  registerMcpSkillsAutoScanOnWorkspaceOpen(context, async () => {
    await showMcpSkillsAwareness(context, { silentNotification: true });
    refreshMcpHubs();
  });
}

export function deactivate(): void {}
