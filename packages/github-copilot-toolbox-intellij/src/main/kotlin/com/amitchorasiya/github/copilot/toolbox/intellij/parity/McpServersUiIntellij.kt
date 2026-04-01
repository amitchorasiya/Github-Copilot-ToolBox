package com.amitchorasiya.github.copilot.toolbox.intellij.parity

import com.amitchorasiya.github.copilot.toolbox.intellij.hub.HubStateService
import com.amitchorasiya.github.copilot.toolbox.intellij.ui.ToolboxDialogUi
import com.amitchorasiya.github.copilot.toolbox.intellij.mcp.McpJson
import com.amitchorasiya.github.copilot.toolbox.intellij.mcp.mergeMissingJsonKeys
import com.amitchorasiya.github.copilot.toolbox.intellij.mcp.McpPaths
import com.amitchorasiya.github.copilot.toolbox.intellij.settings.ToolboxSettings
import com.google.gson.JsonArray
import com.google.gson.JsonParser
import com.intellij.openapi.project.Project
import com.intellij.openapi.ui.Messages
import java.nio.charset.StandardCharsets

/** Basic MCP server list + manual JSON add (VS Code native MCP UI parity). */
object McpServersUiIntellij {

    fun listServers(project: Project) {
        val payload = HubStateService.gatherPayload(project)
        val lines = mutableListOf<String>()
        lines.add("# MCP servers")
        lines.add("")
        lines.add("| Scope | Id | Kind | Detail | Off |")
        lines.add("|-------|----|-----|--------|-----|")
        appendRows(lines, "workspace", payload.getAsJsonArray("workspaceServers"))
        appendRows(lines, "user", payload.getAsJsonArray("userServers"))
        lines.add("")
        lines.add("_Open `.vscode/mcp.json` or user `mcp.json` from the hub to edit JSON._")
        ParityScratchFiles.openUnderClaude(project, "mcp-servers-overview.md", lines.joinToString("\n"))
    }

    fun addServer(project: Project, settings: ToolboxSettings) {
        val base = project.basePath ?: run {
            Messages.showErrorDialog(project, "Open a workspace folder first.", "Github Copilot ToolBox")
            return
        }
        val scopes = arrayOf("Workspace (.vscode/mcp.json)", "User profile mcp.json")
        val sidx = ToolboxDialogUi.showChooseDialog(
            project,
            "Where should the new server be stored?",
            "Add MCP server",
            Messages.getQuestionIcon(),
            scopes,
            scopes[0],
        )
        if (sidx < 0) return
        val workspaceScope = sidx == 0
        val serverId = Messages.showInputDialog(
            project,
            "Server id (JSON key under \"servers\"):",
            "Add MCP server",
            Messages.getQuestionIcon(),
        )?.trim().orEmpty()
        if (serverId.isEmpty()) return
        val jsonStr = Messages.showMultilineInputDialog(
            project,
            "Paste the server config as a JSON object, e.g. {\"type\":\"stdio\",\"command\":\"npx\", ...}",
            "Server config JSON",
            "",
            Messages.getQuestionIcon(),
            null,
        )?.trim().orEmpty()
        if (jsonStr.isEmpty()) return
        val cfg = try {
            JsonParser.parseString(jsonStr)
        } catch (e: Exception) {
            Messages.showErrorDialog(project, "Invalid JSON: ${e.message}", "Github Copilot ToolBox")
            return
        }
        if (!cfg.isJsonObject) {
            Messages.showErrorDialog(project, "Server config must be a JSON object.", "Github Copilot ToolBox")
            return
        }
        val rootPath = java.nio.file.Path.of(base)
        val mcpPath = if (workspaceScope) McpPaths.workspaceMcpJson(rootPath) else settings.userMcpJsonPath()
        val doc = McpJson.readOrEmpty(mcpPath)
        val servers = McpJson.getServersObject(doc)
        if (servers.has(serverId) && servers.get(serverId).isJsonObject && cfg.isJsonObject) {
            servers.add(serverId, mergeMissingJsonKeys(servers.getAsJsonObject(serverId), cfg.asJsonObject))
        } else if (!servers.has(serverId)) {
            servers.add(serverId, cfg)
        } else {
            Messages.showInfoMessage(project, "Server \"$serverId\" exists with non-object config; skipped merge.", "Github Copilot ToolBox")
            return
        }
        McpJson.writeDocument(mcpPath, doc)
        Messages.showInfoMessage(project, "Updated ${mcpPath.fileName} (server \"$serverId\").", "Github Copilot ToolBox")
        project.getService(com.amitchorasiya.github.copilot.toolbox.intellij.hub.GithubCopilotHubBridge::class.java).refreshHub()
    }

    private fun appendRows(lines: MutableList<String>, scope: String, arr: JsonArray?) {
        if (arr == null || arr.size() == 0) {
            lines.add("| $scope | _none_ | | | |")
            return
        }
        for (el in arr) {
            if (!el.isJsonObject) continue
            val o = el.asJsonObject
            val id = esc(o.get("id")?.asString ?: "?")
            val kind = esc(o.get("kind")?.asString ?: "")
            val det = esc(o.get("detail")?.asString ?: "")
            val off = if (o.get("disabled")?.asBoolean == true) "yes" else ""
            lines.add("| $scope | $id | $kind | $det | $off |")
        }
    }

    private fun esc(s: String): String = s.replace("|", "\\|").replace("\n", " ").take(120)
}
