import { describe, expect, it } from "vitest";
import { evaluateReadiness, formatReadinessMarkdown } from "./readiness";

describe("evaluateReadiness", () => {
  it("flags missing copilot instructions", () => {
    const checks = evaluateReadiness({
      copilotInstructions: { exists: false, byteLength: 0 },
      agentsMd: { exists: false, byteLength: 0 },
      instructionFilesInDotGithub: 0,
      memoryBankDirExists: false,
      workspaceMcpJson: { exists: false, byteLength: 0 },
      cursorrules: { exists: false, byteLength: 0 },
      cursorRulesDirHasFiles: false,
    });
    const ci = checks.find((c) => c.id === "copilot-instructions");
    expect(ci?.ok).toBe(false);
    expect(ci?.suggestedCommand).toBe("GitHubCopilotToolBox.workspaceSetupWizard");
  });

  it("adds mtime check when both rules exist", () => {
    const checks = evaluateReadiness({
      copilotInstructions: { exists: true, byteLength: 100, mtimeMs: 1000 },
      agentsMd: { exists: true, byteLength: 10 },
      instructionFilesInDotGithub: 1,
      memoryBankDirExists: true,
      workspaceMcpJson: { exists: true, byteLength: 5 },
      cursorrules: { exists: true, byteLength: 20, mtimeMs: 2000 },
      cursorRulesDirHasFiles: false,
    });
    expect(checks.some((c) => c.id === "cursorrules-mtime")).toBe(true);
  });
});

describe("formatReadinessMarkdown", () => {
  it("renders headings", () => {
    const md = formatReadinessMarkdown([
      { id: "x", ok: true, message: "ok", suggestedCommand: "GitHubCopilotToolBox.foo" },
    ]);
    expect(md).toContain("Intelligence readiness");
    expect(md).toContain("GitHubCopilotToolBox.foo");
  });
});
