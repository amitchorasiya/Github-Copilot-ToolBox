import * as fs from "node:fs/promises";
import * as path from "node:path";

export type MergeMissingResult = { count: number; copiedRelFiles: string[] };

/**
 * Copy files from `srcDir` into `destDir` only when the destination path does not exist.
 * Creates parent directories as needed. Never overwrites an existing file.
 */
export async function mergeMissingFilesRecursive(
  srcDir: string,
  destDir: string,
  relBase = ""
): Promise<MergeMissingResult> {
  let count = 0;
  const copiedRelFiles: string[] = [];
  const entries = await fs.readdir(srcDir, { withFileTypes: true });
  for (const e of entries) {
    const s = path.join(srcDir, e.name);
    const rel = relBase ? `${relBase}/${e.name}` : e.name;
    const d = path.join(destDir, e.name);
    if (e.isDirectory()) {
      await fs.mkdir(d, { recursive: true });
      const sub = await mergeMissingFilesRecursive(s, d, rel);
      count += sub.count;
      copiedRelFiles.push(...sub.copiedRelFiles);
    } else {
      try {
        await fs.access(d);
      } catch {
        await fs.mkdir(path.dirname(d), { recursive: true });
        await fs.copyFile(s, d);
        count++;
        copiedRelFiles.push(rel);
      }
    }
  }
  return { count, copiedRelFiles };
}

/** Remove files from `srcRoot` given posix-like relative paths from that root. */
export async function removeFilesByRelPaths(srcRoot: string, relFiles: string[]): Promise<void> {
  for (const rel of relFiles) {
    const p = path.join(srcRoot, rel);
    try {
      await fs.rm(p);
    } catch {
      /* ignore */
    }
  }
}
