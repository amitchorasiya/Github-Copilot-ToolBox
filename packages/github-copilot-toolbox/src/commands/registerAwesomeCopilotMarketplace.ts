import * as os from "node:os";
import * as vscode from "vscode";

/** Official community catalog — we only register the Copilot CLI marketplace; browsing stays on their site. */
const AWESOME_COPILOT_GITHUB = "https://github.com/github/awesome-copilot";
const AWESOME_COPILOT_WEBSITE = "https://awesome-copilot.github.com";
const MARKETPLACE_SPEC = "github/awesome-copilot";

/**
 * Registers the [Awesome Copilot](https://github.com/github/awesome-copilot) plugin marketplace with the
 * **Copilot CLI** (`copilot plugin marketplace add github/awesome-copilot`). Does not ship or mirror
 * agents/skills — use the [catalog site](https://awesome-copilot.github.com) to pick plugins, then
 * `copilot plugin install <name>@awesome-copilot` in a terminal.
 */
export async function registerAwesomeCopilotMarketplace(): Promise<void> {
  const detail =
    "This runs in a terminal:\n\n" +
    `  copilot plugin marketplace add ${MARKETPLACE_SPEC}\n\n` +
    "You need the **Copilot CLI** on your PATH (`npm install -g @github/copilot`). " +
    "After registration, install plugins with `copilot plugin install <plugin>@awesome-copilot` — " +
    "browse names and docs on the Awesome Copilot website or GitHub repo.\n\n" +
    "This extension does not bundle the catalog; it only wires the CLI marketplace the way upstream documents.";

  const pick = await vscode.window.showInformationMessage(
    "Register Awesome Copilot plugin marketplace (Copilot CLI)",
    { modal: true, detail },
    "Continue",
    "Install Copilot CLI first",
    "Cancel"
  );
  if (pick === "Install Copilot CLI first") {
    await vscode.commands.executeCommand("GitHubCopilotToolBox.enableCopilotCli");
    return;
  }
  if (pick !== "Continue") {
    return;
  }

  const term = vscode.window.createTerminal({ name: "Awesome Copilot marketplace" });
  term.show(true);
  const isWin = os.platform() === "win32";
  const script = isWin
    ? `Write-Host "Registering Copilot CLI marketplace: ${MARKETPLACE_SPEC}"; copilot plugin marketplace add ${MARKETPLACE_SPEC}`
    : `echo "Registering Copilot CLI marketplace: ${MARKETPLACE_SPEC}" && copilot plugin marketplace add ${MARKETPLACE_SPEC}`;
  term.sendText(script, true);

  const after = await vscode.window.showInformationMessage(
    "Terminal started: register Awesome Copilot marketplace. When it succeeds, use the catalog site to choose a plugin name, then install with copilot plugin install.",
    "Browse catalog (website)",
    "Open GitHub repo",
    "OK"
  );
  if (after === "Browse catalog (website)") {
    await vscode.env.openExternal(vscode.Uri.parse(AWESOME_COPILOT_WEBSITE));
  } else if (after === "Open GitHub repo") {
    await vscode.env.openExternal(vscode.Uri.parse(AWESOME_COPILOT_GITHUB));
  }
}
