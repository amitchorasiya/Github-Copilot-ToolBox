/** Replaceable block markers for CLAUDE.md → copilot-instructions migration. */
export const CLAUDE_MD_BANNER_START = "<!-- github-copilot-toolbox:claude-md-begin -->";
export const CLAUDE_MD_BANNER_END = "<!-- github-copilot-toolbox:claude-md-end -->";

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Build the markdown block to insert (includes banners and headings).
 */
export function buildClaudeMdMigrationBlock(mainText: string, localText?: string): string {
  const parts: string[] = [
    "",
    CLAUDE_MD_BANNER_START,
    "",
    "## Migrated from `CLAUDE.md` (Claude Code → GitHub Copilot Toolbox)",
    "",
    mainText.trim(),
    "",
  ];
  if (localText !== undefined && localText.trim().length > 0) {
    parts.push("### From `CLAUDE.local.md`", "", localText.trim(), "");
  }
  parts.push(CLAUDE_MD_BANNER_END, "");
  return parts.join("\n");
}

/**
 * Replace an existing marked block or append to the file body.
 */
export function mergeClaudeMdBlockIntoInstructions(existing: string, block: string): string {
  const trimmed = existing.trim();
  if (!trimmed) {
    return `# GitHub Copilot instructions\n${block}`;
  }
  if (trimmed.includes(CLAUDE_MD_BANNER_START) && trimmed.includes(CLAUDE_MD_BANNER_END)) {
    const re = new RegExp(
      `${escapeRe(CLAUDE_MD_BANNER_START)}[\\s\\S]*?${escapeRe(CLAUDE_MD_BANNER_END)}\\n*`,
      "m"
    );
    return trimmed.replace(re, block);
  }
  return trimmed.trimEnd() + block;
}
