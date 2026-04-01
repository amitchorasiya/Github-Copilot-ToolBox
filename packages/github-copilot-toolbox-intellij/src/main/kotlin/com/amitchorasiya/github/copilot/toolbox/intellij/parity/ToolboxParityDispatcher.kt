package com.amitchorasiya.github.copilot.toolbox.intellij.parity

import com.amitchorasiya.github.copilot.toolbox.intellij.cli.BundledBridgeCli
import com.amitchorasiya.github.copilot.toolbox.intellij.cli.ToolboxNodeRunner
import com.amitchorasiya.github.copilot.toolbox.intellij.hub.GithubCopilotHubBridge
import com.amitchorasiya.github.copilot.toolbox.intellij.hub.HubFileOpener
import com.amitchorasiya.github.copilot.toolbox.intellij.intelligence.ComposerHubIntellij
import com.amitchorasiya.github.copilot.toolbox.intellij.intelligence.ContextPackIntellij
import com.amitchorasiya.github.copilot.toolbox.intellij.intelligence.McpSkillsAwarenessIntellij
import com.amitchorasiya.github.copilot.toolbox.intellij.intelligence.ReadinessIntellij
import com.amitchorasiya.github.copilot.toolbox.intellij.intelligence.SessionNotepadIntellij
import com.amitchorasiya.github.copilot.toolbox.intellij.settings.ToolboxSettings
import com.amitchorasiya.github.copilot.toolbox.intellij.settings.ToolboxSettingsConfigurable
import com.amitchorasiya.github.copilot.toolbox.intellij.ui.ToolboxDialogUi
import com.amitchorasiya.github.copilot.toolbox.intellij.skills.MigrateSkillMode
import com.amitchorasiya.github.copilot.toolbox.intellij.skills.ScopeRun
import com.amitchorasiya.github.copilot.toolbox.intellij.skills.SkillsCursorToAgentsMigration
import com.amitchorasiya.github.copilot.toolbox.intellij.vscode.VscodeWorkspaceSettingsJson
import com.amitchorasiya.github.copilot.toolbox.intellij.wizard.OneClickSetupWizardDialog
import com.intellij.ide.BrowserUtil
import com.intellij.notification.Notification
import com.intellij.notification.NotificationType
import com.intellij.notification.Notifications
import com.intellij.openapi.fileEditor.FileEditorManager
import com.intellij.openapi.options.ShowSettingsUtil
import com.intellij.openapi.project.Project
import com.intellij.openapi.ui.Messages
import com.intellij.openapi.vfs.LocalFileSystem
import java.nio.file.Files
import java.nio.file.Path
import java.nio.file.Paths

/**
 * Routes every `GitHubCopilotToolBox.*` command to the closest VS Code behavior:
 * Run-tool-window `npx` where the extension uses terminals, IDE file/URL actions elsewhere,
 * and clear notices when a flow depends on VS Code–only APIs.
 */
object ToolboxParityDispatcher {

    private const val REGISTRY_URL = "https://registry.modelcontextprotocol.io"
    private const val REPO_ROOT = "https://github.com/amitchorasiya/Github-Copilot-ToolBox"

