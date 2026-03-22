/**
 * Stages the monorepo root README as packages/github-copilot-toolbox/README.md for vsce
 * (screenshots + relative links → github.com / raw.githubusercontent.com), runs vsce package,
 * then restores the extension README from a stash file.
 */
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const EXT_ROOT = path.join(__dirname, "..");
const MONOREPO_ROOT = path.join(EXT_ROOT, "..", "..");
const STASH = path.join(__dirname, ".README.extension.md.stash");

const GITHUB_REPO = "https://github.com/amitchorasiya/Github-Copilot-ToolBox";
const RAW_MAIN =
  "https://raw.githubusercontent.com/amitchorasiya/Github-Copilot-ToolBox/main";

function transformRootReadmeForMarketplace(text, screenshotCacheVersion) {
  let s = text;
  s = s.replaceAll("](screenshots/", `](${RAW_MAIN}/screenshots/`);
  if (screenshotCacheVersion) {
    const escapedRaw = RAW_MAIN.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const re = new RegExp(
      `\\]\\(${escapedRaw}/screenshots/([^)]+\\.png)\\)`,
      "g",
    );
    s = s.replace(
      re,
      `](${RAW_MAIN}/screenshots/$1?v=${encodeURIComponent(screenshotCacheVersion)})`,
    );
  }
  s = s.replaceAll("](LICENSE)", `](${GITHUB_REPO}/blob/main/LICENSE)`);
  s = s.replaceAll(
    "](.vscode/launch.json)",
    `](${GITHUB_REPO}/blob/main/.vscode/launch.json)`,
  );
  s = s.replaceAll(
    "](.github/workflows/extension-ci.yml)",
    `](${GITHUB_REPO}/blob/main/.github/workflows/extension-ci.yml)`,
  );
  s = s.replaceAll(
    "](packages/github-copilot-toolbox/README.md)",
    `](${GITHUB_REPO}/blob/main/packages/github-copilot-toolbox/README.md)`,
  );
  s = s.replaceAll(
    "](packages/github-copilot-toolbox/LICENSE)",
    `](${GITHUB_REPO}/blob/main/packages/github-copilot-toolbox/LICENSE)`,
  );
  s = s.replaceAll(
    "](packages/github-copilot-toolbox/)",
    `](${GITHUB_REPO}/tree/main/packages/github-copilot-toolbox/)`,
  );
  s = s.replaceAll(
    "](packages/cursor-mcp-to-github-copilot-port/)",
    `](${GITHUB_REPO}/tree/main/packages/cursor-mcp-to-github-copilot-port/)`,
  );
  s = s.replaceAll("](memory-bank/)", `](${GITHUB_REPO}/tree/main/memory-bank/)`);
  return s;
}

const extensionReadme = path.join(EXT_ROOT, "README.md");
const rootReadme = path.join(MONOREPO_ROOT, "README.md");

if (!fs.existsSync(rootReadme)) {
  console.error("Missing monorepo README:", rootReadme);
  process.exit(1);
}

fs.copyFileSync(extensionReadme, STASH);
let exitCode = 0;
try {
  const { version } = JSON.parse(
    fs.readFileSync(path.join(EXT_ROOT, "package.json"), "utf8"),
  );
  const body = transformRootReadmeForMarketplace(
    fs.readFileSync(rootReadme, "utf8"),
    version,
  );
  fs.writeFileSync(extensionReadme, body, "utf8");
  // vsce only accepts PNG for `package.json` icon; keep it in sync with the SVG source of truth.
  // Use a stable distinct filename so VS Code’s extension UI does not keep showing a stale cached bitmap after updates.
  execSync(
    "npx --yes @resvg/resvg-js-cli resources/icon-marketplace.svg resources/marketplace-icon.png --fit-width 128 --fit-height 128",
    { cwd: EXT_ROOT, stdio: "inherit" },
  );
  execSync("npx vsce package", { cwd: EXT_ROOT, stdio: "inherit" });
} catch (e) {
  console.error(e);
  exitCode = typeof e?.status === "number" ? e.status : 1;
} finally {
  if (fs.existsSync(STASH)) {
    fs.copyFileSync(STASH, extensionReadme);
    fs.unlinkSync(STASH);
  }
}

process.exit(exitCode);
