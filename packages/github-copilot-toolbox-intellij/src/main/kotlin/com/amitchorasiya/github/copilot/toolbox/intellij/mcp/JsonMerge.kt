package com.amitchorasiya.github.copilot.toolbox.intellij.mcp

import com.google.gson.JsonObject
import com.google.gson.JsonParser

private fun JsonObject.copyJson(): JsonObject =
    JsonParser.parseString(this.toString()).asJsonObject

private fun copyEl(el: com.google.gson.JsonElement): com.google.gson.JsonElement =
    JsonParser.parseString(el.toString())

/** Merge [patch] into [existing]: only keys missing in [existing] are added; nested objects recurse. */
fun mergeMissingJsonKeys(existing: JsonObject, patch: JsonObject): JsonObject {
    val out = existing.copyJson()
    for (e in patch.entrySet()) {
        val k = e.key
        val v = e.value
        if (!out.has(k)) {
            out.add(k, copyEl(v))
        } else if (v.isJsonObject && out.get(k).isJsonObject) {
            out.add(k, mergeMissingJsonKeys(out.getAsJsonObject(k), v.asJsonObject))
        }
    }
    return out
}

/** Merge two `servers` maps: new ids added; same id merges missing keys only. */
fun mergeMcpServerMapsIntellij(dest: JsonObject, incoming: JsonObject): JsonObject {
    val out = dest.copyJson()
    for (e in incoming.entrySet()) {
        val id = e.key
        val inc = e.value
        if (!inc.isJsonObject) continue
        if (!out.has(id)) {
            out.add(id, inc.asJsonObject.copyJson())
        } else if (out.get(id).isJsonObject) {
            out.add(id, mergeMissingJsonKeys(out.getAsJsonObject(id), inc.asJsonObject))
        }
    }
    return out
}
