import * as os from "node:os";
import * as vscode from "vscode";
import { appendCursorrules } from "./migrateCursorrules";
import {
  runInitMemoryBankBundledWithOptions,
  runPortCursorMcpBundledWithMode,
  runSyncCursorRulesBundledWithOptions,
} from "./bridgeWithoutNpx";
import type { PortCursorMcpMode } from "./portFromCursor";
import * as mcpPaths from "../mcpPaths";
import { showMcpSkillsAwareness } from "../intelligence/mcpSkillsAwarenessCommand";
import { showIntelligenceReadiness } from "../intelligence/readinessCommand";
import { runCopilotToolboxConfigScan } from "./copilotConfigScan";
import { runFirstWorkspaceTestTask } from "./runFirstTestTask";
import type { MigrateSkillMode } from "../skills/migrateCursorSkillsToAgents";
import {
  runClaudeSkillsMigrationForRoot,
  runMigrationForRoot,
} from "../skills/migrateCursorSkillsToAgents";
import { TOOLBOX_SETTINGS_PREFIX } from "../toolboxSettings";
import { enableClaudeCopilotChatAgent } from "./claudeCopilotAgentSettings";
import { mergeClaudeMdIntoCopilotInstructions } from "./mergeClaudeMdIntoCopilotInstructions";
import type { PortProjectMcpJsonMode } from "./portClaudeProjectMcpJson";
import { portClaudeProjectMcpJson } from "./portClaudeProjectMcpJson";

const CFG = TOOLBOX_SETTINGS_PREFIX;

function cfgScope(): vscode.ConfigurationTarget {
  const s = vscode.workspace
    .getConfiguration()
    .get<string>(`${CFG}.oneClickSetup.settingsScope`, "workspace");
  return s === "user" ? vscode.ConfigurationTarget.Global : vscode.ConfigurationTarget.Workspace;
}

function getPortMode(): PortCursorMcpMode | "skip" {
  const v = vscode.workspace
    .getConfiguration()
    .get<string>(`${CFG}.oneClickSetup.portCursorMcp`, "user");
  if (v === "skip" || v === "dry") {
    return v === "dry" ? "dry" : "skip";
  }
  if (v === "workspaceOverwrite") {
    return "force";
  }
  if (v === "user") {
    return "user";
  }
  return "merge";
}

function getClaudeProjectMcpMode(): PortProjectMcpJsonMode {
  const v = vscode.workspace
    .getConfiguration()
    .get<string>(`${CFG}.oneClickSetup.portClaudeCodeMcp`, "user");
  if (
    v === "user" ||
    v === "workspaceMerge" ||
    v === "workspaceOverwrite" ||
    v === "dry" ||
    v === "skip"
  ) {
    return v;
  }
  return "user";
}

export async function openOneClickSetupSettings(): Promise<void> {
  await vscode.commands.executeCommand("workbench.action.openSettings", `${CFG}.oneClickSetup`);
}

