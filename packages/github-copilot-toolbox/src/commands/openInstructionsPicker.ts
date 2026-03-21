import * as vscode from "vscode";
import * as mcpPaths from "../mcpPaths";

export async function openInstructionsPicker(): Promise<void> {
  const folder = mcpPaths.getPrimaryWorkspaceFolder();
  if (!folder) {
    vscode.window.showErrorMessage("Open a workspace folder first.");
    return;
  }
  const root = folder.uri;
  const candidates: { label: string; uri: vscode.Uri }[] = [
    {
      label: ".github/copilot-instructions.md",
      uri: vscode.Uri.joinPath(root, ".github", "copilot-instructions.md"),
    },
    {
      label: "AGENTS.md",
      uri: vscode.Uri.joinPath(root, "AGENTS.md"),
    },
    {
      label: ".cursorrules",
      uri: vscode.Uri.joinPath(root, ".cursorrules"),
    },
  ];

  const instructionsDir = vscode.Uri.joinPath(root, ".github", "instructions");
  try {
    const entries = await vscode.workspace.fs.readDirectory(instructionsDir);
    for (const [name, type] of entries) {
      if (type === vscode.FileType.File && name.endsWith(".instructions.md")) {
        candidates.push({
          label: `.github/instructions/${name}`,
          uri: vscode.Uri.joinPath(instructionsDir, name),
        });
      }
    }
  } catch {
    /* ignore */
  }

  const rulesDir = vscode.Uri.joinPath(root, ".cursor", "rules");
  try {
    const entries = await vscode.workspace.fs.readDirectory(rulesDir);
    for (const [name, type] of entries) {
      if (type === vscode.FileType.File && (name.endsWith(".mdc") || name.endsWith(".md"))) {
        candidates.push({
          label: `.cursor/rules/${name}`,
          uri: vscode.Uri.joinPath(rulesDir, name),
        });
      }
    }
  } catch {
    /* ignore */
  }

  const pick = await vscode.window.showQuickPick(
    candidates.map((c) => ({ label: c.label, uri: c.uri })),
    { title: "Open instruction / rules file" }
  );
  if (!pick) {
    return;
  }
  await vscode.window.showTextDocument(pick.uri);
}
