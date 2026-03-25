import * as os from "node:os";
import * as vscode from "vscode";
import * as mcpPaths from "../mcpPaths";
import type { MigrateSkillMode } from "../skills/migrateCursorSkillsToAgents";
import { runClaudeSkillsMigrationForRoot } from "../skills/migrateCursorSkillsToAgents";

type ScopePick = { label: string; description: string; value: "workspace" | "user" | "both"; alwaysShow: true };

export async function migrateSkillsClaudeToAgents(): Promise<void> {
  const folder = mcpPaths.getPrimaryWorkspaceFolder();
  const home = os.homedir();

  const scopeChoices: ScopePick[] = [
    {
      label: "User only (~/.claude/skills → ~/.agents/skills)",
      description: "Personal Claude Code skills in your home directory",
      value: "user",
      alwaysShow: true,
    },
  ];
  if (folder) {
    scopeChoices.unshift({
      label: "Workspace only (.claude/skills → .agents/skills)",
      description: `Folder: ${folder.name}`,
      value: "workspace",
      alwaysShow: true,
    });
    scopeChoices.push({
      label: "Workspace + user",
      description: "Run both migrations",
      value: "both",
      alwaysShow: true,
    });
  }

  const scope = await vscode.window.showQuickPick(scopeChoices, {
    title: "Migrate skills: Claude Code (.claude) → .agents",
    placeHolder: "Choose scope",
  });
  if (!scope) {
    return;
  }

  const modePick = await vscode.window.showQuickPick(
    [
      {
        label: "Copy",
        description: "Keep originals under .claude/skills",
        value: "copy" as const,
        alwaysShow: true as const,
      },
      {
        label: "Move",
        description: "Copy to .agents/skills then delete from .claude/skills",
        value: "move" as const,
        alwaysShow: true as const,
      },
    ],
    { title: "Copy or move?", placeHolder: "Copy is safer" }
  );
  if (!modePick) {
    return;
  }
  const mode: MigrateSkillMode = modePick.value;

  const bases: string[] = [];
  if (scope.value === "workspace" || scope.value === "both") {
    if (folder) {
      bases.push(folder.uri.fsPath);
    }
  }
  if (scope.value === "user" || scope.value === "both") {
    bases.push(home);
  }

  const lines: string[] = [];
  let totalM = 0;
  let totalS = 0;
  let totalE = 0;

  for (const base of bases) {
    const run = await runClaudeSkillsMigrationForRoot(base, mode);
    totalM += run.migrated;
    totalS += run.skipped;
    totalE += run.errors;
    if (run.found === 0) {
      lines.push(`No SKILL.md skills under ${run.sourceRoot}`);
    } else {
      lines.push(
        `${run.sourceRoot}: migrated ${run.migrated}, skipped (already in .agents) ${run.skipped}, errors ${run.errors}`
      );
    }
  }

  await vscode.commands.executeCommand("GitHubCopilotToolBox.refreshMcpView");

  const summary = `Skills .claude → .agents: ${totalM} migrated, ${totalS} skipped, ${totalE} errors.`;
  if (totalE > 0) {
    await vscode.window.showWarningMessage(`${summary} ${lines.join(" · ")}`);
  } else if (totalM === 0 && totalS === 0) {
    await vscode.window.showInformationMessage(
      `${summary} No skill folders with SKILL.md under .claude/skills for this scope.`
    );
  } else {
    await vscode.window.showInformationMessage(`${summary} ${lines.join(" · ")}`);
  }
}
