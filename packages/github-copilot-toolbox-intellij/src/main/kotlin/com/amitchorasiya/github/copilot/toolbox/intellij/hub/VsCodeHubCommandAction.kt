package com.amitchorasiya.github.copilot.toolbox.intellij.hub

import com.amitchorasiya.github.copilot.toolbox.intellij.parity.ToolboxParityDispatcher
import com.intellij.openapi.actionSystem.AnAction
import com.intellij.openapi.actionSystem.AnActionEvent

/**
 * One action instance per VS Code `GitHubCopilotToolBox.*` command id. Registered at startup so hub `runCommand` resolves.
 */
class VsCodeHubCommandAction(private val commandId: String) : AnAction(
    commandId.removePrefix("GitHubCopilotToolBox."),
    "Github Copilot ToolBox",
    null,
) {

    override fun actionPerformed(e: AnActionEvent) {
        val project = e.project ?: return
        ToolboxParityDispatcher.dispatch(project, commandId)
    }
}