    fun dispatch(project: Project, commandId: String) {
        val basePath = project.basePath
        val base = basePath?.let { Paths.get(it) }
        val settings = ToolboxSettings(base)
        val bridge = project.getService(GithubCopilotHubBridge::class.java)

        when (commandId) {
            "GitHubCopilotToolBox.refreshMcpView", "GitHubCopilotToolBox.refreshWorkspaceView" -> bridge.refreshHub()

            "GitHubCopilotToolBox.openWorkspaceMcp" -> HubFileOpener.openWorkspaceMcp(project)
            "GitHubCopilotToolBox.openUserMcp" -> HubFileOpener.openUserMcp(project)
            "GitHubCopilotToolBox.openThinkingMachineModeSettings",
            "GitHubCopilotToolBox.openIntelligenceSettings",
            "GitHubCopilotToolBox.openOneClickSetupSettings",
            -> ShowSettingsUtil.getInstance().showSettingsDialog(project, ToolboxSettingsConfigurable::class.java, null)

            "GitHubCopilotToolBox.mcpBrowseRegistry" -> BrowserUtil.browse(REGISTRY_URL)
            "GitHubCopilotToolBox.mcpListServers" -> McpServersUiIntellij.listServers(project)
            "GitHubCopilotToolBox.mcpAddServer" -> McpServersUiIntellij.addServer(project, settings)

            "GitHubCopilotToolBox.portCursorMcp" -> portCursorMcp(project, base, settings)
            "GitHubCopilotToolBox.manualPortCursorMcpWithoutNpx" -> portCursorMcp(project, base, settings)

            "GitHubCopilotToolBox.syncCursorRules" -> syncCursorRules(project, base, settings)
            "GitHubCopilotToolBox.cursorRulesToCopilotWithoutNpx" -> syncCursorRules(project, base, settings)

            "GitHubCopilotToolBox.initMemoryBank" -> initMemoryBankInteractive(project, base, settings)
            "GitHubCopilotToolBox.memoryBankWithoutNpx" -> initMemoryBankInteractive(project, base, settings)

            "GitHubCopilotToolBox.toggleMcpDiscovery" -> toggleMcpDiscovery(project, base)

            "GitHubCopilotToolBox.openIntelligenceToolboxRepos" -> pickIntelligenceRepo(project)
            "GitHubCopilotToolBox.openIntelligenceRepoMcpPort" -> BrowserUtil.browse("https://github.com/amitchorasiya/Github-Copilot-ToolBox")
            "GitHubCopilotToolBox.openIntelligenceRepoMemoryBank" -> BrowserUtil.browse("https://github.com/amitchorasiya/Github-Copilot-Memory-Bank")
            "GitHubCopilotToolBox.openIntelligenceRepoRulesConverter" -> BrowserUtil.browse(
                "https://github.com/amitchorasiya/Github-Copilot-Cursor-Rules-Converter",
            )

            "GitHubCopilotToolBox.migrateSkillsCursorToAgents" -> migrateCursorSkills(project, base, bridge)
            "GitHubCopilotToolBox.migrateSkillsClaudeToAgents" -> migrateClaudeSkills(project, base, bridge)

            "GitHubCopilotToolBox.portClaudeProjectMcp" -> {
                if (base == null) {
                    notify(project, "Open a workspace folder first.", NotificationType.WARNING)
                } else {
                    PortClaudeProjectMcpIntellij.runInteractive(project, settings)
                }
            }

            "GitHubCopilotToolBox.revealSkillFoldersWithoutNpx" -> {
                revealIfExists(project, base, ".cursor/skills")
                revealIfExists(project, base, ".claude/skills")
                revealIfExists(project, base, ".agents/skills")
            }

            "GitHubCopilotToolBox.enableClaudeCopilotChatAgent",
            "GitHubCopilotToolBox.showClaudeCopilotAgentPrerequisites",
            "GitHubCopilotToolBox.enableCopilotCli",
            "GitHubCopilotToolBox.registerAwesomeCopilotMarketplace",
            "GitHubCopilotToolBox.copyAwesomeCopilotChatPrompt",
            "GitHubCopilotToolBox.openCopilotCliChatSession",
            -> vscodeOnlyPanel(
                project,
                "This flow toggles VS Code / Copilot CLI settings. Use the Github Copilot ToolBox extension in VS Code, or apply the same settings manually in your environment.",
            )

            "GitHubCopilotToolBox.createCursorrulesTemplate" -> createCursorrulesTemplate(project, base)

            "GitHubCopilotToolBox.workspaceSetupWizard", "GitHubCopilotToolBox.runOneClickSetup" -> {
                if (project.basePath == null) {
                    notify(project, "Open a workspace folder first.", NotificationType.WARNING)
                } else {
                    OneClickSetupWizardDialog(project).show()
                }
            }

            "GitHubCopilotToolBox.openCopilotChat" ->
                notify(
                    project,
                    "Open GitHub Copilot Chat from the IDE (Tools or status bar). Full chat API parity lives in VS Code.",
                    NotificationType.INFORMATION,
                )

            "GitHubCopilotToolBox.openCursorCopilotReference" -> BrowserUtil.browse("$REPO_ROOT/blob/main/README.md")

            "GitHubCopilotToolBox.openCopilotBillingDocs" ->
                BrowserUtil.browse("https://docs.github.com/en/billing/concepts/about-billing-for-github-copilot")

            "GitHubCopilotToolBox.openEnvSyncChecklist" ->
                BrowserUtil.browse("$REPO_ROOT/blob/main/packages/github-copilot-toolbox/README.md")

            "GitHubCopilotToolBox.openComposerHub" -> ComposerHubIntellij.show(project)
            "GitHubCopilotToolBox.openSessionNotepad" -> SessionNotepadIntellij.open(project)
            "GitHubCopilotToolBox.copySessionNotepad" -> SessionNotepadIntellij.copyToClipboard(project)

            "GitHubCopilotToolBox.buildContextPack" -> ContextPackIntellij.buildAndCopy(project)
            "GitHubCopilotToolBox.showIntelligenceReadiness" -> ReadinessIntellij.runAndOpenReport(project)
            "GitHubCopilotToolBox.showMcpSkillsAwareness" -> showMcpSkillsAwarenessInteractive(project)
            "GitHubCopilotToolBox.runThinkingMachinePriming" -> runThinkingMachinePriming(project, settings)

            "GitHubCopilotToolBox.openInlineChatCursorStyle" ->
                vscodeOnlyPanel(project, "Inline chat uses VS Code’s chat API. Use JetBrains AI Assistant or the terminal Claude Code flow.")

            "GitHubCopilotToolBox.translateContextSelection" -> TranslateContextIntellij.run(project, settings)
            "GitHubCopilotToolBox.appendNotepadToMemoryBank" -> NotepadToMemoryBankIntellij.run(project)
            "GitHubCopilotToolBox.copilotToolboxConfigScan" -> ClaudeToolboxConfigScanIntellij.run(project, settings)

            "GitHubCopilotToolBox.openInstructionsPicker" -> InstructionsPickerIntellij.open(project)
            "GitHubCopilotToolBox.appendCursorrules" -> AppendCursorrulesIntellij.run(project)
            "GitHubCopilotToolBox.mergeClaudeMdIntoCopilotInstructions" ->
                MergeClaudeMdIntoCopilotInstructionsIntellij.run(project)

            "GitHubCopilotToolBox.createSkillStub" -> SkillStubIntellij.run(project)
            "GitHubCopilotToolBox.verificationChecklist" -> VerificationChecklistIntellij.run(project)
            "GitHubCopilotToolBox.applyBundledMcpRecipe" -> BundledMcpRecipeIntellij.run(project)
            "GitHubCopilotToolBox.runFirstWorkspaceTestTask" -> RunFirstTestTaskIntellij.run(project, base)

            else -> notify(
                project,
                "Command $commandId — if something is missing, open the same workspace in VS Code or see $REPO_ROOT",
                NotificationType.INFORMATION,
            )
        }
    }

