import { describe, expect, it } from "vitest";
import { mergeMcpServerMaps } from "./mcpMergeUtils";

describe("mergeMcpServerMaps", () => {
  it("adds new server ids", () => {
    const a = { x: { type: "stdio", command: "a" } };
    const b = { y: { type: "http" } };
    const m = mergeMcpServerMaps(a, b);
    expect(m.x).toEqual(a.x);
    expect(m.y).toEqual(b.y);
  });

  it("fills missing keys only when id exists", () => {
    const dest = { s: { type: "stdio", command: "npx" } };
    const inc = { s: { type: "stdio", args: ["-y"] } };
    const m = mergeMcpServerMaps(dest, inc);
    expect((m.s as Record<string, unknown>).command).toBe("npx");
    expect((m.s as Record<string, unknown>).args).toEqual(["-y"]);
  });

  it("does not replace existing leaf", () => {
    const dest = { s: { command: "keep" } };
    const inc = { s: { command: "new" } };
    const m = mergeMcpServerMaps(dest, inc);
    expect((m.s as Record<string, unknown>).command).toBe("keep");
  });
});
