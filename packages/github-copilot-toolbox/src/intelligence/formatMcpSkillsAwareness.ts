import type { HubPayload } from "../webview/mcpSkillsHubView";

export type AwarenessPaths = {
  userMcpPath: string;
  workspaceMcpPath?: string;
  workspaceName?: string;
};

function mcpFileLine(status: HubPayload["workspaceMcp"] | HubPayload["userMcp"], filePath: string): string {
  const label =
    status === "missing"
      ? "File missing"
      : status === "empty"
        ? "File exists — no servers defined"
        : "File exists — servers defined";
  return `- **${filePath}** — _${label}_`;
}

export function formatMcpSkillsAwarenessMarkdown(payload: HubPayload, paths: AwarenessPaths): string {
  const ts = new Date().toISOString();
  const lines: string[] = [
    "# GitHub Copilot Toolbox — MCP & Skills awareness",
    "",
    `_Generated: ${ts}_`,
    "",
    "## How to use this report",
    "",
    "- **MCP:** This lists **configured** servers from `mcp.json`. GitHub Copilot only has **tool access** after you open **Copilot Chat → Agent**, then **trust/start** servers in the MCP tools UI — not from this file alone.",
    "- **Skills:** These are **on-disk** folders containing `SKILL.md` under the usual project/user roots. Copilot **does not automatically load** them; open or @-attach files in chat, or fold key points into `.github/copilot-instructions.md`.",
    "- You can **paste sections of this report into Copilot Chat** as context when planning work.",
    "",
    "---",
    "",
    "## MCP — workspace",
    "",
  ];

  if (paths.workspaceMcpPath) {
    const wsLabel = payload.workspaceName ? ` _(folder: ${payload.workspaceName})_` : "";
    lines.push(`Workspace \`mcp.json\`${wsLabel}`, "", mcpFileLine(payload.workspaceMcp, paths.workspaceMcpPath), "");
    if (payload.workspaceServers.length === 0) {
      lines.push("_No workspace servers listed._", "");
    } else {
      lines.push("| Server id | Kind | Detail |", "|-----------|------|--------|");
      for (const s of payload.workspaceServers) {
        const det = s.detail.replace(/\|/g, "\\|").replace(/\n/g, " ");
        lines.push(`| ${s.id} | ${s.kind} | ${det} |`);
      }
      lines.push("");
    }
  } else {
    lines.push("_No workspace folder open — workspace `mcp.json` not scanned._", "");
  }

  lines.push("## MCP — user profile", "", mcpFileLine(payload.userMcp, paths.userMcpPath), "");

  if (payload.userServers.length === 0) {
    lines.push("_No user-scoped servers listed._", "");
  } else {
    lines.push("| Server id | Kind | Detail |", "|-----------|------|--------|");
    for (const s of payload.userServers) {
      const det = s.detail.replace(/\|/g, "\\|").replace(/\n/g, " ");
      lines.push(`| ${s.id} | ${s.kind} | ${det} |`);
    }
    lines.push("");
  }

  lines.push("## Skills (local `SKILL.md` folders)", "");

  const wsSkills = payload.skills.filter((s) => s.scope === "workspace");
  const userSkills = payload.skills.filter((s) => s.scope === "user");

  if (wsSkills.length === 0) {
    lines.push("### Project-scoped", "", "_None found (or no workspace open)._", "");
  } else {
    lines.push("### Project-scoped", "");
    for (const s of wsSkills) {
      lines.push(`- **${s.name}** — \`${s.rootPath}\``, `  - ${s.description}`, "");
    }
  }

  if (userSkills.length === 0) {
    lines.push("### User-scoped", "", "_None found._", "");
  } else {
    lines.push("### User-scoped", "");
    for (const s of userSkills) {
      lines.push(`- **${s.name}** — \`${s.rootPath}\``, `  - ${s.description}`, "");
    }
  }

  lines.push(
    "---",
    "",
    "## Suggested next steps",
    "",
    "- **MCP:** Command Palette → `MCP: List Servers` (or this extension’s hub **MCP** tab) → start/trust servers in **Copilot Chat → Agent → tools**.",
    "- **Edit config:** `MCP: Open Workspace Folder MCP Configuration` / `MCP: Open User Configuration`.",
    "- **Refresh this report:** run **Intelligence — scan MCP & Skills awareness** again after changing `mcp.json` or adding skills.",
    "",
    "_Report from GitHub Copilot Toolbox extension._",
    ""
  );

  return lines.join("\n");
}

