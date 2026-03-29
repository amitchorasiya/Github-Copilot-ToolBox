import * as vscode from "vscode";

const PROMPT = `I'm using the GitHub **Awesome Copilot** community catalog (https://github.com/github/awesome-copilot).

Please help me:
1. Clarify the difference between **Copilot CLI plugins** (\`copilot plugin install <name>@awesome-copilot\`) and **VS Code extensions** — I should not expect a VSIX to show up in \`copilot plugin list\`.
2. For my goal: **[describe your goal here — e.g. docs, testing, Kubernetes, security]** — suggest which Awesome Copilot **plugins**, **agents**, or **skills** might fit, or point me to search https://awesome-copilot.github.com
3. Give exact steps: register the marketplace if needed (\`copilot plugin marketplace add github/awesome-copilot\`), then install commands, and how to use them in the **Copilot CLI** or **Copilot Chat** (Copilot CLI session).

Optional context — my stack: **[language / framework]**`;

/**
 * Copies a starter prompt for **GitHub Copilot Chat** so users can ask Copilot to help navigate
 * [Awesome Copilot](https://github.com/github/awesome-copilot) without duplicating the catalog in the extension.
 */
export async function copyAwesomeCopilotChatPrompt(): Promise<void> {
  await vscode.env.clipboard.writeText(PROMPT);
  const pick = await vscode.window.showInformationMessage(
    "Awesome Copilot prompt copied — paste into GitHub Copilot Chat and edit the bracketed lines.",
    "Open Copilot Chat",
    "OK"
  );
  if (pick === "Open Copilot Chat") {
    await vscode.commands.executeCommand("GitHubCopilotToolBox.openCopilotChat");
  }
}
