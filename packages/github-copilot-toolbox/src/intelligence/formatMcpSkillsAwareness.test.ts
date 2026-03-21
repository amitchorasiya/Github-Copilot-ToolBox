import { describe, expect, it } from "vitest";
import type { HubPayload } from "../webview/mcpSkillsHubView";
import {
  formatMcpSkillsAwarenessMarkdown,
  formatMcpSkillsCopilotInstructionsBlock,
} from "./formatMcpSkillsAwareness";

describe("formatMcpSkillsAwarenessMarkdown", () => {
  it("includes MCP tables and skill lists", () => {
    const payload: HubPayload = {
      workspaceName: "demo",
      workspaceServers: [{ id: "s1", kind: "stdio", detail: "node x.js", scope: "workspace" }],
      userServers: [],
      workspaceMcp: "ok",
      userMcp: "empty",
      skills: [
        {
          id: "w:/a",
          name: "my-skill",
          description: "Does things",
          rootPath: "/ws/.agents/skills/my-skill",
          skillMdPath: "/ws/.agents/skills/my-skill/SKILL.md",
          scope: "workspace",
        },
      ],
      kit: [],
      autoScanMcpSkillsOnWorkspaceOpen: false,
    };
    const md = formatMcpSkillsAwarenessMarkdown(payload, {
      userMcpPath: "/home/u/mcp.json",
      workspaceMcpPath: "/ws/.vscode/mcp.json",
      workspaceName: "demo",
    });
    expect(md).toContain("s1");
    expect(md).toContain("stdio");
    expect(md).toContain("my-skill");
    expect(md).toContain("Agent");
    expect(md).toContain("does not automatically load");
  });
});

describe("formatMcpSkillsCopilotInstructionsBlock", () => {
  it("includes compact MCP tables and skills", () => {
    const payload: HubPayload = {
      workspaceName: "demo",
      workspaceServers: [{ id: "s1", kind: "stdio", detail: "node x.js", scope: "workspace" }],
      userServers: [],
      workspaceMcp: "ok",
      userMcp: "empty",
      skills: [
        {
          id: "w:/a",
          name: "my-skill",
          description: "Does things",
          rootPath: "/ws/.agents/skills/my-skill",
          skillMdPath: "/ws/.agents/skills/my-skill/SKILL.md",
          scope: "workspace",
        },
      ],
      kit: [],
      autoScanMcpSkillsOnWorkspaceOpen: false,
    };
    const md = formatMcpSkillsCopilotInstructionsBlock(payload, {
      userMcpPath: "/home/u/mcp.json",
      workspaceMcpPath: "/ws/.vscode/mcp.json",
      workspaceName: "demo",
    });
    expect(md).toContain("s1");
    expect(md).toContain("my-skill");
    expect(md).toContain("MCP & Skills awareness");
  });
});
