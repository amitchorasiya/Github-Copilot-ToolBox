package com.amitchorasiya.github.copilot.toolbox.intellij.parity

import com.amitchorasiya.github.copilot.toolbox.intellij.mcp.McpJson
import com.amitchorasiya.github.copilot.toolbox.intellij.mcp.McpPaths
import com.amitchorasiya.github.copilot.toolbox.intellij.mcp.mergeMcpServerMapsIntellij
import com.amitchorasiya.github.copilot.toolbox.intellij.settings.ToolboxSettings
import com.google.gson.JsonElement
import com.google.gson.JsonObject
import com.google.gson.JsonParser
import com.intellij.notification.Notification
import com.intellij.notification.NotificationType
import com.intellij.notification.Notifications
import com.intellij.openapi.project.Project
import com.intellij.openapi.ui.Messages
import com.amitchorasiya.github.copilot.toolbox.intellij.ui.ToolboxDialogUi
import java.nio.charset.StandardCharsets
import java.nio.file.Files
import java.nio.file.Path

/** Merges workspace `.mcp.json` into VS Code user or workspace `mcp.json`. */
object PortClaudeProjectMcpIntellij {

    fun runInteractive(project: Project, settings: ToolboxSettings) {
        val base = project.basePath ?: run {
            Messages.showErrorDialog(project, "Open a workspace folder first.", "Github Copilot ToolBox")
            return
        }
        val root = Path.of(base)
        val projectFile = root.resolve(".mcp.json")
        if (!Files.isRegularFile(projectFile)) {
            Messages.showInfoMessage(project, "No .mcp.json at workspace root.", "Github Copilot ToolBox")
            return
        }
        val incoming = parseProjectServers(projectFile) ?: run {
            Messages.showWarningDialog(project, ".mcp.json has no valid mcpServers/servers.", "Github Copilot ToolBox")
            return
        }
        if (incoming.isEmpty()) {
            Messages.showInfoMessage(project, "No server entries to merge.", "Github Copilot ToolBox")
            return
        }
        val opts = arrayOf(
            "Merge into user mcp.json",
            "Merge into workspace .vscode/mcp.json",
            "Dry run (notification only)",
        )
        val idx = ToolboxDialogUi.showChooseDialog(
            project,
            "Port ${incoming.size} server id(s) from .mcp.json",
            "Github Copilot ToolBox",
            Messages.getQuestionIcon(),
            opts,
            opts[0],
        )
        when (idx) {
            0 -> mergeUser(settings, incoming, project)
            1 -> mergeWorkspace(root, incoming, project)
            2 -> notify(
                project,
                "[Dry run] Would merge: ${incoming.keys.joinToString()}",
                NotificationType.INFORMATION,
            )
        }
    }

    /** Dry-run summary for One Click (no file writes). */
    fun dryRunNote(root: Path): String? {
        val projectFile = root.resolve(".mcp.json")
        if (!Files.isRegularFile(projectFile)) return null
        val incoming = parseProjectServers(projectFile) ?: return null
        if (incoming.isEmpty()) return null
        return "[Claude] .mcp.json port (dry-run): ${incoming.size} id(s): ${incoming.keys.joinToString()}"
    }

    /** Non-interactive merge for One Click; returns an error message or null on success. */
    fun runSilent(project: Project, root: Path, settings: ToolboxSettings, mode: String): String? {
        if (mode == "skip" || mode == "dry") return null
        val projectFile = root.resolve(".mcp.json")
        if (!Files.isRegularFile(projectFile)) return null
        val incoming = parseProjectServers(projectFile) ?: return "invalid .mcp.json (mcpServers/servers)"
        if (incoming.isEmpty()) return null
        return try {
            when (mode) {
                "user" -> mergeUser(settings, incoming, project)
                "workspaceMerge", "workspaceOverwrite" -> mergeWorkspace(root, incoming, project)
                else -> mergeUser(settings, incoming, project)
            }
            null
        } catch (e: Exception) {
            e.message ?: "port .mcp.json failed"
        }
    }

    private fun parseProjectServers(projectFile: Path): MutableMap<String, JsonElement>? {
        val text = try {
            Files.readString(projectFile, StandardCharsets.UTF_8)
        } catch (_: Exception) {
            return null
        }
        val obj = try {
            JsonParser.parseString(text).asJsonObject
        } catch (_: Exception) {
            return null
        }
        val raw = obj.get("mcpServers") ?: obj.get("servers") ?: return null
        if (!raw.isJsonObject) return null
        val out = mutableMapOf<String, JsonElement>()
        for (e in raw.asJsonObject.entrySet()) {
            if (e.value.isJsonObject) {
                out[e.key] = e.value
            }
        }
        return out
    }

    private fun mergeUser(settings: ToolboxSettings, incoming: Map<String, JsonElement>, project: Project) {
        val path = settings.userMcpJsonPath()
        val existing = McpJson.readOrEmpty(path)
        val servers = McpJson.getServersObject(existing)
        val incObj = JsonObject()
        for ((id, v) in incoming) {
            incObj.add(id, v)
        }
        val merged = mergeMcpServerMapsIntellij(servers, incObj)
        existing.add("servers", merged)
        McpJson.writeDocument(path, existing)
        notify(project, "Merged .mcp.json → user mcp.json (${incoming.size} id(s)).", NotificationType.INFORMATION)
    }

    private fun mergeWorkspace(root: Path, incoming: Map<String, JsonElement>, project: Project) {
        val path = McpPaths.workspaceMcpJson(root)
        val existing = McpJson.readOrEmpty(path)
        val dest = McpJson.getServersObject(existing)
        val incObj = JsonObject()
        for ((id, v) in incoming) {
            incObj.add(id, v)
        }
        val next = mergeMcpServerMapsIntellij(dest, incObj)
        existing.add("servers", next)
        McpJson.writeDocument(path, existing)
        notify(project, "Merged workspace .vscode/mcp.json (${next.size()} server id(s)).", NotificationType.INFORMATION)
    }

    private fun notify(project: Project, text: String, type: NotificationType) {
        Notifications.Bus.notify(Notification("GitHubCopilotToolBox", "Github Copilot ToolBox", text, type), project)
    }
}
