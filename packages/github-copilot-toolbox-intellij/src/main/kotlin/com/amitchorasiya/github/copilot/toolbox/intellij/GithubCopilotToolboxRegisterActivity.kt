package com.amitchorasiya.github.copilot.toolbox.intellij

import com.amitchorasiya.github.copilot.toolbox.intellij.hub.VsCodeHubCommandRegistry
import com.intellij.openapi.project.Project
import com.intellij.openapi.startup.ProjectActivity

/** Registers VS Code–shaped command ids once; first project open triggers registration. */
class GithubCopilotToolboxRegisterActivity : ProjectActivity {

    override suspend fun execute(project: Project) {
        VsCodeHubCommandRegistry.ensureRegistered()
    }
}