export async function runOneClickSetup(
  context: vscode.ExtensionContext,
  refreshHub: () => void
): Promise<void> {
  const folder = mcpPaths.getPrimaryWorkspaceFolder();
  if (!folder) {
    vscode.window.showErrorMessage("Open a workspace folder first.");
    return;
  }

  const confirm = await vscode.window.showWarningMessage(
    "One Click Setup will run the automated steps you configured (bundled Node CLIs — no npx, file merges, scans). " +
      "You are responsible for reviewing every change and your repo. Secrets or wrong targets can cause data loss. Continue?",
    {
      modal: true,
      detail:
        "By default, **both** migration tracks run: **Cursor → GitHub Copilot** and **Claude Code → GitHub Copilot** (toggle under Settings → One Click Setup — General).\n\n" +
        "Adjust sub-steps under One Click Setup (Memory Bank, Rules, Skills, Claude Code, MCP, Follow-ups).\n\n" +
        "Copilot Chat **Claude cloud agent** (optional): if enabled, sets User setting github.copilot.chat.claudeAgent.enabled. " +
        "That is separate from Claude Code repo migration and still requires plan/org/GitHub prerequisites.",
    },
    "I understand — run setup"
  );
  if (confirm !== "I understand — run setup") {
    return;
  }

  const ws = vscode.workspace.getConfiguration();
  const notes: string[] = [];
  const qm = { quietMissing: true } as const;
  const scope = cfgScope();
  const insiders = ws.get<boolean>(`${CFG}.useInsidersPaths`) === true;

  const runCursorTrack = ws.get<boolean>(`${CFG}.oneClickSetup.runCursorToCopilotTrack`, true);
  const runClaudeTrack = ws.get<boolean>(`${CFG}.oneClickSetup.runClaudeCodeToCopilotTrack`, true);

  const skillsTarget = ws.get<string>(`${CFG}.oneClickSetup.migrateSkillsTarget`, "off");
  const migrateCursor = runCursorTrack && skillsTarget !== "off";
  const migrateScope = (migrateCursor ? skillsTarget : "workspace") as "workspace" | "user" | "both";
  const migrateMode = (ws.get<string>(`${CFG}.oneClickSetup.migrateSkillsMode`, "copy") === "move"
    ? "move"
    : "copy") as MigrateSkillMode;

  const initMemoryBankMode = ws.get<string>(`${CFG}.oneClickSetup.initMemoryBankMode`, "apply");
  const initMb = initMemoryBankMode !== "off";
  const initMbDry = initMemoryBankMode === "dryRun";
  const initMbForce = initMemoryBankMode === "applyForce";
  const initMbCursor = ws.get<boolean>(`${CFG}.oneClickSetup.initMemoryBankCursorRules`, true);

  const syncCursorRulesMode = ws.get<string>(`${CFG}.oneClickSetup.syncCursorRulesMode`, "apply");
  const syncRules = runCursorTrack && syncCursorRulesMode !== "off";
  const syncRulesDry = syncCursorRulesMode === "dryRun";

  const appendCr = runCursorTrack && ws.get<boolean>(`${CFG}.oneClickSetup.appendCursorrules`, true);

  const portMode = getPortMode();
  const portCursor = runCursorTrack && portMode !== "skip";

  const mergeClaudeMdMode = ws.get<string>(`${CFG}.oneClickSetup.mergeClaudeMdMode`, "apply");
  const mergeClaude = runClaudeTrack && mergeClaudeMdMode !== "off";
  const mergeClaudeDry = mergeClaudeMdMode === "dryRun";
  const mergeClaudeLocal = ws.get<boolean>(`${CFG}.oneClickSetup.mergeClaudeLocalMd`, false);

  const claudeSkillsTarget = ws.get<string>(`${CFG}.oneClickSetup.migrateClaudeSkillsTarget`, "workspace");
  const migrateClaudeSkills = runClaudeTrack && claudeSkillsTarget !== "off";
  const claudeMigrateScope = (migrateClaudeSkills
    ? claudeSkillsTarget
    : "workspace") as "workspace" | "user" | "both";
  const claudeMigrateMode = (ws.get<string>(`${CFG}.oneClickSetup.migrateClaudeSkillsMode`, "copy") ===
  "move"
    ? "move"
    : "copy") as MigrateSkillMode;

  const claudeMcpMode = getClaudeProjectMcpMode();
  const portClaudeMcp = runClaudeTrack && claudeMcpMode !== "skip";

  const mergePolicy = ws.get<string>(
    `${CFG}.oneClickSetup.instructionMergeAfterOneClick`,
    "enableAutoScan"
  );
  const turnOnAutoScan = mergePolicy === "enableAutoScan";
  const forceInstructionMergeOnce = mergePolicy === "mergeCopilotInstructionsOnce";

  const runAwareness = ws.get<boolean>(`${CFG}.oneClickSetup.runAwarenessScan`, true);
  const runReadiness = ws.get<boolean>(`${CFG}.oneClickSetup.runReadiness`, true);
  const runScan = ws.get<boolean>(`${CFG}.oneClickSetup.runConfigScan`, true);
  const runTest = ws.get<boolean>(`${CFG}.oneClickSetup.runFirstTestTask`, false);
  const enableClaudeAgent = ws.get<boolean>(
    `${CFG}.oneClickSetup.enableClaudeCopilotChatAgent`,
    true
  );

  try {
    if (migrateCursor) {
      const bases: string[] = [];
      if (migrateScope === "workspace" || migrateScope === "both") {
        bases.push(folder.uri.fsPath);
      }
      if (migrateScope === "user" || migrateScope === "both") {
        bases.push(os.homedir());
      }
      for (const base of bases) {
        const run = await runMigrationForRoot(base, migrateMode);
        if (run.errors > 0) {
          notes.push(`Cursor skills migrate: ${run.errors} error(s) under ${run.sourceRoot}`);
        }
      }
      refreshHub();
    }

    if (syncRules) {
      const okRules = runSyncCursorRulesBundledWithOptions(folder, syncRulesDry, qm);
      if (!okRules) {
        notes.push("Cursor rules → Copilot: bundled CLI not found under extension");
      }
    }

    if (appendCr) {
      try {
        const rulesUri = vscode.Uri.joinPath(folder.uri, ".cursorrules");
        await vscode.workspace.fs.stat(rulesUri);
        await appendCursorrules({ silent: true });
      } catch {
        /* no .cursorrules — skip quietly */
      }
    }

    if (portCursor) {
      const okPort = runPortCursorMcpBundledWithMode(folder, portMode, qm);
      if (!okPort) {
        notes.push("Cursor MCP port: bundled CLI not found under extension");
      }
    }

    if (mergeClaude) {
      const r = await mergeClaudeMdIntoCopilotInstructions(folder, {
        dryRun: mergeClaudeDry,
        includeLocalMd: mergeClaudeLocal,
      });
      if (r.status === "dryRun" && r.detail) {
        notes.push(r.detail);
      } else if (r.status === "skipped" && r.detail) {
        /* quiet — only note if user might expect a write */
      }
    }

    if (migrateClaudeSkills) {
      const bases: string[] = [];
      if (claudeMigrateScope === "workspace" || claudeMigrateScope === "both") {
        bases.push(folder.uri.fsPath);
      }
      if (claudeMigrateScope === "user" || claudeMigrateScope === "both") {
        bases.push(os.homedir());
      }
      for (const base of bases) {
        const run = await runClaudeSkillsMigrationForRoot(base, claudeMigrateMode);
        if (run.errors > 0) {
          notes.push(`Claude skills migrate: ${run.errors} error(s) under ${run.sourceRoot}`);
        }
      }
      refreshHub();
    }

    if (portClaudeMcp) {
      const pr = await portClaudeProjectMcpJson(folder, claudeMcpMode, insiders);
      if (!pr.ok) {
        notes.push(pr.note);
      } else if (pr.note) {
        notes.push(pr.note);
      }
    }

    if (initMb) {
      const okMb = runInitMemoryBankBundledWithOptions(
        folder,
        {
          dryRun: initMbDry,
          cursorRules: initMbCursor && runCursorTrack,
          force: initMbForce,
        },
        qm
      );
      if (!okMb) {
        notes.push("Memory bank: bundled CLI not found under extension");
      }
    }

    if (turnOnAutoScan) {
      await ws.update(`${CFG}.intelligence.autoScanMcpSkillsOnWorkspaceOpen`, true, scope);
    }

    if (enableClaudeAgent) {
      const claude = await enableClaudeCopilotChatAgent({ silent: true });
      if (!claude.ok) {
        notes.push(claude.note);
      }
    }

    if (runAwareness) {
      await showMcpSkillsAwareness(context, {
        silentNotification: true,
        forceMergeIntoInstructions: forceInstructionMergeOnce,
      });
    }

    if (runReadiness) {
      await showIntelligenceReadiness();
    }

    if (runScan) {
      await runCopilotToolboxConfigScan();
    }

    if (runTest) {
      await runFirstWorkspaceTestTask();
    }

    refreshHub();

    const msg =
      notes.length > 0
        ? `One Click Setup finished (see terminal(s) for bundled CLIs). Notes: ${notes.join(" · ")}`
        : "One Click Setup finished. Review terminals, Output (config scan), and any opened docs.";
    await vscode.window.showInformationMessage(msg);
  } catch (e) {
    const m = e instanceof Error ? e.message : String(e);
    vscode.window.showErrorMessage(`One Click Setup failed: ${m}`);
  }
}
