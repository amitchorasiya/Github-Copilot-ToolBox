package com.amitchorasiya.github.copilot.toolbox.intellij.settings

import com.amitchorasiya.github.copilot.toolbox.intellij.mcp.McpPaths
import com.google.gson.Gson
import com.google.gson.JsonObject
import com.google.gson.JsonParser
import java.nio.charset.StandardCharsets
import java.nio.file.Files
import java.nio.file.Path
import kotlin.io.path.createDirectories
import kotlin.io.path.exists

/**
 * Project `.github/copilot-toolbox-settings.json` — mirrors VS Code `copilot-toolbox.*` keys used by the hub.
 */
class ToolboxSettings(private val projectRoot: Path?) {

    private val gson = Gson()
    private val path: Path?
        get() = projectRoot?.resolve(".github")?.resolve("copilot-toolbox-settings.json")

    private fun load(): JsonObject {
        val p = path ?: return JsonObject()
        if (!p.exists()) return JsonObject()
        return try {
            JsonParser.parseString(Files.readString(p, StandardCharsets.UTF_8)).asJsonObject
        } catch (_: Exception) {
            JsonObject()
        }
    }

    private fun save(o: JsonObject) {
        val p = path ?: return
        p.parent?.createDirectories()
        Files.writeString(p, gson.toJson(o) + "\n", StandardCharsets.UTF_8)
    }

    fun getAutoScanMcpSkills(): Boolean = load().get("autoScanMcpSkillsOnWorkspaceOpen")?.asBoolean == true

    fun setAutoScanMcpSkills(value: Boolean) {
        val o = load()
        o.addProperty("autoScanMcpSkillsOnWorkspaceOpen", value)
        save(o)
    }

    fun getThinkingMachine(): Boolean = load().get("thinkingMachineModeEnabled")?.asBoolean == true

    fun setThinkingMachine(value: Boolean) {
        val o = load()
        o.addProperty("thinkingMachineModeEnabled", value)
        save(o)
    }

    fun getThinkingMachineRunAwarenessScan(): Boolean = boolKey("thinkingMachineRunAwarenessScan", true)

    /** VS Code `thinkingMachineMode.mergeAwarenessIntoCopilotInstructions`. */
    fun getThinkingMachineMergeAwarenessIntoCopilotInstructions(): Boolean {
        val o = load()
        val v = o.get("thinkingMachineMergeAwarenessIntoCopilotInstructions")
            ?: o.get("thinkingMachineMergeAwarenessIntoClaudeMd")
        return if (v == null || v.isJsonNull) true else v.asBoolean
    }

    fun getThinkingMachineShowConfirmationModal(): Boolean =
        boolKey("thinkingMachineShowConfirmationModal", true)

    private fun boolKey(key: String, default: Boolean): Boolean {
        val v = load().get(key) ?: return default
        return if (v.isJsonNull) default else v.asBoolean
    }

    fun getTranslateWrapMultilineInFence(): Boolean = boolKey("translateWrapMultilineInFence", false)

    fun getUseInsidersPaths(): Boolean = load().get("useInsidersPaths")?.asBoolean == true

    fun setUseInsidersPaths(value: Boolean) {
        val o = load()
        o.addProperty("useInsidersPaths", value)
        save(o)
    }

    fun getNpxTag(): String {
        val t = load().get("npxTag")?.asString?.trim()
        return if (t.isNullOrEmpty()) "latest" else t
    }

    fun setNpxTag(value: String) {
        val o = load()
        o.addProperty("npxTag", value.ifBlank { "latest" })
        save(o)
    }

    fun getEmbeddedBridgeNodeExecutable(): String = load().get("embeddedBridgeNodeExecutable")?.asString?.trim() ?: ""

    fun setEmbeddedBridgeNodeExecutable(value: String) {
        val o = load()
        o.addProperty("embeddedBridgeNodeExecutable", value.trim())
        save(o)
    }

    fun getRunCursorToCopilotTrack(): Boolean {
        val v = load().get("runCursorToCopilotTrack")
        return if (v == null || v.isJsonNull) true else v.asBoolean
    }

    fun setRunCursorToCopilotTrack(value: Boolean) {
        val o = load()
        o.addProperty("runCursorToCopilotTrack", value)
        save(o)
    }

    fun getRunClaudeCodeToCopilotTrack(): Boolean {
        val v = load().get("runClaudeCodeToCopilotTrack")
        return if (v == null || v.isJsonNull) true else v.asBoolean
    }

    fun setRunClaudeCodeToCopilotTrack(value: Boolean) {
        val o = load()
        o.addProperty("runClaudeCodeToCopilotTrack", value)
        save(o)
    }

    fun getOneClickSetup(): OneClickSetupModel {
        val el = load().get("oneClickSetup")
        if (el == null || !el.isJsonObject) return OneClickSetupModel()
        return try {
            val m = gson.fromJson(el, OneClickSetupModel::class.java) ?: OneClickSetupModel()
            normalizeMergeOnlyEnums(m)
        } catch (_: Exception) {
            OneClickSetupModel()
        }
    }

    /** Legacy values: overwrite / force → merge-safe. */
    private fun normalizeMergeOnlyEnums(m: OneClickSetupModel): OneClickSetupModel {
        if (m.portCursorMcp == "workspaceOverwrite") m.portCursorMcp = "workspaceMerge"
        if (m.portClaudeProjectMcp == "workspaceOverwrite") m.portClaudeProjectMcp = "workspaceMerge"
        if (m.initMemoryBankMode == "applyForce") m.initMemoryBankMode = "apply"
        return m
    }

    fun setOneClickSetup(model: OneClickSetupModel) {
        val o = load()
        val tree = gson.toJsonTree(model)
        if (tree.isJsonObject) {
            o.add("oneClickSetup", tree.asJsonObject)
        }
        save(o)
    }

    fun userMcpJsonPath(): Path = McpPaths.userMcpJson(getUseInsidersPaths())
}