    /** Interactive palette / hub — matches VS Code non-silent scan (merge on, open report). */
    private fun showMcpSkillsAwarenessInteractive(project: Project) {
        if (project.basePath == null) {
            notify(project, "MCP & Skills awareness: open a workspace folder to save the report.", NotificationType.WARNING)
            return
        }
        McpSkillsAwarenessIntellij.runScan(project, mergeIntoCopilotInstructions = true, openAwarenessInEditor = true)
        notify(
            project,
            "MCP & Skills awareness saved to .github/copilot-toolbox-mcp-skills-awareness.md.",
            NotificationType.INFORMATION,
        )
    }

    /** Optional awareness scan (silent tab) + context pack, per Thinking Machine settings. */
    private fun runThinkingMachinePriming(project: Project, settings: ToolboxSettings) {
        if (project.basePath == null) {
            notify(project, "Open a workspace folder first.", NotificationType.WARNING)
            return
        }
        if (!settings.getThinkingMachine()) {
            notify(
                project,
                "Thinking Machine Mode is off. Enable it in Settings → Tools → Github Copilot ToolBox, then try again.",
                NotificationType.WARNING,
            )
            return
        }
        val runScan = settings.getThinkingMachineRunAwarenessScan()
        val mergeBlock = settings.getThinkingMachineMergeAwarenessIntoCopilotInstructions()
        val showPre = settings.getThinkingMachineShowConfirmationModal()
        if (showPre) {
            val ok = Messages.showYesNoDialog(
                project,
                "This may write or update files under .github/ (and copilot-instructions.md), copy a context pack to the clipboard, and refresh the hub.",
                "Run Thinking Machine priming?",
                Messages.getWarningIcon(),
            )
            if (ok != Messages.YES) {
                return
            }
        }
        if (runScan) {
            val shouldMerge = settings.getAutoScanMcpSkills() || mergeBlock
            McpSkillsAwarenessIntellij.runScan(
                project,
                mergeIntoCopilotInstructions = shouldMerge,
                openAwarenessInEditor = false,
            )
        }
        ContextPackIntellij.buildAndCopy(project)
        notify(
            project,
            "Thinking Machine priming finished. Context pack is on the clipboard — paste into Copilot Chat or your agent session.",
            NotificationType.INFORMATION,
        )
    }

