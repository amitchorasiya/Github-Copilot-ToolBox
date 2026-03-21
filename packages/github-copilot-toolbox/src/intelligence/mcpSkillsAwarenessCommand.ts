import * as vscode from "vscode";
import * as mcpPaths from "../mcpPaths";
import { gatherHubPayload } from "../webview/mcpSkillsHubView";
import {
  formatMcpSkillsAwarenessMarkdown,
  formatMcpSkillsCopilotInstructionsBlock,
} from "./formatMcpSkillsAwareness";
import { mergeMcpSkillsAwarenessIntoCopilotInstructions } from "./mergeMcpSkillsIntoCopilotInstructions";

const AUTO_SCAN_MERGE_INSTRUCTIONS =
  "GitHubCopilotToolBox.intelligence.autoScanMcpSkillsOnWorkspaceOpen";

/** Opens a markdown snapshot of configured MCP servers and discovered SKILL.md skill folders (editor-side scan). */
export async function showMcpSkillsAwareness(options?: { silentNotification?: boolean }): Promise<void> {
  const cfg = vscode.workspace.getConfiguration();
  const insiders = cfg.get<boolean>("GitHubCopilotToolBox.useInsidersPaths") === true;
  const folder = mcpPaths.getPrimaryWorkspaceFolder();

  const payload = await gatherHubPayload();
  const userMcpPath = mcpPaths.userMcpJsonPath(insiders);
  const workspaceMcpPath = folder ? mcpPaths.workspaceMcpUri(folder).fsPath : undefined;

  const pathOpts = {
    userMcpPath,
    workspaceMcpPath,
    workspaceName: payload.workspaceName,
  };

  const md = formatMcpSkillsAwarenessMarkdown(payload, pathOpts);

  const doc = await vscode.workspace.openTextDocument({
    content: md,
    language: "markdown",
  });
  await vscode.window.showTextDocument(doc, { preview: true, viewColumn: vscode.ViewColumn.Active });
  if (!options?.silentNotification) {
    await vscode.window.showInformationMessage(
      "MCP & Skills awareness: report opened. Use Copilot Chat → Agent + MCP tools for live server access; skills are reference-only unless you attach them."
    );
  }

  const mergeIntoInstructions = cfg.get<boolean>(AUTO_SCAN_MERGE_INSTRUCTIONS) === true;
  if (mergeIntoInstructions && folder) {
    try {
      const instructionsMd = formatMcpSkillsCopilotInstructionsBlock(payload, pathOpts);
      await mergeMcpSkillsAwarenessIntoCopilotInstructions(folder, instructionsMd);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      console.error("[GitHub Copilot Toolbox] merge into copilot-instructions.md failed:", msg);
      if (!options?.silentNotification) {
        void vscode.window.showWarningMessage(
          `Could not update .github/copilot-instructions.md: ${msg}`
        );
      }
    }
  }
}
