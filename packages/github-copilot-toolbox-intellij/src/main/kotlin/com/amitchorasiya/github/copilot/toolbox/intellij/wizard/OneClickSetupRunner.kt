package com.amitchorasiya.github.copilot.toolbox.intellij.wizard

import com.amitchorasiya.github.copilot.toolbox.intellij.cli.BundledBridgeCli
import com.amitchorasiya.github.copilot.toolbox.intellij.cli.ToolboxNodeRunner
import com.amitchorasiya.github.copilot.toolbox.intellij.hub.GithubCopilotHubBridge
import com.amitchorasiya.github.copilot.toolbox.intellij.hub.HubFileOpener
import com.amitchorasiya.github.copilot.toolbox.intellij.intelligence.McpSkillsAwarenessIntellij
import com.amitchorasiya.github.copilot.toolbox.intellij.intelligence.ReadinessIntellij
import com.amitchorasiya.github.copilot.toolbox.intellij.parity.ClaudeToolboxConfigScanIntellij
import com.amitchorasiya.github.copilot.toolbox.intellij.parity.AppendCursorrulesIntellij
import com.amitchorasiya.github.copilot.toolbox.intellij.parity.MergeClaudeMdIntoCopilotInstructionsIntellij
import com.amitchorasiya.github.copilot.toolbox.intellij.parity.PortClaudeProjectMcpIntellij
import com.amitchorasiya.github.copilot.toolbox.intellij.parity.RunFirstTestTaskIntellij
import com.amitchorasiya.github.copilot.toolbox.intellij.settings.OneClickSetupModel
import com.amitchorasiya.github.copilot.toolbox.intellij.settings.ToolboxSettings
import com.amitchorasiya.github.copilot.toolbox.intellij.skills.MigrateSkillMode
import com.amitchorasiya.github.copilot.toolbox.intellij.skills.SkillsCursorToAgentsMigration
import com.intellij.notification.Notification
import com.intellij.notification.NotificationAction
import com.intellij.notification.NotificationType
import com.intellij.notification.Notifications
import com.intellij.openapi.actionSystem.AnActionEvent
import com.intellij.openapi.project.Project
import java.nio.file.Paths

/**
 * Executes One Click Setup in the same order as
 * [packages/github-copilot-toolbox/src/commands/oneClickSetup.ts].
 */
object OneClickSetupRunner {

