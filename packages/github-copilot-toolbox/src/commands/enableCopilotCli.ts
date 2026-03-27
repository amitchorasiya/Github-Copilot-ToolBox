import * as os from "node:os";
import * as vscode from "vscode";
import { openCopilotChat } from "./openCopilot";

const COPILOT_CHAT_SECTION = "github.copilot.chat";
const INSTALL_DOC = "https://docs.github.com/copilot/how-tos/set-up/install-copilot-cli";
const ABOUT_CLI = "https://docs.github.com/copilot/concepts/agents/about-copilot-cli";

/**
 * Installs the official GitHub Copilot CLI (`npm install -g @github/copilot`) in a visible terminal
 * and applies User-scope Copilot Chat settings that align Chat with CLI / Background Agents (when the
 * GitHub Copilot extension contributes those keys — update Copilot if writes fail).
 *
 * Current keys (see microsoft/vscode-copilot-chat `package.json`; older `cli.customAgents.enabled` was removed):
 * - `github.copilot.chat.backgroundAgent.enabled` = true — Background Agent / Copilot CLI workflows in Chat.
 * - `github.copilot.chat.terminalChatLocation` = chatView — terminal-sourced chat opens in the Chat view.
 * - `github.copilot.chat.cli.branchSupport.enabled` / `cli.sessionController.enabled` — CLI session features.
 */
export async function enableCopilotCli(): Promise<void> {
  const detail =
    "This will:\n\n" +
    "1. Open a terminal and run: npm install -g @github/copilot\n" +
    "   (official package; requires Node.js 22+ per GitHub docs).\n\n" +
    "2. Set User settings for GitHub Copilot Chat (when your Copilot build exposes them), including Background Agent.\n" +
    "3. Try to open a **New Copilot CLI Session** in Chat (Copilot CLI dropdown / CLI placeholder).\n\n" +
    "These apply to **VS Code GitHub Copilot Chat**, not Cursor’s chat. " +
    "If `copilot` is not found after install, add NPM’s global bin to PATH (the terminal prints the path).\n\n" +
    "You need an active Copilot subscription. Org policies may block the CLI.\n\n" +
    "If npm uses ignore-scripts=true globally, the install may fail — see the install docs.";

  const pick = await vscode.window.showInformationMessage(
    "Install Copilot CLI & configure Chat",
    { modal: true, detail },
    "Continue",
    "Open install docs",
    "Cancel"
  );
  if (pick === "Open install docs") {
    await vscode.env.openExternal(vscode.Uri.parse(INSTALL_DOC));
    return;
  }
  if (pick !== "Continue") {
    return;
  }

  startCopilotCliGlobalInstallTerminal();

  const applied = await applyCopilotCliChatSettings();
  if (!applied.writesOk) {
    const { notes } = applied;
    const w = await vscode.window.showWarningMessage(
      `Copilot CLI install started in the terminal, but Copilot Chat User settings did not apply: ${notes.join("; ")}`,
      "Open User settings.json",
      "Open github.copilot.chat settings",
      "OK"
    );
    if (w === "Open User settings.json") {
      await vscode.commands.executeCommand("workbench.action.openSettingsJson");
    } else if (w === "Open github.copilot.chat settings") {
      await vscode.commands.executeCommand("workbench.action.openSettings", COPILOT_CHAT_SECTION);
    }
    return;
  }

  await openCopilotCliNewSessionBestEffort();

  const eff = applied.effective;
  const effLine =
    eff !== undefined
      ? ` Effective values (workspace can override User): terminalChatLocation=${String(eff.terminalChatLocation)}, cli.branchSupport=${String(eff.branchSupport)}, cli.sessionController=${String(eff.sessionController)}.`
      : "";
  const after = await vscode.window.showInformationMessage(
    "Terminal: npm install -g @github/copilot (running). User settings were written under github.copilot.chat (scoped API)." +
      effLine +
      " Use **Open User settings.json** to confirm `cli.branchSupport.enabled` and `cli.sessionController.enabled`. " +
      "Reload the window if Copilot does not pick them up. When install finishes, run `copilot` in a folder you trust.",
    "Open User settings.json",
    "Reload Window",
    "Open Copilot Chat",
    "About Copilot CLI",
    "OK"
  );
  if (after === "Open User settings.json") {
    await vscode.commands.executeCommand("workbench.action.openSettingsJson");
    return;
  }
  if (after === "Reload Window") {
    await vscode.commands.executeCommand("workbench.action.reloadWindow");
    return;
  }
  if (after === "Open Copilot Chat") {
    try {
      await vscode.commands.executeCommand("workbench.action.chat.open");
    } catch {
      vscode.window.showWarningMessage("Could not open Copilot Chat — try View → Chat.");
    }
  } else if (after === "About Copilot CLI") {
    await vscode.env.openExternal(vscode.Uri.parse(ABOUT_CLI));
  }
}

