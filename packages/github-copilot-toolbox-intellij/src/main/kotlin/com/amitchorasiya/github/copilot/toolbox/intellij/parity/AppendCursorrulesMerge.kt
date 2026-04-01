package com.amitchorasiya.github.copilot.toolbox.intellij.parity

/** Mirrors VS Code migrate cursorrules → copilot-instructions replaceable block. */
object AppendCursorrulesMerge {

    private const val BANNER_START = "<!-- github-copilot-toolbox:cursorrules-begin -->"
    private const val BANNER_END = "<!-- github-copilot-toolbox:cursorrules-end -->"

    fun mergeBlock(cursorrulesText: String): String {
        val rules = cursorrulesText.trim()
        return listOf(
            "",
            BANNER_START,
            "",
            "## Migrated from `.cursorrules` (via Github Copilot ToolBox)",
            "",
            rules,
            "",
            BANNER_END,
            "",
        ).joinToString("\n")
    }

    fun mergeIntoCopilotInstructions(existingInstructions: String, cursorrulesText: String): String {
        val block = mergeBlock(cursorrulesText)
        val trimmed = existingInstructions.trim()
        if (trimmed.isEmpty()) {
            return "# GitHub Copilot instructions\n$block"
        }
        if (trimmed.contains(BANNER_START) && trimmed.contains(BANNER_END)) {
            val re = Regex(
                Regex.escape(BANNER_START) + "[\\s\\S]*?" + Regex.escape(BANNER_END) + "\\n*",
                RegexOption.MULTILINE,
            )
            return trimmed.replace(re, block)
        }
        return trimmed.trimEnd() + block
    }
}