    fun run(project: Project, model: OneClickSetupModel) {
        val basePath = project.basePath ?: run {
            notify(project, "Open a workspace folder first.", NotificationType.WARNING)
            return
        }
        val base = Paths.get(basePath)
        val home = Paths.get(System.getProperty("user.home"))
        var settings = ToolboxSettings(base)
        val bridge = project.getService(GithubCopilotHubBridge::class.java)
        val notes = mutableListOf<String>()

        settings.setOneClickSetup(model)

        try {
            // --- Cursor → Copilot ---
            val migrateCursorSkills = model.runCursorToCopilotTrack && model.migrateSkillsTarget != "off"
            if (migrateCursorSkills) {
                val mode = if (model.migrateSkillsMode == "move") MigrateSkillMode.MOVE else MigrateSkillMode.COPY
                when (model.migrateSkillsTarget) {
                    "workspace" -> {
                        val r = SkillsCursorToAgentsMigration.runForRoot(base, mode)
                        if (r.errors > 0) notes.add("[Cursor] skills: ${r.errors} error(s) under ${r.skillsSourcePath}")
                    }
                    "user" -> {
                        val r = SkillsCursorToAgentsMigration.runForRoot(home, mode)
                        if (r.errors > 0) notes.add("[Cursor] skills: ${r.errors} error(s) under ${r.skillsSourcePath}")
                    }
                    "both" -> {
                        val r1 = SkillsCursorToAgentsMigration.runForRoot(base, mode)
                        val r2 = SkillsCursorToAgentsMigration.runForRoot(home, mode)
                        if (r1.errors > 0) notes.add("[Cursor] skills: ${r1.errors} error(s) under ${r1.skillsSourcePath}")
                        if (r2.errors > 0) notes.add("[Cursor] skills: ${r2.errors} error(s) under ${r2.skillsSourcePath}")
                    }
                }
                bridge.refreshHub()
            }

            val syncRules = model.runCursorToCopilotTrack && model.syncCursorRulesMode != "off"
            if (syncRules) {
                val args = mutableListOf("--cwd", base.toString())
                if (model.syncCursorRulesMode == "dryRun") {
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
                err?.let { notes.add("[Cursor] rules: $it") }
                bridge.refreshHub()
            }

            if (model.runCursorToCopilotTrack && model.appendCursorrules) {
                if (!AppendCursorrulesIntellij.mergeSilent(project)) {
                    /* no .cursorrules — skip quietly */
                }
            }

            if (model.runCursorToCopilotTrack) {
                val portArgs = portCursorMcpArgs(settings, model.portCursorMcp)
                if (portArgs != null) {
                    val err = ToolboxNodeRunner.runBundledToolboxBridge(
                        project,
                        base,
                        BundledBridgeCli.CURSOR_MCP_PORT,
                        portArgs,
                        "Cursor MCP port",
                        settings,
                    )
                    err?.let { notes.add("[Cursor] MCP port: $it") }
                    bridge.refreshHub()
                }
            }

            // --- Claude Code → Copilot ---
            if (model.runClaudeCodeToCopilotTrack && model.mergeClaudeMdIntoCopilotInstructions) {
                if (!MergeClaudeMdIntoCopilotInstructionsIntellij.mergeSilent(project)) {
                    notes.add("[Claude] skip: CLAUDE.md missing or empty (no merge into copilot-instructions.md)")
                }
            }

            val migrateClaudeSkills =
                model.runClaudeCodeToCopilotTrack && model.migrateClaudeSkillsTarget != "off"
            if (migrateClaudeSkills) {
                val mode = if (model.migrateClaudeSkillsMode == "move") MigrateSkillMode.MOVE else MigrateSkillMode.COPY
                when (model.migrateClaudeSkillsTarget) {
                    "workspace" -> {
                        val r = SkillsCursorToAgentsMigration.runForClaudeSkillsRoot(base, mode)
                        if (r.errors > 0) notes.add("[Claude] skills: ${r.errors} error(s) under ${r.skillsSourcePath}")
                    }
                    "user" -> {
                        val r = SkillsCursorToAgentsMigration.runForClaudeSkillsRoot(home, mode)
                        if (r.errors > 0) notes.add("[Claude] skills: ${r.errors} error(s) under ${r.skillsSourcePath}")
                    }
                    "both" -> {
                        val r1 = SkillsCursorToAgentsMigration.runForClaudeSkillsRoot(base, mode)
                        val r2 = SkillsCursorToAgentsMigration.runForClaudeSkillsRoot(home, mode)
                        if (r1.errors > 0) notes.add("[Claude] skills: ${r1.errors} error(s) under ${r1.skillsSourcePath}")
                        if (r2.errors > 0) notes.add("[Claude] skills: ${r2.errors} error(s) under ${r2.skillsSourcePath}")
                    }
                }
                bridge.refreshHub()
            }

            if (model.runClaudeCodeToCopilotTrack) {
                when (model.portClaudeProjectMcp) {
                    "skip" -> {}
                    "dry" -> PortClaudeProjectMcpIntellij.dryRunNote(base)?.let { notes.add(it) }
                    else -> {
                        val err = PortClaudeProjectMcpIntellij.runSilent(project, base, settings, model.portClaudeProjectMcp)
                        err?.let { notes.add("[Claude] .mcp.json port: $it") }
                    }
                }
                bridge.refreshHub()
            }

            // --- Shared: memory bank ---
            val initMb = model.initMemoryBankMode != "off"
            if (initMb) {
                val args = mutableListOf("init", "--cwd", base.toString())
                when (model.initMemoryBankMode) {
                    "dryRun" -> args.add("--dry-run")
                }
                if (model.runCursorToCopilotTrack && model.initMemoryBankCursorRules) {
                    args.add("--cursor-rules")
                }
                val err = ToolboxNodeRunner.runBundledToolboxBridge(
                    project,
                    base,
                    BundledBridgeCli.GITHUB_COPILOT_MEMORY_BANK,
                    args,
                    "Memory bank init",
                    settings,
                )
                err?.let { notes.add("Memory bank: $it") }
                bridge.refreshHub()
            }

            if (model.instructionMergeAfterOneClick == "enableAutoScan") {
                settings.setAutoScanMcpSkills(true)
            }
            settings = ToolboxSettings(base)

            if (model.runAwarenessScan) {
                val forceOnce = model.instructionMergeAfterOneClick == "mergeCopilotInstructionsOnce"
                val shouldMerge = settings.getAutoScanMcpSkills() || forceOnce
                McpSkillsAwarenessIntellij.runScan(
                    project,
                    mergeIntoCopilotInstructions = shouldMerge,
                    openAwarenessInEditor = false,
                )
            }

            if (model.runReadiness) {
                ReadinessIntellij.runAndOpenReport(project)
            }

            if (model.runConfigScan) {
                ClaudeToolboxConfigScanIntellij.run(project, settings)
            }

            if (model.runFirstTestTask) {
                RunFirstTestTaskIntellij.run(project, base)
            }

            bridge.refreshHub()

            if (model.runClaudeCodeToCopilotTrack && model.copilotMcpReminderAfterOneClick) {
                val n = Notification(
                    "GitHubCopilotToolBox",
                    "Github Copilot ToolBox",
                    "VS Code `mcp.json` is for the editor; Copilot in the IDE uses its own MCP settings. Align servers where you use them.",
                    NotificationType.INFORMATION,
                )
                n.addAction(object : NotificationAction("Open user mcp.json") {
                    override fun actionPerformed(e: AnActionEvent, notification: Notification) {
                        HubFileOpener.openUserMcp(project)
                    }
                })
                Notifications.Bus.notify(n, project)
            }

            val msg = if (notes.isNotEmpty()) {
                "One Click Setup finished. Notes: ${notes.joinToString(" · ")}"
            } else {
                "One Click Setup finished. Review Run tool windows, opened scans, and .github/copilot-instructions.md."
            }
            notify(project, msg, NotificationType.INFORMATION)
        } catch (e: Exception) {
            notify(project, "One Click Setup failed: ${e.message}", NotificationType.ERROR)
        }
    }

    private fun portCursorMcpArgs(settings: ToolboxSettings, mode: String): List<String>? =
        when (mode) {
            "skip" -> null
            "dry" -> listOf("--dry-run")
            "user" -> listOf("-t", if (settings.getUseInsidersPaths()) "insiders" else "user", "--force")
            "workspaceOverwrite" -> listOf("--merge", "--force")
            "workspaceMerge" -> listOf("--merge", "--force")
            else -> listOf("-t", if (settings.getUseInsidersPaths()) "insiders" else "user", "--force")
        }

    private fun notify(project: Project, text: String, type: NotificationType) {
        Notifications.Bus.notify(Notification("GitHubCopilotToolBox", "Github Copilot ToolBox", text, type), project)
    }
}