function mcpStatusLabel(status: HubPayload["workspaceMcp"] | HubPayload["userMcp"]): string {
  if (status === "missing") {
    return "file missing";
  }
  if (status === "empty") {
    return "no servers defined";
  }
  return "servers defined";
}

/** Compact section for `.github/copilot-instructions.md` (replaceable HTML-comment block). */
export function formatMcpSkillsCopilotInstructionsBlock(
  payload: HubPayload,
  paths: AwarenessPaths
): string {
  const ts = new Date().toISOString();
  const lines: string[] = [
    "### MCP & Skills awareness (GitHub Copilot Toolbox)",
    "",
    `_Last synced: ${ts}._`,
    "",
    "- **MCP:** Use **Copilot Chat → Agent** and trust/start servers in the MCP tools UI for live tool access.",
    "- **Skills:** Folders below contain `SKILL.md`; Copilot does not auto-load them—attach files or quote excerpts in chat.",
    "",
    "#### Workspace MCP",
    "",
  ];

  if (paths.workspaceMcpPath) {
    const wsNote = payload.workspaceName ? ` _(workspace: ${payload.workspaceName})_` : "";
    lines.push(
      `- \`${paths.workspaceMcpPath}\`${wsNote} — _${mcpStatusLabel(payload.workspaceMcp)}_`,
      ""
    );
    if (payload.workspaceServers.length === 0) {
      lines.push("_No workspace servers listed._", "");
    } else {
      lines.push("| Server id | Kind | Detail |", "|-----------|------|--------|");
      for (const s of payload.workspaceServers) {
        const det = s.detail.replace(/\|/g, "\\|").replace(/\n/g, " ");
        lines.push(`| ${s.id} | ${s.kind} | ${det} |`);
      }
      lines.push("");
    }
  } else {
    lines.push("_No workspace folder open — workspace `mcp.json` not scanned._", "");
  }

  lines.push(
    "#### User MCP",
    "",
    `- \`${paths.userMcpPath}\` — _${mcpStatusLabel(payload.userMcp)}_`,
    ""
  );
  if (payload.userServers.length === 0) {
    lines.push("_No user-scoped servers listed._", "");
  } else {
    lines.push("| Server id | Kind | Detail |", "|-----------|------|--------|");
    for (const s of payload.userServers) {
      const det = s.detail.replace(/\|/g, "\\|").replace(/\n/g, " ");
      lines.push(`| ${s.id} | ${s.kind} | ${det} |`);
    }
    lines.push("");
  }

  const wsSkills = payload.skills.filter((s) => s.scope === "workspace");
  const userSkills = payload.skills.filter((s) => s.scope === "user");

  lines.push("#### Project skills", "");
  if (wsSkills.length === 0) {
    lines.push("_None found (or no workspace open)._", "");
  } else {
    for (const s of wsSkills) {
      lines.push(`- **${s.name}** — \`${s.rootPath}\` — ${s.description}`, "");
    }
  }

  lines.push("#### User skills", "");
  if (userSkills.length === 0) {
    lines.push("_None found._", "");
  } else {
    for (const s of userSkills) {
      lines.push(`- **${s.name}** — \`${s.rootPath}\` — ${s.description}`, "");
    }
  }

  return lines.join("\n");
}
