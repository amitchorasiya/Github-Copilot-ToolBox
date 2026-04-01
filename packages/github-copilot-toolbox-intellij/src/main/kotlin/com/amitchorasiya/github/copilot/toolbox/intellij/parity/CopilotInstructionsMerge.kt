package com.amitchorasiya.github.copilot.toolbox.intellij.parity

/** Replaceable blocks for instruction merges (VS Code parity). */
object CopilotInstructionsMerge {

    const val CLAUDE_MD_BANNER_START = "<!-- github-copilot-toolbox:claude-md-begin -->"
    const val CLAUDE_MD_BANNER_END = "<!-- github-copilot-toolbox:claude-md-end -->"

    fun buildClaudeMdMigrationBlock(mainText: String, localText: String? = null): String {
        val parts = mutableListOf(
            "",
            CLAUDE_MD_BANNER_START,
            "",
            "## Migrated from `CLAUDE.md` (Claude Code → GitHub Copilot Toolbox)",
            "",
            mainText.trim(),
            "",
        )
        if (!localText.isNullOrBlank()) {
            parts.add("### From `CLAUDE.local.md`")
            parts.add("")
            parts.add(localText.trim())
            parts.add("")
        }
        parts.add(CLAUDE_MD_BANNER_END)
        parts.add("")
        return parts.joinToString("\n")
    }

    fun mergeClaudeMdBlockIntoInstructions(existing: String, block: String): String {
        val trimmed = existing.trim()
        if (trimmed.isEmpty()) {
            return "# GitHub Copilot instructions\n$block"
        }
        if (trimmed.contains(CLAUDE_MD_BANNER_START) && trimmed.contains(CLAUDE_MD_BANNER_END)) {
            val re = Regex(
                Regex.escape(CLAUDE_MD_BANNER_START) + "[\\s\\S]*?" + Regex.escape(CLAUDE_MD_BANNER_END) + "\\n*",
                RegexOption.MULTILINE,
            )
            return trimmed.replace(re, block)
        }
        return trimmed.trimEnd() + block
    }
}
