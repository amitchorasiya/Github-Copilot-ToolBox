import * as vscode from "vscode";
import { appendCursorrules } from "./commands/migrateCursorrules";
import { mergeClaudeMdCommand } from "./commands/mergeClaudeMdIntoCopilotInstructions";
import { createCursorrulesTemplate } from "./commands/createCursorrulesTemplate";
import { openComposerHubPanel } from "./commands/composerPanel";
import { showEnvSyncChecklist } from "./commands/envSyncChecklist";
import { openInlineChatCursorStyle } from "./commands/inlineChatProxy";
import { initMemoryBank } from "./commands/memoryBankInit";
import { openCopilotBillingDocs } from "./commands/openPruDocs";
import { openCursorCopilotReference } from "./commands/openReference";
import { openCopilotChat } from "./commands/openCopilot";
import { openInstructionsPicker } from "./commands/openInstructionsPicker";
import {
  cursorRulesToCopilotWithoutNpx,
  manualPortCursorMcpWithoutNpx,
  memoryBankWithoutNpx,
  revealSkillFoldersWithoutNpx,
} from "./commands/bridgeWithoutNpx";
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
  openIntelligenceToolboxRepos,
} from "./commands/openIntelligenceGithubRepos";
import { migrateSkillsCursorToAgents } from "./commands/migrateSkillsCursorToAgents";
import { migrateSkillsClaudeToAgents } from "./commands/migrateSkillsClaudeToAgents";
import { portClaudeProjectMcpCommand } from "./commands/portClaudeProjectMcpCommand";
import { openIntelligenceSettings } from "./commands/openIntelligenceSettings";
import { openThinkingMachineModeSettings } from "./commands/openThinkingMachineModeSettings";
import { openOneClickSetupSettings, runOneClickSetup } from "./commands/oneClickSetup";
import {
  enableClaudeCopilotChatAgent,
  showClaudeCopilotAgentPrerequisites,
} from "./commands/claudeCopilotAgentSettings";
import { enableCopilotCli, openCopilotCliChatSessionCommand } from "./commands/enableCopilotCli";
import { registerAwesomeCopilotMarketplace } from "./commands/registerAwesomeCopilotMarketplace";
import { copyAwesomeCopilotChatPrompt } from "./commands/awesomeCopilotPrompt";
import { workspaceSetupWizard } from "./commands/workspaceSetupWizard";
import { runBuildContextPackFlow } from "./intelligence/contextPackCommand";
import { showMcpSkillsAwareness } from "./intelligence/mcpSkillsAwarenessCommand";
import { registerMcpSkillsAutoScanOnWorkspaceOpen } from "./intelligence/workspaceAutoScan";
import { showIntelligenceReadiness } from "./intelligence/readinessCommand";
import { runThinkingMachinePriming } from "./intelligence/thinkingMachineModeCommand";
import {
  maybeShowAutoScanDefaultMigrationToast,
  registerThinkingMachineModeActivation,
  thinkingMachineModeActivationStartupCheck,
} from "./intelligence/thinkingMachineModeActivation";
import * as mcpPaths from "./mcpPaths";
import { mcpAddServerNative, mcpBrowseRegistry } from "./registry/mcpInstall";
import { MCP_CMD } from "./tree/mcpTreeProvider";
import { WorkspaceKitProvider } from "./tree/workspaceKitProvider";
import {
  MCP_SKILLS_HUB_VIEW_ACTIVITY,
  MCP_SKILLS_HUB_VIEW_SECONDARY,
  McpSkillsHubViewProvider,
} from "./webview/mcpSkillsHubView";
import { migrateOneClickSetupToNewKeys } from "./oneClickSetupSettingsMigrate";
import { affectsToolboxSetting, migrateLegacyToolboxSettings } from "./toolboxSettings";

