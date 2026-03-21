/**
 * Readiness evaluation from plain file facts (unit-tested, no vscode imports).
 */

export type FileFact = {
  exists: boolean;
  /** UTF-8 byte length when file exists; 0 if missing */
  byteLength: number;
  /** Last modified ms when known */
  mtimeMs?: number;
};

export type ReadinessInput = {
  copilotInstructions: FileFact;
  agentsMd: FileFact;
  instructionFilesInDotGithub: number;
  memoryBankDirExists: boolean;
  workspaceMcpJson: FileFact;
  cursorrules: FileFact;
  cursorRulesDirHasFiles: boolean;
};

export type ReadinessCheck = {
  id: string;
  ok: boolean;
  message: string;
  suggestedCommand?: string;
};

const EMPTY_THRESHOLD = 12;

function isEffectivelyEmpty(f: FileFact): boolean {
  return f.exists && f.byteLength <= EMPTY_THRESHOLD;
}

export function evaluateReadiness(input: ReadinessInput): ReadinessCheck[] {
  const checks: ReadinessCheck[] = [];

  checks.push({
    id: "copilot-instructions",
    ok: input.copilotInstructions.exists && !isEffectivelyEmpty(input.copilotInstructions),
    message: !input.copilotInstructions.exists
      ? "Missing `.github/copilot-instructions.md`."
      : isEffectivelyEmpty(input.copilotInstructions)
        ? "`.github/copilot-instructions.md` exists but is nearly empty."
        : "`.github/copilot-instructions.md` looks populated.",
    suggestedCommand: !input.copilotInstructions.exists
      ? "GitHubCopilotToolBox.workspaceSetupWizard"
      : isEffectivelyEmpty(input.copilotInstructions)
        ? "GitHubCopilotToolBox.appendCursorrules"
        : "GitHubCopilotToolBox.openInstructionsPicker",
  });

  checks.push({
    id: "path-instructions",
    ok: true,
    message:
      input.instructionFilesInDotGithub === 0
        ? "No `.github/instructions/*.instructions.md` files (optional path-scoped rules)."
        : `Found ${input.instructionFilesInDotGithub} instruction file(s) under .github/instructions/.`,
    suggestedCommand: "GitHubCopilotToolBox.syncCursorRules",
  });

  checks.push({
    id: "agents-md",
    ok: true,
    message: !input.agentsMd.exists
      ? "No `AGENTS.md` (optional agent-oriented instructions)."
      : isEffectivelyEmpty(input.agentsMd)
        ? "`AGENTS.md` exists but is nearly empty."
        : "`AGENTS.md` looks populated.",
    suggestedCommand: "GitHubCopilotToolBox.openInstructionsPicker",
  });

  checks.push({
    id: "memory-bank",
    ok: true,
    message: input.memoryBankDirExists
      ? "`memory-bank/` directory present."
      : "No `memory-bank/` directory (optional long-lived project memory).",
    suggestedCommand: "GitHubCopilotToolBox.initMemoryBank",
  });

  checks.push({
    id: "mcp-json",
    ok: input.workspaceMcpJson.exists,
    message: input.workspaceMcpJson.exists
      ? "Workspace `.vscode/mcp.json` present."
      : "Workspace `.vscode/mcp.json` missing.",
    suggestedCommand: "GitHubCopilotToolBox.portCursorMcp",
  });

  checks.push({
    id: "cursorrules",
    ok: input.cursorrules.exists || input.cursorRulesDirHasFiles,
    message:
      input.cursorrules.exists || input.cursorRulesDirHasFiles
        ? "Cursor rules (`.cursorrules` and/or `.cursor/rules`) present."
        : "No `.cursorrules` or `.cursor/rules` files detected.",
    suggestedCommand: "GitHubCopilotToolBox.createCursorrulesTemplate",
  });

  const cr = input.cursorrules;
  const ci = input.copilotInstructions;
  if (cr.exists && cr.mtimeMs !== undefined && ci.exists && ci.mtimeMs !== undefined) {
    const newer = cr.mtimeMs > ci.mtimeMs;
    checks.push({
      id: "cursorrules-mtime",
      ok: !newer,
      message: newer
        ? "`.cursorrules` is newer than `.github/copilot-instructions.md` — consider syncing or appending."
        : "`.github/copilot-instructions.md` is at least as new as `.cursorrules` (by modified time).",
      suggestedCommand: "GitHubCopilotToolBox.appendCursorrules",
    });
  }

  return checks;
}

export function formatReadinessMarkdown(checks: ReadinessCheck[]): string {
  const lines: string[] = [
    "# GitHub Copilot Toolbox — Intelligence readiness",
    "",
    "Run commands from the Command Palette (`GitHub Copilot Toolbox: …`) or the **Guide & tools** view.",
    "",
  ];
  for (const c of checks) {
    const icon = c.ok ? "✓" : "○";
    lines.push(`## ${icon} ${c.id}`);
    lines.push(c.message);
    if (c.suggestedCommand) {
      lines.push(`- Suggested: \`${c.suggestedCommand}\``);
    }
    lines.push("");
  }
  return lines.join("\n");
}
