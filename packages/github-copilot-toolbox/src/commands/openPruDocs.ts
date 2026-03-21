import * as vscode from "vscode";

export async function openCopilotBillingDocs(): Promise<void> {
  await vscode.env.openExternal(
    vscode.Uri.parse(
      "https://docs.github.com/en/billing/concepts/about-billing-for-github-copilot"
    )
  );
  vscode.window.showInformationMessage(
    "PRU / usage: also check github.com → Settings → Copilot (or your org admin)."
  );
}
