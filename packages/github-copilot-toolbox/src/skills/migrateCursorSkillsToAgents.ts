import * as fs from "node:fs/promises";
import * as path from "node:path";
import { mergeMissingFilesRecursive, removeFilesByRelPaths } from "./mergeMissingSkillFiles";

export const CURSOR_SKILLS_SEGMENTS = [".cursor", "skills"] as const;
export const CLAUDE_SKILLS_SEGMENTS = [".claude", "skills"] as const;
export const AGENTS_SKILLS_SEGMENTS = [".agents", "skills"] as const;

export function cursorSkillsDir(base: string): string {
  return path.join(base, ...CURSOR_SKILLS_SEGMENTS);
}

export function claudeSkillsDir(base: string): string {
  return path.join(base, ...CLAUDE_SKILLS_SEGMENTS);
}

export function agentsSkillsDir(base: string): string {
  return path.join(base, ...AGENTS_SKILLS_SEGMENTS);
}

/** Subfolders of `cursorSkillsRoot` that contain SKILL.md. */
export async function listCursorSkillFolders(cursorSkillsRoot: string): Promise<{ name: string; abs: string }[]> {
  const out: { name: string; abs: string }[] = [];
  try {
    const entries = await fs.readdir(cursorSkillsRoot, { withFileTypes: true });
    for (const e of entries) {
      if (!e.isDirectory()) {
        continue;
      }
      const abs = path.join(cursorSkillsRoot, e.name);
      try {
        await fs.access(path.join(abs, "SKILL.md"));
      } catch {
        continue;
      }
      out.push({ name: e.name, abs });
    }
  } catch {
    /* missing or unreadable */
  }
  return out;
}

export type MigrateSkillMode = "copy" | "move";

export type MigrateOneResult = "migrated" | "skipped" | "error";

/**
 * Copy or move one skill folder into `.agents/skills/<name>`.
 * If the destination folder already exists, **merge missing files only** (never overwrite).
 * Move mode: after a merge, only removes source files that were copied into gaps in the destination.
 */
export async function migrateOneSkillFolder(
  srcFolderAbs: string,
  agentsSkillsParent: string,
  name: string,
  mode: MigrateSkillMode
): Promise<MigrateOneResult> {
  const dest = path.join(agentsSkillsParent, name);
  let destExisted = false;
  try {
    await fs.access(dest);
    destExisted = true;
  } catch {
    /* dest does not exist — full copy */
  }
  try {
    await fs.mkdir(agentsSkillsParent, { recursive: true });
    if (destExisted) {
      const { count, copiedRelFiles } = await mergeMissingFilesRecursive(srcFolderAbs, dest);
      if (count === 0) {
        return "skipped";
      }
      if (mode === "move") {
        await removeFilesByRelPaths(srcFolderAbs, copiedRelFiles);
      }
      return "migrated";
    }
    await fs.cp(srcFolderAbs, dest, { recursive: true });
    if (mode === "move") {
      await fs.rm(srcFolderAbs, { recursive: true, force: true });
    }
    return "migrated";
  } catch {
    return "error";
  }
}

export type ScopeRun = {
  /** Source skills root that was scanned (.cursor/skills or .claude/skills). */
  sourceRoot: string;
  found: number;
  migrated: number;
  skipped: number;
  errors: number;
};

export async function runMigrationForRoot(
  baseDir: string,
  mode: MigrateSkillMode
): Promise<ScopeRun> {
  return runSkillsMigrationFromRoot(baseDir, mode, cursorSkillsDir(baseDir));
}

/** Migrate `.claude/skills` → `.agents/skills` (same semantics as Cursor migration). */
export async function runClaudeSkillsMigrationForRoot(
  baseDir: string,
  mode: MigrateSkillMode
): Promise<ScopeRun> {
  return runSkillsMigrationFromRoot(baseDir, mode, claudeSkillsDir(baseDir));
}

async function runSkillsMigrationFromRoot(
  baseDir: string,
  mode: MigrateSkillMode,
  sourceSkillsRoot: string
): Promise<ScopeRun> {
  const agentsRoot = agentsSkillsDir(baseDir);
  const folders = await listCursorSkillFolders(sourceSkillsRoot);
  let migrated = 0;
  let skipped = 0;
  let errors = 0;
  for (const f of folders) {
    const r = await migrateOneSkillFolder(f.abs, agentsRoot, f.name, mode);
    if (r === "migrated") {
      migrated++;
    } else if (r === "skipped") {
      skipped++;
    } else {
      errors++;
    }
  }
  return {
    sourceRoot: sourceSkillsRoot,
    found: folders.length,
    migrated,
    skipped,
    errors,
  };
}
