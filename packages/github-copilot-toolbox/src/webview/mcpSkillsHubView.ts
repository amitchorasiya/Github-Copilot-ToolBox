import * as os from "node:os";
import * as vscode from "vscode";
import * as mcpConfig from "../mcpConfig";
import * as mcpPaths from "../mcpPaths";
import { installSkillFromSkillsSh } from "../commands/installSkillFromSkillsSh";
import { installMcpFromRegistryEntry } from "../registry/mcpRegistryInstall";
import { searchMcpRegistry } from "../registry/mcpRegistryClient";
import { searchSkillsSh } from "../registry/skillsShClient";
import { collectLocalSkills, type SkillEntry } from "../skills/localSkills";
import { gatherWorkspaceKitSnapshot, type KitSnapshotRow } from "../tree/workspaceKitProvider";
import { getHubWebviewHtml } from "./hubWebviewDocument";

export type { SkillEntry };

export type McpServerRow = {
  id: string;
  kind: string;
  detail: string;
  scope: "workspace" | "user";
};

export type HubPayload = {
  workspaceName?: string;
  workspaceServers: McpServerRow[];
  userServers: McpServerRow[];
  workspaceMcp: "missing" | "empty" | "ok";
  userMcp: "missing" | "empty" | "ok";
  skills: SkillEntry[];
  kit: KitSnapshotRow[];
  /** Mirrors `GitHubCopilotToolBox.intelligence.autoScanMcpSkillsOnWorkspaceOpen`. */
  autoScanMcpSkillsOnWorkspaceOpen: boolean;
};

export async function gatherHubPayload(): Promise<HubPayload> {
  const cfg = vscode.workspace.getConfiguration();
  const insiders = cfg.get<boolean>("GitHubCopilotToolBox.useInsidersPaths") === true;
  const folder = mcpPaths.getPrimaryWorkspaceFolder();

  let workspaceServers: McpServerRow[] = [];
  let workspaceMcp: HubPayload["workspaceMcp"] = "missing";
  if (folder) {
    const uri = mcpPaths.workspaceMcpUri(folder);
    const parsed = await mcpConfig.parseMcpServers(uri);
    if (parsed === undefined) {
      workspaceMcp = "missing";
    } else if (parsed.length === 0) {
      workspaceMcp = "empty";
    } else {
      workspaceMcp = "ok";
      workspaceServers = parsed.map((s) => ({ ...s, scope: "workspace" as const }));
    }
  }

  const userUri = vscode.Uri.file(mcpPaths.userMcpJsonPath(insiders));
  const userParsed = await mcpConfig.parseMcpServers(userUri);
  let userMcp: HubPayload["userMcp"] = "missing";
  let userServers: McpServerRow[] = [];
  if (userParsed === undefined) {
    userMcp = "missing";
  } else if (userParsed.length === 0) {
    userMcp = "empty";
  } else {
    userMcp = "ok";
    userServers = userParsed.map((s) => ({ ...s, scope: "user" as const }));
  }

  const skills = await collectLocalSkills(os.homedir(), folder?.uri.fsPath);

  const kit = await gatherWorkspaceKitSnapshot();

  const autoScanMcpSkillsOnWorkspaceOpen =
    cfg.get<boolean>("GitHubCopilotToolBox.intelligence.autoScanMcpSkillsOnWorkspaceOpen") === true;

  return {
    workspaceName: folder?.name,
    workspaceServers,
    userServers,
    workspaceMcp,
    userMcp,
    skills,
    kit,
    autoScanMcpSkillsOnWorkspaceOpen,
  };
}

/** Activity bar (Copilot Toolbox) — first view */
export const MCP_SKILLS_HUB_VIEW_ACTIVITY = "copilotKitMcp";
/** Right secondary sidebar — tab next to Chat (same UI as copilot-mcp’s placement) */
export const MCP_SKILLS_HUB_VIEW_SECONDARY = "copilotKitMcpSecondary";

export class McpSkillsHubViewProvider implements vscode.WebviewViewProvider {
  /** @deprecated Use MCP_SKILLS_HUB_VIEW_ACTIVITY */
  public static readonly viewType = MCP_SKILLS_HUB_VIEW_ACTIVITY;

  private _view?: vscode.WebviewView;

  constructor(private readonly _ctx: vscode.ExtensionContext) {}

  resolveWebviewView(
    webviewView: vscode.WebviewView,
    _ctx: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ): void | Thenable<void> {
    this._view = webviewView;
    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [],
    };
    webviewView.webview.html = this._getHtml();

