import { describe, expect, it } from "vitest";
import {
  buildClaudeMdMigrationBlock,
  CLAUDE_MD_BANNER_END,
  CLAUDE_MD_BANNER_START,
  mergeClaudeMdBlockIntoInstructions,
} from "./mergeClaudeMdCore";

describe("mergeClaudeMdCore", () => {
  it("buildClaudeMdMigrationBlock wraps main and optional local", () => {
    const b = buildClaudeMdMigrationBlock("Hello", "Local only");
    expect(b).toContain(CLAUDE_MD_BANNER_START);
    expect(b).toContain(CLAUDE_MD_BANNER_END);
    expect(b).toContain("Hello");
    expect(b).toContain("CLAUDE.local.md");
    expect(b).toContain("Local only");
  });

  it("mergeClaudeMdBlockIntoInstructions creates file when empty", () => {
    const block = buildClaudeMdMigrationBlock("X", undefined);
    const out = mergeClaudeMdBlockIntoInstructions("", block);
    expect(out.startsWith("# GitHub Copilot instructions")).toBe(true);
    expect(out).toContain("X");
  });

  it("mergeClaudeMdBlockIntoInstructions replaces marked block", () => {
    const b1 = buildClaudeMdMigrationBlock("v1", undefined);
    const first = mergeClaudeMdBlockIntoInstructions("# Title\n", b1);
    const b2 = buildClaudeMdMigrationBlock("v2", undefined);
    const second = mergeClaudeMdBlockIntoInstructions(first, b2);
    expect(second).toContain("v2");
    expect(second).not.toContain("v1");
  });
});
