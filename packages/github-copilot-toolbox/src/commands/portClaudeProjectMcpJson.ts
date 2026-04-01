import * as vscode from "vscode";
import * as mcpPaths from "../mcpPaths";
import { mergeMcpServerMaps } from "../mcpMergeUtils";

export type PortProjectMcpJsonMode = "user" | "workspaceMerge" | "dry" | "skip";

const CH_LOG = "GitHub Copilot Toolbox";

type McpJsonShape = {
  servers?: Record<string, unknown>;
  [key: string]: unknown;
};

function parseServersFromProjectMcpJson(text: string): Record<string, unknown> | undefined {
  let json: unknown;
  try {
    json = JSON.parse(text) as Record<string, unknown>;
  } catch {
    return undefined;
  }
  if (!json || typeof json !== "object" || Array.isArray(json)) {
    return undefined;
  }
  const o = json as Record<string, unknown>;
  const raw = o.mcpServers ?? o.servers;
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return undefined;
  }
  return raw as Record<string, unknown>;
}

function normalizeServerMap(map: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(map)) {
    if (v && typeof v === "object" && !Array.isArray(v)) {
      out[k] = v;
    }
  }
  return out;
}

async function readMcpJsonFile(uri: vscode.Uri): Promise<McpJsonShape | undefined> {
  try {
    const buf = await vscode.workspace.fs.readFile(uri);
    const text = new TextDecoder().decode(buf);
    const json = JSON.parse(text) as McpJsonShape;
    if (!json || typeof json !== "object" || Array.isArray(json)) {
      return undefined;
    }
    return json;
  } catch {
    return undefined;
  }
}

function stringifyMcpJson(obj: McpJsonShape): Uint8Array {
  const pretty = JSON.stringify(obj, null, 2) + "\n";
  return new TextEncoder().encode(pretty);
}

/**
 * Merge MCP server definitions from workspace root `.mcp.json` (Claude Code / project style:
 * `mcpServers` or `servers`) into VS Code user or workspace `mcp.json` (`servers` only).
 */
export async function portClaudeProjectMcpJson(
  folder: vscode.WorkspaceFolder,
  mode: PortProjectMcpJsonMode,
  insiders: boolean
): Promise<{ ok: true; note?: string } | { ok: false; note: string }> {
  if (mode === "skip") {
    return { ok: true };
  }

  const projectUri = vscode.Uri.joinPath(folder.uri, ".mcp.json");
  let projectText: string;
  try {
    const buf = await vscode.workspace.fs.readFile(projectUri);
    projectText = new TextDecoder().decode(buf);
  } catch {
    return { ok: true, note: "No .mcp.json at workspace root (Claude MCP port skipped)." };
  }

  const incomingRaw = parseServersFromProjectMcpJson(projectText);
  if (!incomingRaw || Object.keys(incomingRaw).length === 0) {
    return { ok: true, note: ".mcp.json has no mcpServers/servers entries (skipped)." };
  }
  const incoming = normalizeServerMap(incomingRaw);
  if (Object.keys(incoming).length === 0) {
    return { ok: true, note: ".mcp.json server entries were empty after validation (skipped)." };
  }

  const log = vscode.window.createOutputChannel(CH_LOG);

  if (mode === "dry") {
    log.appendLine(
      `[Claude MCP port / dry-run] Would merge ${Object.keys(incoming).length} server id(s) from .mcp.json: ${Object.keys(incoming).join(", ")}`
    );
    log.show(true);
    return { ok: true, note: "Claude MCP port: dry-run logged to Output → GitHub Copilot Toolbox." };
  }

  if (mode === "user") {
    const userPath = mcpPaths.userMcpJsonPath(insiders);
    const userUri = vscode.Uri.file(userPath);
    const existing = (await readMcpJsonFile(userUri)) ?? { servers: {} };
    const destServers =
      existing.servers && typeof existing.servers === "object" && !Array.isArray(existing.servers)
        ? { ...(existing.servers as Record<string, unknown>) }
        : {};
    const nextServers = mergeMcpServerMaps(destServers, incoming);
    const merged: McpJsonShape = { ...existing, servers: nextServers };
    await vscode.workspace.fs.writeFile(userUri, stringifyMcpJson(merged));
    return { ok: true, note: `Claude MCP port: merged .mcp.json → user mcp.json (${Object.keys(incoming).length} id(s)).` };
  }

  const wsUri = mcpPaths.workspaceMcpUri(folder);
  const vscodeDir = vscode.Uri.joinPath(folder.uri, ".vscode");
  try {
    await vscode.workspace.fs.stat(vscodeDir);
  } catch {
    await vscode.workspace.fs.createDirectory(vscodeDir);
  }

  const existing = (await readMcpJsonFile(wsUri)) ?? { servers: {} };
  const destServers =
    existing.servers && typeof existing.servers === "object" && !Array.isArray(existing.servers)
      ? { ...(existing.servers as Record<string, unknown>) }
      : {};

  const nextServers = mergeMcpServerMaps(destServers, incoming);

  const merged: McpJsonShape = { ...existing, servers: nextServers };
  await vscode.workspace.fs.writeFile(wsUri, stringifyMcpJson(merged));
  return {
    ok: true,
    note: `Claude MCP port: wrote workspace .vscode/mcp.json (${Object.keys(nextServers).length} server id(s)).`,
  };
}
