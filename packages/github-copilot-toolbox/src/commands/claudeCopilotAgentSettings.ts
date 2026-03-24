import * as vscode from "vscode";

const COPILOT_CHAT_SECTION = "github.copilot.chat";
const CLAUDE_AGENT_KEY = "claudeAgent.enabled";
const THIRD_PARTY_AGENTS_DOC =
  "https://code.visualstudio.com/docs/copilot/agents/third-party-agents";

/**
 * Explains org/GitHub/VS Code requirements for Claude as a cloud agent in Copilot Chat.
 */
export async function showClaudeCopilotAgentPrerequisites(): Promise<void> {
  const detail =
    "Prerequisites (Claude as a cloud agent in Copilot Chat):\n\n" +
    "• GitHub Copilot Business or Enterprise is typically required.\n" +
    "• Your enterprise or org admin must enable Claude under Partner Agents in GitHub AI Controls / organization settings.\n" +
    "• On github.com, allow third-party agents in your Copilot account settings if your organization requires it.\n" +
    "• In VS Code, enable github.copilot.chat.claudeAgent.enabled (this extension can set it for you).\n" +
    "• Usage: open Chat → New Chat (+) → session type Cloud → choose Claude in the Partner Agent list.\n\n" +
    "Details change with GitHub and VS Code releases — see the third-party agents documentation.";

  const pick = await vscode.window.showInformationMessage(
    "Claude in Copilot Chat — prerequisites",
    { modal: true, detail },
    "Enable VS Code setting",
    "Open documentation",
    "Close"
  );
  if (pick === "Enable VS Code setting") {
    await enableClaudeCopilotChatAgent({ silent: false });
  } else if (pick === "Open documentation") {
    await vscode.env.openExternal(vscode.Uri.parse(THIRD_PARTY_AGENTS_DOC));
  }
}

export type EnableClaudeAgentResult = { ok: true } | { ok: false; note: string };

/**
 * Sets GitHub Copilot Chat's Claude agent flag in User settings.
 * Org/GitHub policy may still block cloud Claude even when this is true.
 */
export async function enableClaudeCopilotChatAgent(opts?: {
  silent?: boolean;
}): Promise<EnableClaudeAgentResult> {
  try {
    const chat = vscode.workspace.getConfiguration(COPILOT_CHAT_SECTION);
    await chat.update(CLAUDE_AGENT_KEY, true, vscode.ConfigurationTarget.Global);
    if (!opts?.silent) {
      const p = await vscode.window.showInformationMessage(
        "Set github.copilot.chat.claudeAgent.enabled to true (User settings). " +
          "You still need an eligible Copilot plan and org allowlisting for Partner Agents.",
        "Open Copilot Chat",
        "Open setting",
        "OK"
      );
      if (p === "Open Copilot Chat") {
        try {
          await vscode.commands.executeCommand("workbench.action.chat.open");
        } catch {
          vscode.window.showWarningMessage("Could not open Copilot Chat — try View → Chat.");
        }
      } else if (p === "Open setting") {
        await vscode.commands.executeCommand(
          "workbench.action.openSettings",
          `${COPILOT_CHAT_SECTION}.${CLAUDE_AGENT_KEY}`
        );
      }
    }
    return { ok: true };
  } catch (e) {
    const m = e instanceof Error ? e.message : String(e);
    if (!opts?.silent) {
      const w = await vscode.window.showWarningMessage(
        `Could not set Claude agent option: ${m}`,
        "Open Settings search"
      );
      if (w === "Open Settings search") {
        await vscode.commands.executeCommand(
          "workbench.action.openSettings",
          `${COPILOT_CHAT_SECTION}.${CLAUDE_AGENT_KEY}`
        );
      }
    }
    return { ok: false, note: `Claude Chat agent setting: ${m}` };
  }
}
