import * as vscode from "vscode";
import { TOOLBOX_SETTINGS_PREFIX } from "../toolboxSettings";
import { cascadeThinkingMachineChildSettingsToTrue } from "./thinkingMachineModeCascade";

const ENABLED_KEY = `${TOOLBOX_SETTINGS_PREFIX}.thinkingMachineMode.enabled`;
const GLOBAL_ACK = "thinkingMachineModeActivationAcknowledged";
const MIGRATION_TOAST = "thinkingMachineAutoScanDefaultMigration0529";

/**
 * When Thinking Machine Mode is enabled, show the Engage modal until acknowledged; each time the user turns
 * the mode off, acknowledgment is cleared so turning it back on shows the modal again.
 */
export function registerThinkingMachineModeActivation(
  context: vscode.ExtensionContext
): vscode.Disposable {
  return vscode.workspace.onDidChangeConfiguration(async (e) => {
    if (!e.affectsConfiguration(ENABLED_KEY)) {
      return;
    }
    const cfg = vscode.workspace.getConfiguration();
    if (cfg.get<boolean>(ENABLED_KEY) !== true) {
      // Turning the mode off clears acknowledgment so the next enable shows Engage again.
      await context.globalState.update(GLOBAL_ACK, false);
      return;
    }
    if (context.globalState.get(GLOBAL_ACK) !== true) {
      const choice = await vscode.window.showInformationMessage(
        "Thinking Machine Mode — initialize neural link?",
        {
          modal: true,
          detail:
            "We’ll align your workspace context substrate — MCP server ids, skills layout, open-editor snapshots, and Copilot instruction merge blocks — so GitHub Copilot can start sharper in this repo.\n\n" +
            "This is file-backed priming (reports + clipboard context pack), not a hidden code index. For deep repo Q&A, still use Agent mode and @workspace in Chat.",
        },
        "Engage"
      );

      if (choice === "Engage") {
        await context.globalState.update(GLOBAL_ACK, true);
        await cascadeThinkingMachineChildSettingsToTrue();
      } else {
        await revertThinkingMachineEnabledFalse();
      }
      return;
    }

    await cascadeThinkingMachineChildSettingsToTrue();
  });
}

async function revertThinkingMachineEnabledFalse(): Promise<void> {
  const cfg = vscode.workspace.getConfiguration();
  const ins = cfg.inspect(ENABLED_KEY);
  if (ins?.workspaceFolderValue === true) {
    await cfg.update(ENABLED_KEY, false, vscode.ConfigurationTarget.WorkspaceFolder);
  }
  if (ins?.workspaceValue === true) {
    await cfg.update(ENABLED_KEY, false, vscode.ConfigurationTarget.Workspace);
  }
  if (ins?.globalValue === true) {
    await cfg.update(ENABLED_KEY, false, vscode.ConfigurationTarget.Global);
  }
}

/**
 * If settings already have Thinking Machine enabled but the user never confirmed Engage, prompt once per session startup.
 */
export async function thinkingMachineModeActivationStartupCheck(
  context: vscode.ExtensionContext
): Promise<void> {
  const cfg = vscode.workspace.getConfiguration();
  if (cfg.get<boolean>(ENABLED_KEY) !== true) {
    return;
  }
  if (context.globalState.get(GLOBAL_ACK) === true) {
    return;
  }
  const choice = await vscode.window.showInformationMessage(
    "Thinking Machine Mode — initialize neural link?",
    {
      modal: true,
      detail:
        "We’ll align your workspace context substrate — MCP server ids, skills layout, open-editor snapshots, and Copilot instruction merge blocks — so GitHub Copilot can start sharper in this repo.\n\n" +
        "This is file-backed priming (reports + clipboard context pack), not a hidden code index. For deep repo Q&A, still use Agent mode and @workspace in Chat.",
    },
    "Engage"
  );
  if (choice === "Engage") {
    await context.globalState.update(GLOBAL_ACK, true);
    await cascadeThinkingMachineChildSettingsToTrue();
  } else {
    await revertThinkingMachineEnabledFalse();
  }
}

/**
 * One-time toast after upgrade: auto-scan default is now true.
 */
export async function maybeShowAutoScanDefaultMigrationToast(
  context: vscode.ExtensionContext
): Promise<void> {
  if (context.globalState.get(MIGRATION_TOAST) === true) {
    return;
  }
  await context.globalState.update(MIGRATION_TOAST, true);
  const choice = await vscode.window.showInformationMessage(
    "GitHub Copilot Toolbox: background MCP & Skills auto-scan now defaults to ON (saves .github/… on workspace open). Turn it off under Settings → MCP & Skills — background sync if you prefer manual scans only.",
    "Open settings"
  );
  if (choice === "Open settings") {
    await vscode.commands.executeCommand(
      "workbench.action.openSettings",
      "copilot-toolbox.intelligence.autoScanMcpSkillsOnWorkspaceOpen"
    );
  }
}
