import * as vscode from "vscode";

/** Settings key prefix (avoids VS Code humanizing `GitHubCopilotToolBox` as “Github …”). */
export const TOOLBOX_SETTINGS_PREFIX = "copilot-toolbox";

const LEGACY_PREFIX = "GitHubCopilotToolBox";

const MIGRATE_SUFFIXES: readonly string[] = [
  "npxTag",
  "useInsidersPaths",
  "intelligence.includeGitByDefault",
  "intelligence.includeDiagnosticsByDefault",
  "intelligence.appendNotepadAfterPack",
  "intelligence.openChatAfterPack",
  "intelligence.autoScanMcpSkillsOnWorkspaceOpen",
  "oneClickSetup.settingsScope",
  "oneClickSetup.portCursorMcp",
  "oneClickSetup.syncCursorRules",
  "oneClickSetup.syncCursorRulesDryRun",
  "oneClickSetup.initMemoryBank",
  "oneClickSetup.initMemoryBankDryRun",
  "oneClickSetup.initMemoryBankCursorRules",
  "oneClickSetup.initMemoryBankForce",
  "oneClickSetup.appendCursorrules",
  "oneClickSetup.turnOnAutoScanAfter",
  "oneClickSetup.mergeInstructionsWithoutAutoScan",
  "oneClickSetup.runAwarenessScan",
  "oneClickSetup.runReadiness",
  "oneClickSetup.runConfigScan",
  "oneClickSetup.runFirstTestTask",
  "oneClickSetup.migrateSkills",
  "oneClickSetup.migrateSkillsScope",
  "oneClickSetup.migrateSkillsMode",
  "translateWrapMultilineInFence",
];

/**
 * Copy `GitHubCopilotToolBox.*` values into `copilot-toolbox.*` when the new key is unset,
 * then remove the legacy value from User/Workspace (not workspace-folder scoped).
 */
export async function migrateLegacyToolboxSettings(): Promise<void> {
  const cfg = vscode.workspace.getConfiguration();
  for (const suffix of MIGRATE_SUFFIXES) {
    const oldKey = `${LEGACY_PREFIX}.${suffix}`;
    const newKey = `${TOOLBOX_SETTINGS_PREFIX}.${suffix}`;
    const n = cfg.inspect(newKey);
    const o = cfg.inspect(oldKey);
    if (!o) {
      continue;
    }
    if (o.workspaceValue !== undefined && n?.workspaceValue === undefined) {
      await cfg.update(newKey, o.workspaceValue, vscode.ConfigurationTarget.Workspace);
      await cfg.update(oldKey, undefined, vscode.ConfigurationTarget.Workspace);
    }
    if (o.globalValue !== undefined && n?.globalValue === undefined) {
      await cfg.update(newKey, o.globalValue, vscode.ConfigurationTarget.Global);
      await cfg.update(oldKey, undefined, vscode.ConfigurationTarget.Global);
    }
  }
}

export function affectsToolboxSetting(
  e: vscode.ConfigurationChangeEvent,
  settingRelativeKey: string
): boolean {
  return (
    e.affectsConfiguration(`${TOOLBOX_SETTINGS_PREFIX}.${settingRelativeKey}`) ||
    e.affectsConfiguration(`${LEGACY_PREFIX}.${settingRelativeKey}`)
  );
}
