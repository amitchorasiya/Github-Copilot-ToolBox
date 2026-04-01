package com.amitchorasiya.github.copilot.toolbox.intellij.settings

/**
 * Mirrors VS Code `copilot-toolbox.oneClickSetup.*`. Stored under `oneClickSetup` in
 * `.github/copilot-toolbox-settings.json`.
 */
data class OneClickSetupModel(
    var runCursorToCopilotTrack: Boolean = true,
    var runClaudeCodeToCopilotTrack: Boolean = true,
    /** `off` | `workspace` | `user` | `both` */
    var migrateSkillsTarget: String = "off",
    /** `copy` | `move` */
    var migrateSkillsMode: String = "copy",
    /** `apply` | `dryRun` | `off` */
    var syncCursorRulesMode: String = "apply",
    var appendCursorrules: Boolean = true,
    /** `user` | `workspaceMerge` | `dry` | `skip` */
    var portCursorMcp: String = "user",
    var mergeClaudeMdIntoCopilotInstructions: Boolean = true,
    /** `off` | `workspace` | `user` | `both` */
    var migrateClaudeSkillsTarget: String = "workspace",
    var migrateClaudeSkillsMode: String = "copy",
    /** `user` | `workspaceMerge` | `dry` | `skip` */
    var portClaudeProjectMcp: String = "user",
    var copilotMcpReminderAfterOneClick: Boolean = true,
    /** `apply` | `dryRun` | `off` */
    var initMemoryBankMode: String = "apply",
    var initMemoryBankCursorRules: Boolean = true,
    /** `enableAutoScan` | `mergeCopilotInstructionsOnce` | `leaveUnchanged` */
    var instructionMergeAfterOneClick: String = "enableAutoScan",
    var runAwarenessScan: Boolean = true,
    var runReadiness: Boolean = true,
    var runConfigScan: Boolean = true,
    var runFirstTestTask: Boolean = false,
)