export async function activate(context: vscode.ExtensionContext): Promise<void> {
  try {
    await migrateLegacyToolboxSettings();
  } catch (e) {
    console.error("[GitHub Copilot Toolbox] migrateLegacyToolboxSettings failed", e);
  }
  try {
    await migrateOneClickSetupToNewKeys();
  } catch (e) {
    console.error("[GitHub Copilot Toolbox] migrateOneClickSetupToNewKeys failed", e);
  }
  void thinkingMachineModeActivationStartupCheck(context);
  void maybeShowAutoScanDefaultMigrationToast(context);
  const mcpHubActivity = new McpSkillsHubViewProvider(context);
  const mcpHubSecondary = new McpSkillsHubViewProvider(context);
  const refreshMcpHubs = (): void => {
    mcpHubActivity.refresh();
    mcpHubSecondary.refresh();
  };

  const kitProvider = new WorkspaceKitProvider();

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(MCP_SKILLS_HUB_VIEW_ACTIVITY, mcpHubActivity),
    vscode.window.registerWebviewViewProvider(MCP_SKILLS_HUB_VIEW_SECONDARY, mcpHubSecondary),
    vscode.window.registerTreeDataProvider("copilotKitWorkspace", kitProvider)
  );

  const sub = (d: vscode.Disposable) => context.subscriptions.push(d);

  sub(registerThinkingMachineModeActivation(context));

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
  sub(
    vscode.commands.registerCommand(
      "GitHubCopilotToolBox.manualPortCursorMcpWithoutNpx",
      manualPortCursorMcpWithoutNpx
    )
  );
  sub(vscode.commands.registerCommand("GitHubCopilotToolBox.syncCursorRules", syncCursorRules));
  sub(
    vscode.commands.registerCommand(
      "GitHubCopilotToolBox.cursorRulesToCopilotWithoutNpx",
      cursorRulesToCopilotWithoutNpx
    )
  );
  sub(vscode.commands.registerCommand("GitHubCopilotToolBox.initMemoryBank", initMemoryBank));
  sub(vscode.commands.registerCommand("GitHubCopilotToolBox.memoryBankWithoutNpx", memoryBankWithoutNpx));
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
    vscode.commands.registerCommand(
      "GitHubCopilotToolBox.mergeClaudeMdIntoCopilotInstructions",
      mergeClaudeMdCommand
    )
  );
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
    vscode.commands.registerCommand("GitHubCopilotToolBox.runThinkingMachinePriming", () =>
      void runThinkingMachinePriming(context)
    )
  );
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
    vscode.commands.registerCommand(
      "GitHubCopilotToolBox.openThinkingMachineModeSettings",
      openThinkingMachineModeSettings
    )
  );
  sub(
    vscode.commands.registerCommand("GitHubCopilotToolBox.openOneClickSetupSettings", openOneClickSetupSettings)
  );
  sub(
    vscode.commands.registerCommand("GitHubCopilotToolBox.enableClaudeCopilotChatAgent", () => {
      void enableClaudeCopilotChatAgent({ silent: false });
    })
  );
  sub(
    vscode.commands.registerCommand(
      "GitHubCopilotToolBox.showClaudeCopilotAgentPrerequisites",
      showClaudeCopilotAgentPrerequisites
    )
  );
  sub(vscode.commands.registerCommand("GitHubCopilotToolBox.enableCopilotCli", () => void enableCopilotCli()));
  sub(
    vscode.commands.registerCommand(
      "GitHubCopilotToolBox.registerAwesomeCopilotMarketplace",
      () => void registerAwesomeCopilotMarketplace()
    )
  );
  sub(
    vscode.commands.registerCommand("GitHubCopilotToolBox.copyAwesomeCopilotChatPrompt", () =>
      void copyAwesomeCopilotChatPrompt()
    )
  );
  sub(
    vscode.commands.registerCommand("GitHubCopilotToolBox.openCopilotCliChatSession", () =>
      void openCopilotCliChatSessionCommand()
    )
  );
  sub(
    vscode.commands.registerCommand("GitHubCopilotToolBox.runOneClickSetup", () =>
      runOneClickSetup(context, refreshMcpHubs)
    )
  );
  sub(
    vscode.commands.registerCommand("GitHubCopilotToolBox.openIntelligenceToolboxRepos", (...args: unknown[]) => {
      const pref = typeof args[0] === "string" ? args[0] : undefined;
      void openIntelligenceToolboxRepos(pref);
    })
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
    vscode.commands.registerCommand(
      "GitHubCopilotToolBox.migrateSkillsClaudeToAgents",
      migrateSkillsClaudeToAgents
    )
  );
  sub(
    vscode.commands.registerCommand("GitHubCopilotToolBox.portClaudeProjectMcp", portClaudeProjectMcpCommand)
  );
  sub(
    vscode.commands.registerCommand(
      "GitHubCopilotToolBox.revealSkillFoldersWithoutNpx",
      revealSkillFoldersWithoutNpx
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
    mcpPaths.userMcpJsonPath(cfg.get<boolean>("copilot-toolbox.useInsidersPaths") === true)
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
      if (affectsToolboxSetting(e, "useInsidersPaths")) {
        refreshMcpHubs();
      }
      if (affectsToolboxSetting(e, "intelligence.autoScanMcpSkillsOnWorkspaceOpen")) {
        refreshMcpHubs();
      }
      if (affectsToolboxSetting(e, "thinkingMachineMode.enabled")) {
        refreshMcpHubs();
      }
      if (
        affectsToolboxSetting(e, "oneClickSetup.runCursorToCopilotTrack") ||
        affectsToolboxSetting(e, "oneClickSetup.runClaudeCodeToCopilotTrack")
      ) {
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
