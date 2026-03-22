import type { HubPayload } from "../webview/mcpSkillsHubView";

export type AwarenessPaths = {
  userMcpPath: string;
  workspaceMcpPath?: string;
  workspaceName?: string;
};

function activeMcp(rows: HubPayload["workspaceServers"]): HubPayload["workspaceServers"] {
  return rows.filter((s) => !s.disabled);
}

function disabledMcp(rows: HubPayload["workspaceServers"]): HubPayload["workspaceServers"] {
  return rows.filter((s) => s.disabled);
}

function activeSkills(skills: HubPayload["skills"]): HubPayload["skills"] {
  return skills.filter((s) => !s.disabled);
}

function hubOffSkills(skills: HubPayload["skills"]): HubPayload["skills"] {
  return skills.filter((s) => s.disabled);
}

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
    const wsActive = activeMcp(payload.workspaceServers);
    const wsOff = disabledMcp(payload.workspaceServers);
    if (wsActive.length === 0) {
      lines.push("_No active workspace servers in mcp.json._", "");
    } else {
      lines.push("| Server id | Kind | Detail |", "|-----------|------|--------|");
      for (const s of wsActive) {
        const det = s.detail.replace(/\|/g, "\\|").replace(/\n/g, " ");
        lines.push(`| ${s.id} | ${s.kind} | ${det} |`);
      }
      lines.push("");
    }
    if (wsOff.length > 0) {
      lines.push(
        "_Servers **off** (config in GitHub Copilot Toolbox until you Turn ON in the hub):_",
        ""
      );
      lines.push("| Server id | Kind | Detail |", "|-----------|------|--------|");
      for (const s of wsOff) {
        const det = s.detail.replace(/\|/g, "\\|").replace(/\n/g, " ");
        lines.push(`| ${s.id} | ${s.kind} | ${det} |`);
      }
      lines.push("");
    }
  } else {
    lines.push("_No workspace folder open — workspace `mcp.json` not scanned._", "");
  }

  lines.push("## MCP — user profile", "", mcpFileLine(payload.userMcp, paths.userMcpPath), "");

  const usActive = activeMcp(payload.userServers);
  const usOff = disabledMcp(payload.userServers);
  if (usActive.length === 0) {
    lines.push("_No active user-scoped servers in mcp.json._", "");
  } else {
    lines.push("| Server id | Kind | Detail |", "|-----------|------|--------|");
    for (const s of usActive) {
      const det = s.detail.replace(/\|/g, "\\|").replace(/\n/g, " ");
      lines.push(`| ${s.id} | ${s.kind} | ${det} |`);
    }
    lines.push("");
  }
  if (usOff.length > 0) {
    lines.push("_User servers **off** (Toolbox stash):_", "", "| Server id | Kind | Detail |", "|-----------|------|--------|");
    for (const s of usOff) {
      const det = s.detail.replace(/\|/g, "\\|").replace(/\n/g, " ");
      lines.push(`| ${s.id} | ${s.kind} | ${det} |`);
    }
    lines.push("");
  }

  lines.push("## Skills (local `SKILL.md` folders)", "");

  const wsAll = payload.skills.filter((s) => s.scope === "workspace");
  const userAll = payload.skills.filter((s) => s.scope === "user");
  const wsSkills = activeSkills(wsAll);
  const wsHubOff = hubOffSkills(wsAll);
  const userSkills = activeSkills(userAll);
  const userHubOff = hubOffSkills(userAll);

  if (wsAll.length === 0) {
    lines.push("### Project-scoped", "", "_None found (or no workspace open)._", "");
  } else {
    lines.push("### Project-scoped", "");
    if (wsSkills.length === 0) {
      lines.push("_No project skills shown as **on** in the hub (folders may still be on disk)._", "");
    } else {
      for (const s of wsSkills) {
        lines.push(`- **${s.name}** — \`${s.rootPath}\``, `  - ${s.description}`, "");
      }
    }
    if (wsHubOff.length > 0) {
      lines.push(
        "_Skills **off** in hub (still on disk; GitHub Copilot Toolbox hides them until Turn ON):_",
        ""
      );
      for (const s of wsHubOff) {
        lines.push(`- **${s.name}** — \`${s.rootPath}\``, `  - ${s.description}`, "");
      }
      lines.push("");
    }
  }

  if (userAll.length === 0) {
    lines.push("### User-scoped", "", "_None found._", "");
  } else {
    lines.push("### User-scoped", "");
    if (userSkills.length === 0) {
      lines.push("_No user skills shown as **on** in the hub (folders may still be on disk)._", "");
    } else {
      for (const s of userSkills) {
        lines.push(`- **${s.name}** — \`${s.rootPath}\``, `  - ${s.description}`, "");
      }
    }
    if (userHubOff.length > 0) {
      lines.push(
        "_User skills **off** in hub (still on disk until Turn ON in hub):_",
        ""
      );
      for (const s of userHubOff) {
        lines.push(`- **${s.name}** — \`${s.rootPath}\``, `  - ${s.description}`, "");
      }
      lines.push("");
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
    const wsA = activeMcp(payload.workspaceServers);
    const wsD = disabledMcp(payload.workspaceServers);
    if (wsA.length === 0) {
      lines.push("_No active workspace servers in mcp.json._", "");
    } else {
      lines.push("| Server id | Kind | Detail |", "|-----------|------|--------|");
      for (const s of wsA) {
        const det = s.detail.replace(/\|/g, "\\|").replace(/\n/g, " ");
        lines.push(`| ${s.id} | ${s.kind} | ${det} |`);
      }
      lines.push("");
    }
    if (wsD.length > 0) {
      lines.push("_Off (Toolbox stash):_ ", "");
      for (const s of wsD) {
        lines.push(`- **${s.id}** (${s.kind})`);
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
  const usA = activeMcp(payload.userServers);
  const usD = disabledMcp(payload.userServers);
  if (usA.length === 0) {
    lines.push("_No active user-scoped servers in mcp.json._", "");
  } else {
    lines.push("| Server id | Kind | Detail |", "|-----------|------|--------|");
    for (const s of usA) {
      const det = s.detail.replace(/\|/g, "\\|").replace(/\n/g, " ");
      lines.push(`| ${s.id} | ${s.kind} | ${det} |`);
    }
    lines.push("");
  }
  if (usD.length > 0) {
    lines.push("_Off (Toolbox stash):_ ", "");
    for (const s of usD) {
      lines.push(`- **${s.id}** (${s.kind})`);
    }
    lines.push("");
  }

  const wsAll = payload.skills.filter((s) => s.scope === "workspace");
  const userAll = payload.skills.filter((s) => s.scope === "user");
  const wsSkills = activeSkills(wsAll);
  const wsHubOff = hubOffSkills(wsAll);
  const userSkills = activeSkills(userAll);
  const userHubOff = hubOffSkills(userAll);

  lines.push("#### Project skills", "");
  if (wsAll.length === 0) {
    lines.push("_None found (or no workspace open)._", "");
  } else {
    if (wsSkills.length === 0) {
      lines.push("_All hidden in hub (Turn OFF) or none listed._", "");
    } else {
      for (const s of wsSkills) {
        lines.push(`- **${s.name}** — \`${s.rootPath}\` — ${s.description}`, "");
      }
    }
    if (wsHubOff.length > 0) {
      lines.push("_Off in hub (on disk):_ ", "");
      for (const s of wsHubOff) {
        lines.push(`- **${s.name}** — \`${s.rootPath}\``, "");
      }
      lines.push("");
    }
  }

  lines.push("#### User skills", "");
  if (userAll.length === 0) {
    lines.push("_None found._", "");
  } else {
    if (userSkills.length === 0) {
      lines.push("_All hidden in hub (Turn OFF) or none listed._", "");
    } else {
      for (const s of userSkills) {
        lines.push(`- **${s.name}** — \`${s.rootPath}\` — ${s.description}`, "");
      }
    }
    if (userHubOff.length > 0) {
      lines.push("_Off in hub (on disk):_ ", "");
      for (const s of userHubOff) {
        lines.push(`- **${s.name}** — \`${s.rootPath}\``, "");
      }
      lines.push("");
    }
  }

  return lines.join("\n");
}