    private fun portCursorMcp(project: Project, base: Path?, settings: ToolboxSettings) {
        if (base == null) {
            notify(project, "Open a workspace folder first.", NotificationType.WARNING)
            return
        }
        val opts = arrayOf(
            "Merge into existing .vscode/mcp.json",
            "User mcp.json (all workspaces)",
            "Dry run (print JSON only)",
        )
        val idx = ToolboxDialogUi.showChooseDialog(
            project,
            "Port Cursor MCP → VS Code mcp.json (bundled cursor-mcp-vscode-port)",
            "Github Copilot ToolBox",
            Messages.getQuestionIcon(),
            opts,
            opts[0],
        )
        val args = when (idx) {
            0 -> listOf("--merge", "--force")
            1 -> listOf("-t", if (settings.getUseInsidersPaths()) "insiders" else "user", "--force")
            2 -> listOf("--dry-run")
            else -> return
        }
        val err = ToolboxNodeRunner.runBundledToolboxBridge(
            project,
            base,
            BundledBridgeCli.CURSOR_MCP_PORT,
            args,
            "Cursor MCP port",
            settings,
        )
        err?.let { notify(project, it, NotificationType.WARNING) }
        project.getService(GithubCopilotHubBridge::class.java).refreshHub()
    }

    private fun syncCursorRules(project: Project, base: Path?, settings: ToolboxSettings) {
        if (base == null) {
            notify(project, "Open a workspace folder first.", NotificationType.WARNING)
            return
        }
        val dry = Messages.showYesNoDialog(
            "Use --dry-run (preview only, no file writes)?",
            "Sync Cursor rules → Copilot (.github)",
            Messages.getQuestionIcon(),
        )
        val args = mutableListOf("--cwd", base.toString())
        if (dry == Messages.YES) {
            args.add("--dry-run")
        }
        val err = ToolboxNodeRunner.runBundledToolboxBridge(
            project,
            base,
            BundledBridgeCli.CURSOR_RULES_TO_COPILOT,
            args,
            "Cursor rules → Copilot",
            settings,
        )
        err?.let { notify(project, it, NotificationType.WARNING) }
        project.getService(GithubCopilotHubBridge::class.java).refreshHub()
    }

    private fun initMemoryBankInteractive(project: Project, base: Path?, settings: ToolboxSettings) {
        if (base == null) {
            notify(project, "Open a workspace folder first.", NotificationType.WARNING)
            return
        }
        val dry = Messages.showYesNoDialog(
            "Preview only (--dry-run, no files written)?",
            "Memory bank (github-copilot-memory-bank)",
            Messages.getQuestionIcon(),
        )
        val cursorRules = Messages.showYesNoDialog(
            "Also merge .cursor/rules into prompts (--cursor-rules)?",
            "Memory bank",
            Messages.getQuestionIcon(),
        )
        val flags = mutableListOf<String>()
        if (dry == Messages.YES) flags.add("--dry-run")
        if (cursorRules == Messages.YES) flags.add("--cursor-rules")
        val args = mutableListOf("init", "--cwd", base.toString())
        args.addAll(flags)
        val err = ToolboxNodeRunner.runBundledToolboxBridge(
            project,
            base,
            BundledBridgeCli.GITHUB_COPILOT_MEMORY_BANK,
            args,
            "Memory bank init",
            settings,
        )
        err?.let { notify(project, it, NotificationType.WARNING) }
        project.getService(GithubCopilotHubBridge::class.java).refreshHub()
    }