    webviewView.webview.onDidReceiveMessage(async (msg) => {
      switch (msg.type) {
        case "ready":
        case "refresh":
          await this._postState();
          break;
        case "runCommand":
          if (typeof msg.command === "string") {
            try {
              await vscode.commands.executeCommand(msg.command);
            } catch {
              vscode.window.showErrorMessage(`Command failed: ${msg.command}`);
            }
          }
          await this._postState();
          break;
        case "runCommandWithArgs":
          if (typeof msg.command === "string" && Array.isArray(msg.args)) {
            try {
              await vscode.commands.executeCommand(msg.command, ...(msg.args as unknown[]));
            } catch {
              vscode.window.showErrorMessage(`Command failed: ${msg.command}`);
            }
          }
          await this._postState();
          break;
        case "openFile":
          if (typeof msg.fsPath === "string") {
            const u = vscode.Uri.file(msg.fsPath);
            try {
              await vscode.window.showTextDocument(u);
            } catch {
              vscode.window.showErrorMessage(`Could not open: ${msg.fsPath}`);
            }
          }
          break;
        case "revealPath":
          if (typeof msg.fsPath === "string") {
            const u = vscode.Uri.file(msg.fsPath);
            try {
              const stat = await vscode.workspace.fs.stat(u);
              if ((stat.type & vscode.FileType.Directory) !== 0) {
                await vscode.commands.executeCommand("revealInExplorer", u);
              } else {
                await vscode.commands.executeCommand("revealFileInOS", u);
              }
            } catch {
              vscode.window.showErrorMessage(`Could not reveal: ${msg.fsPath}`);
            }
          }
          break;
        case "registrySearch": {
          const generation = typeof msg.generation === "number" ? msg.generation : 0;
          const search = typeof msg.search === "string" ? msg.search : "";
          const cursor = typeof msg.cursor === "string" ? msg.cursor : undefined;
          const append = msg.append === true;
          try {
            const { servers, metadata } = await searchMcpRegistry({
              search,
              limit: 12,
              cursor,
            });
            this._view?.webview.postMessage({
              type: "registrySearchResult",
              generation,
              append,
              servers,
              nextCursor: metadata.nextCursor,
              error: null,
            });
          } catch (e) {
            const message = e instanceof Error ? e.message : String(e);
            this._view?.webview.postMessage({
              type: "registrySearchResult",
              generation,
              append: false,
              servers: [],
              nextCursor: undefined,
              error: message,
            });
          }
          break;
        }
        case "skillSearch": {
          const generation = typeof msg.generation === "number" ? msg.generation : 0;
          const query = typeof msg.query === "string" ? msg.query : "";
          try {
            const items = await searchSkillsSh(query, { limit: 15 });
            this._view?.webview.postMessage({
              type: "skillSearchResult",
              generation,
              items,
              error: null,
            });
          } catch (e) {
            const message = e instanceof Error ? e.message : String(e);
            this._view?.webview.postMessage({
              type: "skillSearchResult",
              generation,
              items: [],
              error: message,
            });
          }
          break;
        }
        case "installMcpRegistry":
          await installMcpFromRegistryEntry(msg.entry);
          await this._postState();
          break;
        case "installSkillSh":
          if (typeof msg.source === "string" && typeof msg.skillId === "string") {
            await installSkillFromSkillsSh({
              source: msg.source,
              skillId: msg.skillId,
              global: msg.global === true,
            });
          }
          await this._postState();
          break;
        case "setAutoScanMcpSkillsOnWorkspaceOpen":
          await vscode.workspace
            .getConfiguration()
            .update(
              "GitHubCopilotToolBox.intelligence.autoScanMcpSkillsOnWorkspaceOpen",
              msg.value === true,
              vscode.ConfigurationTarget.Global
            );
          await this._postState();
          break;
        default:
          break;
      }
    });

    webviewView.onDidChangeVisibility(() => {
      if (webviewView.visible) {
        void this._postState();
      }
    });

    void this._postState();
  }

  refresh(): void {
    void this._postState();
  }

  private async _postState(): Promise<void> {
    if (!this._view) {
      return;
    }
    const payload = await gatherHubPayload();
    this._view.webview.postMessage({ type: "state", payload });
  }

  private _getHtml(): string {
    const csp = [
      "default-src 'none'",
      "style-src 'unsafe-inline'",
      "script-src 'unsafe-inline'",
    ].join("; ");
    return getHubWebviewHtml(csp);
  }
}
