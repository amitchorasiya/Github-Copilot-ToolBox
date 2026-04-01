package com.amitchorasiya.github.copilot.toolbox.intellij.parity

import com.intellij.openapi.fileEditor.FileEditorManager
import com.intellij.openapi.project.Project
import com.intellij.openapi.vfs.LocalFileSystem
import java.nio.charset.StandardCharsets
import java.nio.file.Files
import java.nio.file.Path

/** Mirrors VS Code mergeClaudeMdIntoCopilotInstructions. */
object MergeClaudeMdIntoCopilotInstructionsIntellij {

    fun mergeSilent(project: Project): Boolean {
        val base = project.basePath ?: return false
        val root = Path.of(base)
        val claude = root.resolve("CLAUDE.md")
        if (!Files.isRegularFile(claude)) return false
        val mainText = try {
            Files.readString(claude, StandardCharsets.UTF_8).trim()
        } catch (_: Exception) {
            return false
        }
        if (mainText.isEmpty()) return false
        val localPath = root.resolve("CLAUDE.local.md")
        val localText = if (Files.isRegularFile(localPath)) {
            try {
                Files.readString(localPath, StandardCharsets.UTF_8).trim().ifEmpty { null }
            } catch (_: Exception) {
                null
            }
        } else {
            null
        }
        val block = CopilotInstructionsMerge.buildClaudeMdMigrationBlock(mainText, localText)
        val target = root.resolve(".github").resolve("copilot-instructions.md")
        Files.createDirectories(target.parent)
        val existing = if (Files.isRegularFile(target)) {
            Files.readString(target, StandardCharsets.UTF_8)
        } else {
            ""
        }
        val next = CopilotInstructionsMerge.mergeClaudeMdBlockIntoInstructions(existing, block)
        Files.writeString(target, next, StandardCharsets.UTF_8)
        return true
    }

    fun run(project: Project) {
        val base = project.basePath ?: return
        val root = Path.of(base)
        val claude = root.resolve("CLAUDE.md")
        if (!Files.isRegularFile(claude)) {
            notify(project, "CLAUDE.md not found at workspace root.", com.intellij.notification.NotificationType.WARNING)
            return
        }
        val mainText = try {
            Files.readString(claude, StandardCharsets.UTF_8).trim()
        } catch (_: Exception) {
            notify(project, "Could not read CLAUDE.md.", com.intellij.notification.NotificationType.WARNING)
            return
        }
        if (mainText.isEmpty()) {
            notify(project, "CLAUDE.md is empty.", com.intellij.notification.NotificationType.INFORMATION)
            return
        }
        val localPath = root.resolve("CLAUDE.local.md")
        val localText = if (Files.isRegularFile(localPath)) {
            try {
                Files.readString(localPath, StandardCharsets.UTF_8).trim().ifEmpty { null }
            } catch (_: Exception) {
                null
            }
        } else {
            null
        }
        val block = CopilotInstructionsMerge.buildClaudeMdMigrationBlock(mainText, localText)
        val target = root.resolve(".github").resolve("copilot-instructions.md")
        Files.createDirectories(target.parent)
        val existing = if (Files.isRegularFile(target)) {
            Files.readString(target, StandardCharsets.UTF_8)
        } else {
            ""
        }
        val next = CopilotInstructionsMerge.mergeClaudeMdBlockIntoInstructions(existing, block)
        Files.writeString(target, next, StandardCharsets.UTF_8)
        val vf = LocalFileSystem.getInstance().refreshAndFindFileByIoFile(target.toFile()) ?: return
        FileEditorManager.getInstance(project).openFile(vf, true)
        notify(project, "Merged CLAUDE.md into .github/copilot-instructions.md.", com.intellij.notification.NotificationType.INFORMATION)
    }

    private fun notify(project: Project, text: String, type: com.intellij.notification.NotificationType) {
        com.intellij.notification.Notifications.Bus.notify(
            com.intellij.notification.Notification("GitHubCopilotToolBox", "Github Copilot ToolBox", text, type),
            project,
        )
    }
}