    private fun toggleMcpDiscovery(project: Project, base: Path?) {
        if (base == null) {
            notify(project, "Open a workspace folder to write .vscode/settings.json.", NotificationType.WARNING)
            return
        }
        val err = VscodeWorkspaceSettingsJson.toggleChatMcpDiscovery(base)
        if (err != null) {
            notify(project, err, NotificationType.WARNING)
        } else {
            notify(project, "Updated chat.mcp.discovery.enabled in .vscode/settings.json", NotificationType.INFORMATION)
        }
    }

    private fun pickIntelligenceRepo(project: Project) {
        val opts = arrayOf(
            "MCP port CLI (Github-Copilot-ToolBox)",
            "Memory bank CLI",
            "Cursor rules → Copilot CLI",
        )
        val idx = ToolboxDialogUi.showChooseDialog(
            project,
            "Open a Toolbox companion repository on GitHub",
            "Github Copilot ToolBox",
            Messages.getQuestionIcon(),
            opts,
            opts[0],
        )
        when (idx) {
            0 -> BrowserUtil.browse("https://github.com/amitchorasiya/Github-Copilot-ToolBox")
            1 -> BrowserUtil.browse("https://github.com/amitchorasiya/Github-Copilot-Memory-Bank")
            2 -> BrowserUtil.browse("https://github.com/amitchorasiya/Github-Copilot-Cursor-Rules-Converter")
        }
    }

    private fun migrateCursorSkills(project: Project, base: Path?, bridge: GithubCopilotHubBridge) {
        val home = Paths.get(System.getProperty("user.home"))
        val opts = arrayOf(
            "Workspace only (.cursor/skills → .agents/skills)",
            "User only (~/.cursor/skills)",
            "Both workspace and user",
        )
        if (base == null) {
            val one = Messages.showYesNoDialog(
                "No workspace folder — migrate user ~/.cursor/skills only?",
                "Migrate skills",
                Messages.getQuestionIcon(),
            )
            if (one != Messages.YES) return
            val mode = pickCopyMove(project) ?: return
            val r = SkillsCursorToAgentsMigration.runForRoot(home, mode)
            notify(project, summary(r), NotificationType.INFORMATION)
            bridge.refreshHub()
            return
        }
        val scopeIdx = ToolboxDialogUi.showChooseDialog(
            project,
            "Migrate .cursor/skills → .agents/skills",
            "Github Copilot ToolBox",
            Messages.getQuestionIcon(),
            opts,
            opts[0],
        )
        if (scopeIdx < 0) {
            return
        }
        val mode = pickCopyMove(project) ?: return
        var totalM = 0
        var totalS = 0
        var totalE = 0
        when (scopeIdx) {
            0 -> {
                val r = SkillsCursorToAgentsMigration.runForRoot(base, mode)
                totalM += r.migrated; totalS += r.skipped; totalE += r.errors
            }
            1 -> {
                val r = SkillsCursorToAgentsMigration.runForRoot(home, mode)
                totalM += r.migrated; totalS += r.skipped; totalE += r.errors
            }
            2 -> {
                val r1 = SkillsCursorToAgentsMigration.runForRoot(base, mode)
                val r2 = SkillsCursorToAgentsMigration.runForRoot(home, mode)
                totalM += r1.migrated + r2.migrated
                totalS += r1.skipped + r2.skipped
                totalE += r1.errors + r2.errors
            }
            else -> return
        }
        notify(
            project,
            "Skills migration: migrated $totalM, skipped $totalS, errors $totalE.",
            if (totalE > 0) NotificationType.WARNING else NotificationType.INFORMATION,
        )
        bridge.refreshHub()
    }