/**
 * Opens a terminal and runs `npm install -g @github/copilot`, then prints the **global npm bin**
 * folder via `npm bin -g` (correct on Windows and Unix — not `$(prefix)/bin`, which is macOS/Linux-only).
 * Windows string targets **PowerShell** (VS Code’s default); use PowerShell or run `npm bin -g` manually if your profile is cmd.
 */
export function startCopilotCliGlobalInstallTerminal(): void {
  const term = vscode.window.createTerminal({ name: "Install Copilot CLI" });
  term.show(true);
  const isWin = os.platform() === "win32";
  const script = isWin
    ? 'npm install -g @github/copilot; if ($?) { Write-Host ""; Write-Host "Global npm bin (add to User PATH if copilot / copilot.cmd not found):"; npm bin -g }'
    : 'npm install -g @github/copilot && echo "" && echo "Global npm bin (add to PATH if copilot is not found):" && npm bin -g';
  term.sendText(script, true);
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function copilotCliSessionCommandsRegistered(): Promise<{
  newSession: boolean;
  newSessionToSide: boolean;
}> {
  const all = await vscode.commands.getCommands(true);
  return {
    newSession: all.includes("github.copilot.cli.newSession"),
    newSessionToSide: all.includes("github.copilot.cli.newSessionToSide"),
  };
}

export type OpenCopilotCliSessionOptions = {
  /** After attempting, explain why UI may not switch + manual steps. */
  showFooterHint?: boolean;
};

/**
 * Opens GitHub Copilot Chat, then **New Copilot CLI Session** (background-agent / CLI placeholder).
 *
 * **Why it often looks “not working”:** `executeCommand` usually **does not throw** when Copilot ignores or
 * defers the request, so the session can stay on **Local**. The **# GitHub Copilot Toolbox** chip is only
 * context; **Local | Copilot CLI** is a separate footer control. Org policy can also hide **Copilot CLI**.
 */
export async function openCopilotCliNewSessionBestEffort(opts?: OpenCopilotCliSessionOptions): Promise<void> {
  await openCopilotChat();
  await sleep(1200);
  const reg = await copilotCliSessionCommandsRegistered();

  if (!reg.newSession && !reg.newSessionToSide) {
    if (opts?.showFooterHint) {
      const w = await vscode.window.showWarningMessage(
        "GitHub Copilot did not register **New Copilot CLI Session** in this window. Use current **VS Code** + **GitHub Copilot** (update both), not a stripped-down fork.",
        { modal: false, detail: "After Copilot loads, try Command Palette → **New Copilot CLI Session**." },
        "Open github.copilot.chat settings",
        "OK"
      );
      if (w === "Open github.copilot.chat settings") {
        await vscode.commands.executeCommand("workbench.action.openSettings", COPILOT_CHAT_SECTION);
      }
    }
    return;
  }

  try {
    if (reg.newSession) {
      await vscode.commands.executeCommand("github.copilot.cli.newSession");
    } else {
      await vscode.commands.executeCommand("github.copilot.cli.newSessionToSide");
    }
  } catch {
    /* rare */
  }

  if (opts?.showFooterHint) {
    const pick = await vscode.window.showInformationMessage(
      "Copilot Chat may still show **Local** after automation.",
      {
        detail:
          "VS Code’s **executeCommand** usually does not report failure, so the Toolbox cannot confirm that a **Copilot CLI** session started.\n\n" +
          "Do this in the **GitHub Copilot Chat** panel (footer next to Default Approvals): open the **Local** menu → **Copilot CLI**. Or Command Palette → **New Copilot CLI Session**.\n\n" +
          "If **Copilot CLI** is missing: set User **github.copilot.chat.backgroundAgent.enabled** to true (One Click does this) and check **organization Copilot policy**. The **# Intelligence** tag is not the session type.",
      },
      "Open backgroundAgent setting",
      "OK"
    );
    if (pick === "Open backgroundAgent setting") {
      await vscode.commands.executeCommand(
        "workbench.action.openSettings",
        `${COPILOT_CHAT_SECTION}.backgroundAgent`
      );
    }
  }
}

/** Command entry: open CLI / background-agent Copilot Chat session + optional hint. */
export async function openCopilotCliChatSessionCommand(): Promise<void> {
  await openCopilotCliNewSessionBestEffort({ showFooterHint: true });
}

/**
 * Relative keys under `github.copilot.chat` (same pattern as `enableClaudeCopilotChatAgent`).
 * Do not use `workspace.getConfiguration().update("github.copilot.chat.*")` — those full-key writes
 * often do not persist Copilot-contributed settings; scoped `getConfiguration(section).update` does.
 */
const COPILOT_CLI_CHAT_RELATIVE_KEYS: Array<[string, string | boolean]> = [
  ["backgroundAgent.enabled", true],
  ["terminalChatLocation", "chatView"],
  ["cli.branchSupport.enabled", true],
  ["cli.sessionController.enabled", true],
];

export type ApplyCopilotCliChatSettingsResult = {
  /** True only if every `update()` call resolved (no exception). */
  writesOk: boolean;
  notes: string[];
  /** Effective values after writes (for toasts / debugging). */
  effective?: { terminalChatLocation: string | undefined; branchSupport: boolean | undefined; sessionController: boolean | undefined };
};

export async function applyCopilotCliChatSettings(): Promise<ApplyCopilotCliChatSettingsResult> {
  const chat = vscode.workspace.getConfiguration(COPILOT_CHAT_SECTION);
  const notes: string[] = [];
  let writesOk = true;
  for (const [key, value] of COPILOT_CLI_CHAT_RELATIVE_KEYS) {
    try {
      await chat.update(key, value, vscode.ConfigurationTarget.Global);
    } catch (e) {
      writesOk = false;
      notes.push(`${COPILOT_CHAT_SECTION}.${key}: ${e instanceof Error ? e.message : String(e)}`);
    }
  }
  try {
    await chat.update("cli.customAgents.enabled", true, vscode.ConfigurationTarget.Global);
  } catch {
    /* Removed in recent Copilot Chat builds; ignore. */
  }

  const effective = {
    terminalChatLocation: chat.get<string>("terminalChatLocation"),
    branchSupport: chat.get<boolean>("cli.branchSupport.enabled"),
    sessionController: chat.get<boolean>("cli.sessionController.enabled"),
  };

  const branchIns = chat.inspect<boolean>("cli.branchSupport.enabled");
  const sessionIns = chat.inspect<boolean>("cli.sessionController.enabled");
  if (branchIns?.globalValue !== true) {
    notes.push(
      `Check User settings: ${COPILOT_CHAT_SECTION}.cli.branchSupport.enabled globalValue is ${String(branchIns?.globalValue)} (expected true after save). Workspace .vscode/settings.json may override the effective value.`
    );
  }
  if (sessionIns?.globalValue !== true) {
    notes.push(
      `Check User settings: ${COPILOT_CHAT_SECTION}.cli.sessionController.enabled globalValue is ${String(sessionIns?.globalValue)} (expected true after save).`
    );
  }

  return { writesOk, notes, effective };
}