    private fun migrateClaudeSkills(project: Project, base: Path?, bridge: GithubCopilotHubBridge) {
        val home = Paths.get(System.getProperty("user.home"))
        val opts = arrayOf(
            "Workspace only (.claude/skills → .agents/skills)",
            "User only (~/.claude/skills)",
            "Workspace + user",
        )
        if (base == null) {
            val one = Messages.showYesNoDialog(
                project,
                "No workspace folder — migrate user ~/.claude/skills only?",
                "Migrate Claude skills",
                Messages.getQuestionIcon(),
            )
            if (one != Messages.YES) return
            val mode = pickCopyMove(project) ?: return
            val r = SkillsCursorToAgentsMigration.runForClaudeSkillsRoot(home, mode)
            notify(project, summary(r), NotificationType.INFORMATION)
            bridge.refreshHub()
            return
        }
        val scopeIdx = ToolboxDialogUi.showChooseDialog(
            project,
            "Migrate .claude/skills → .agents/skills",
            "Github Copilot ToolBox",
            Messages.getQuestionIcon(),
            opts,
            opts[0],
        )
        if (scopeIdx < 0) return
        val mode = pickCopyMove(project) ?: return
        var totalM = 0
        var totalS = 0
        var totalE = 0
        when (scopeIdx) {
            0 -> {
                val r = SkillsCursorToAgentsMigration.runForClaudeSkillsRoot(base, mode)
                totalM += r.migrated; totalS += r.skipped; totalE += r.errors
            }
            1 -> {
                val r = SkillsCursorToAgentsMigration.runForClaudeSkillsRoot(home, mode)
                totalM += r.migrated; totalS += r.skipped; totalE += r.errors
            }
            2 -> {
                val r1 = SkillsCursorToAgentsMigration.runForClaudeSkillsRoot(base, mode)
                val r2 = SkillsCursorToAgentsMigration.runForClaudeSkillsRoot(home, mode)
                totalM += r1.migrated + r2.migrated
                totalS += r1.skipped + r2.skipped
                totalE += r1.errors + r2.errors
            }
            else -> return
        }
        notify(
            project,
            "Claude skills → .agents: migrated $totalM, skipped $totalS, errors $totalE.",
            if (totalE > 0) NotificationType.WARNING else NotificationType.INFORMATION,
        )
        bridge.refreshHub()
    }

    private fun pickCopyMove(project: Project): MigrateSkillMode? {
        val copy = Messages.showYesNoDialog(
            project,
            "Use move (delete from source skills folder after copy)? Choose No for copy-only.",
            "Copy or move",
            Messages.getQuestionIcon(),
        )
        return if (copy == Messages.YES) MigrateSkillMode.MOVE else MigrateSkillMode.COPY
    }

    private fun summary(r: ScopeRun): String =
        "${r.skillsSourcePath}: migrated ${r.migrated}, skipped ${r.skipped}, errors ${r.errors}"

    private fun revealIfExists(project: Project, root: Path?, rel: String) {
        if (root == null) return
        val p = root.resolve(rel)
        if (!Files.exists(p)) {
            notify(project, "Path does not exist: $p", NotificationType.INFORMATION)
            return
        }
        val vf = LocalFileSystem.getInstance().refreshAndFindFileByIoFile(p.toFile()) ?: return
        com.intellij.ide.projectView.ProjectView.getInstance(project).select(null, vf, true)
    }

    private fun createCursorrulesTemplate(project: Project, base: Path?) {
        if (base == null) {
            notify(project, "Open a workspace folder first.", NotificationType.WARNING)
            return
        }
        val p = java.nio.file.Paths.get(base.toString(), ".cursorrules")
        val stub = """# Cursor / Copilot shared hints (root rules)

- Keep answers concise.
- Match existing code style.

"""
        if (Files.exists(p)) {
            notify(project, ".cursorrules already exists — opening.", NotificationType.INFORMATION)
        } else {
            Files.writeString(p, stub)
            notify(project, "Created .cursorrules", NotificationType.INFORMATION)
        }
        val vf = LocalFileSystem.getInstance().refreshAndFindFileByIoFile(p.toFile()) ?: return
        FileEditorManager.getInstance(project).openFile(vf, true)
    }

    private fun vscodeOnlyPanel(project: Project, detail: String) {
        notify(
            project,
            "$detail Full parity: use the VS Code extension for this project, or track IntelliJ progress in the repo README.",
            NotificationType.INFORMATION,
        )
    }

    private fun notify(project: Project, text: String, type: NotificationType) {
        Notifications.Bus.notify(Notification("GitHubCopilotToolBox", "Github Copilot ToolBox", text, type), project)
    }
}
