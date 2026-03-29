# Changelog

## 1.0.15

- **Docs & site:** Refreshed hub screenshots; **`?v=1.0.15`** cache-bust on **GitHub Pages** (`docs/index.html`), **monorepo README**, and **extension README** image URLs. **`docs/screenshots/`** synced from repo-root **`screenshots/`** for same-origin Pages assets. **`site.css?v=26`**.

## 1.0.14

- **Hub:** New main tab **⭐ Awesomeness** — [Awesome Copilot](https://github.com/github/awesome-copilot) without duplicating the catalog: **Copy prompt for Chat** (clipboard starter for GitHub Copilot Chat), **Build context pack** / **Open Chat**, **Copilot CLI** row (install, register marketplace, open CLI session), **Browse** (catalog site + GitHub). Search box filters these actions. Command **Copy Awesome Copilot prompt for Copilot Chat** (`GitHubCopilotToolBox.copyAwesomeCopilotChatPrompt`). Webview **openExternal** for catalog links.

## 1.0.13

- **Awesome Copilot (Copilot CLI):** New command and Intelligence hub tile **Register Awesome Copilot marketplace** — runs `copilot plugin marketplace add github/awesome-copilot` in a terminal (per [github/awesome-copilot](https://github.com/github/awesome-copilot)); does **not** mirror agents/skills. Toast links [awesome-copilot.github.com](https://awesome-copilot.github.com) and the repo. Modal offers **Install Copilot CLI first** when the `copilot` command is missing.

## 1.0.12

- **Hub (MCP & skills webview):** Main tabs (**Intelligence** / **MCP** / **Skills** / **Workspace**) use **segmented-button** styling — visible **borders**, **shadow**, **font-weight 600**, **focus-visible** rings, **`title`** tooltips, and a one-line **hint** above the row (“Click a tab…”). **Browse** / **Installed** sub-tabs match with stronger pills and tooltips. Tabs show **emoji** in the label plus a **distinct tint per section** (VS Code chart colors on active/hover); **`aria-label`** stays the plain section name.
- **Secondary sidebar:** **`viewsContainers.secondarySidebar`** title shortened to **Copilot Toolbox** (matches Activity Bar; avoids the long Marketplace-style string in that chrome). README and **GitHub Pages** (`docs/`) updated to describe the hub UI and sidebar label.

## 1.0.11

- **Docs & site:** Root **README** and extension **README** — **`docs/`** table row, repo tree comment, and **GitHub Pages** blurb (**Light/Dark** → **`localStorage`** key **`cpltb_theme_v1`**). **`docs/index.html`** — hero line that theme is **browser-only**; clearer **`aria-label`** on the theme switch; **`site.css?v=23`**; screenshot **`?v=1.0.11`**; footer **1.0.11**.

## 1.0.10

- **Packaging (VSIX):** Removed **`minimatch`** override for **`@vscode/vsce`**. **`minimatch@10`** is not drop-in compatible with **`vsce`’s** compiled **`require("minimatch")`** (expects the v3 default export); that caused **`(0, minimatch_1.default) is not a function`** during **`npx vsce package`**. **`glob` → `brace-expansion@5.0.5`** and **`picomatch@2.3.2`** overrides remain. **`vsce`** still pulls **`minimatch@3`** / **`brace-expansion@1`** as dev-only transitive deps (separate Snyk posture if you scan dev trees).
- **Docs & site:** Root **README**, extension **README**, and **[GitHub Pages](https://copilottoolbox.layai.co)** (`docs/index.html`) — **Activity Bar** copy updated for the **twin-lobe brain** outline (scale vs. built-in icons). **Project site** (`docs/index.html`): theme persistence uses **`localStorage` key `cpltb_theme_v1`** (short neutral literal — Snyk Code no longer flags a false “hardcoded secret”; the old dashed key looked like a token to heuristics). **Screenshot** cache-bust **`?v=1.0.10`**; footer **1.0.10** · **Security & privacy** (monorepo README): note on **npm `overrides`** for vulnerable transitive dev deps.

## 1.0.9

- **Dependencies (Snyk):** `npm` **`overrides`** — **`picomatch@2.3.2`**, **`glob` → `brace-expansion@5.0.5`**, **`@vscode/vsce` → `minimatch@10.2.4`** — addresses Snyk-reported issues in transitive dev deps. **`docs/index.html`:** build `localStorage` key from two string parts so Snyk Code does not treat the theme key as a hardcoded secret.
- **Activity Bar icon:** **`resources/activity-bar-icon.svg`** is a **twin-lobe brain** outline (top fissure, sulcus/gyri). **`viewBox`** is cropped to **~17.6²** user units (near-max zoom vs **0 0 24 24**); stroke **~1.3**. Still **`currentColor`**.
- **Copilot CLI install terminal (Windows):** **`startCopilotCliGlobalInstallTerminal`** no longer uses `$(npm config get prefix)/bin` (Unix-only). After `npm install -g @github/copilot`, it prints **`npm bin -g`** on all platforms. On **Windows** the command is **PowerShell**-friendly (`Write-Host`, `if ($?)`) — matches VS Code’s default terminal; **cmd.exe** users can run `npm bin -g` manually if needed.

## 1.0.8

- **Activity Bar / secondary sidebar icon:** Added **`resources/activity-bar-icon.svg`** — monochrome **`currentColor`** toolbox glyph (24×24). `viewsContainers` now use it instead of **`resources/icon.svg`**, which used multi-color gradients and often rendered as **blank gray placeholders** in the Activity Bar.

## 1.0.7

- **Open Copilot CLI session:** Document why automation looks broken: **`executeCommand` usually does not throw** when Copilot leaves Chat on **Local**, so the extension cannot verify success. **Open Copilot CLI in Chat** now checks **`getCommands(true)`** for `github.copilot.cli.newSession` / `newSessionToSide`, waits **1200ms** after focusing Chat, runs **one** of those commands (no bogus `break` after a silent no-op), and shows **detail** + **Open backgroundAgent setting** when explaining manual steps.

## 1.0.6

- **Copilot CLI in Chat (Local vs Copilot CLI):** Opening a CLI session now **focuses Copilot Chat first** (`openCopilotChat`), waits briefly, then runs **`github.copilot.cli.newSession`** with **`newSessionToSide`** fallback. New command and hub tile **Open Copilot CLI session in Chat** (`GitHubCopilotToolBox.openCopilotCliChatSession`) shows a short hint: the footer **Local** menu is the session type; the **# GitHub Copilot Toolbox — Intelligence** chip is only attached context. One Click completion notes repeat that when CLI+Chat steps run.

## 1.0.5

- **One Click → Copilot CLI + Chat (VS Code):** **`installCopilotCliGlobalDuringOneClick`** now defaults to **on** (runs `npm install -g @github/copilot`); install terminal prints **`$(npm config get prefix)/bin`** so you can fix `copilot: command not found` by adding that folder to PATH. Also sets **`github.copilot.chat.backgroundAgent.enabled`**; after settings + install, runs **`github.copilot.cli.newSession`** when available so Chat opens in the **Copilot CLI / background-agent** flow (placeholder about running tasks with the CLI). **Skip Copilot CLI + Chat (this run only)** still skips settings, npm, and that command.
- **Copilot Chat settings apply:** Treat success as **writes completed without exception**; inspect-based lines are **warnings** in notes instead of failing the whole step (reduces false “failure” when User JSON did update).

## 1.0.4

- **Copilot CLI + Chat settings:** Writes `github.copilot.chat.*` using **`workspace.getConfiguration("github.copilot.chat").update(..., Global)`** (same as the Claude agent toggle). Full-key `getConfiguration().update("github.copilot.chat.terminalChatLocation", …)` often **does not persist** Copilot-contributed keys in User `settings.json`. After writes, verifies **User** scope via `inspect().globalValue` for `cli.branchSupport.enabled` and `cli.sessionController.enabled` (workspace `.vscode/settings.json` can override effective values). Install/configure flow adds **Open User settings.json** on failure and success.

## 1.0.3

- **Copilot CLI:** New command and hub tile **Install Copilot CLI + Chat** (`GitHubCopilotToolBox.enableCopilotCli`). Opens a terminal running `npm install -g @github/copilot` (official CLI) and sets User **`github.copilot.chat.terminalChatLocation`** (`chatView`), **`github.copilot.chat.cli.branchSupport.enabled`**, and **`github.copilot.chat.cli.sessionController.enabled`** (current Copilot Chat keys; the older **`cli.customAgents.enabled`** setting was removed upstream). Success toast offers **Reload Window**. Requires Node 22+ and a Copilot subscription per GitHub docs.
- **One Click Setup:** Optional **Copilot CLI + Chat** — **`copilot-toolbox.oneClickSetup.enableCopilotCliChatSettings`** (default **on**) applies the same User `github.copilot.chat` keys as the command above (no terminal). **`copilot-toolbox.oneClickSetup.installCopilotCliGlobalDuringOneClick`** (default **off**) starts `npm install -g @github/copilot` in a terminal during One Click. The confirmation dialog and One Click Setup — Follow-ups describe both toggles. The One Click modal adds **Skip Copilot CLI + Chat (this run only)** to omit those steps once without editing settings.

## 1.0.2

- **GitHub Pages / marketing site:** Hero and gallery images now load from **same-origin** paths under **`docs/screenshots/`** instead of hotlinking **`raw.githubusercontent.com`**, which was blocked for some visitors (strict `Content-Security-Policy`, privacy tools, or Safari). Copy PNGs from repo-root `screenshots/` into `docs/screenshots/` when you refresh captures.

## 1.0.1

- **Branding:** Marketplace **displayName**, settings group title, secondary sidebar label, READMEs, and GitHub Pages use **Github Copilot ToolBox (MCP, Skills, Cursor/Claude → Copilot)**. Debug config label shortened to **Run Extension: Github Copilot ToolBox**.
- **Docs / site:** Root and extension READMEs link the **GitHub Pages** site and **1.0.1**; landing page meta, pillars, and One Click copy describe **dual migration tracks** (Cursor + Claude Code); footer shows extension **1.0.1**.

## 1.0.0

- **Release:** Stable **1.0** milestone. Same capability set as **0.5.44** (Intelligence hub, Cursor + Claude Code migration tracks, One Click Setup, Thinking Machine Mode, MCP & skills); version line marks general availability under semver **1.x**.

## 0.5.44

- **Docs:** Refreshed **Intelligence** screenshot `screenshots/01-intelligence-cursor-to-vscode-copilot.png` (Cursor + Claude Code hub rows). README cache-bust and marketing site image query updated.

## 0.5.43

- **Intelligence hub:** New section **Claude Code → VS Code & Copilot** (below Cursor): merge **CLAUDE.md**, **port workspace .mcp.json**, **migrate .claude/skills → .agents**, and **memory bank** (same bundled init as Cursor row). New palette commands **`migrateSkillsClaudeToAgents`** and **`portClaudeProjectMcp`**.

## 0.5.42

- **One Click Setup — dual migration tracks:** **`runCursorToCopilotTrack`** and **`runClaudeCodeToCopilotTrack`** (both default **on**); Intelligence hub shows matching checkboxes. Cursor steps run only when the Cursor track is on; **memory bank `--cursor-rules`** only when that track is on.
- **One Click — Claude Code:** **`mergeClaudeMdMode`** (default **apply**) merges **`CLAUDE.md`** into `.github/copilot-instructions.md` (replaceable block); optional **`mergeClaudeLocalMd`**; **`migrateClaudeSkillsTarget`** (default **workspace**) migrates **`.claude/skills` → `.agents/skills`**; **`portClaudeCodeMcp`** merges workspace **`.mcp.json`** into user or workspace VS Code **`mcp.json`** (no-op if missing). Command **Merge CLAUDE.md → Copilot instructions**.
- **Pipeline order:** Cursor bridges first, then Claude Code steps, then shared memory bank init and follow-ups. **Append `.cursorrules`** no longer opens an editor when run from One Click (silent write).

## 0.5.41

- **Thinking Machine Mode:** Turning the mode **on** (hub or Settings), after **Engage** or when already acknowledged, now runs **MCP & Skills awareness** when **During Thinking Machine priming: run MCP & Skills awareness** is on — so `.github/copilot-toolbox-mcp-skills-awareness.md` is recreated without relying only on workspace reopen or **Scan now**.

## 0.5.40

- Patch version bump.

## 0.5.39

- **One Click Setup:** MCP port, memory bank init, and Cursor rules → Copilot now use the **bundled CLIs** (`node …/cli.mjs` in the Toolbox terminal), not **npx**. Missing `node_modules` bridges surface as completion notes instead of extra error modals. Hub copy and the confirmation dialog mention bundled / no npx.

## 0.5.38

- **Hub:** One Click Setup is a **single** pill-style primary button (no duplicate label + button). **Intelligence** cards use a **25px spacer** (checkbox column width) so One Click text lines up with Thinking Machine Mode; icon columns are both **46px**; title pills use matching vertical padding.

## 0.5.37

- **Thinking Machine Mode:** Unchecking **Enabled** (hub or Settings) clears the **Engage** acknowledgment so checking it again shows the **initialize neural link?** dialog, not only the first time ever.

## 0.5.36

- **Hub (Intelligence):** **One Click Setup** uses the same kind of highlighted card as Thinking Machine (⚡ + ✨ glyph, pill title, link-tinted border/glow, primary button + settings gear). Tightened spacing below the section tabs and removed the old top rule on that row so it sits closer to the tabs.

## 0.5.35

- **Hub:** Replaced the bottom **Skills / MCP paths** footer with the **background MCP & Skills auto-scan** row (checkbox + **Scan now**); it stays at the foot of the panel on the **Intelligence** tab. One Click + Thinking Machine stay at the top.

## 0.5.34

- **Hub:** Removed the duplicate **Claude cloud agent (Copilot Chat)** callout and hygiene tile from Context hygiene; **Enable Claude agent** / **Claude agent prerequisites** remain under Thinking Machine Mode tiles and the Command Palette.

## 0.5.33

- **Hub:** Thinking Machine Mode card shows a large **🧠** + **⚡** glyph with accent glow and light motion (respects reduced-motion).

## 0.5.32

- **Hub:** **Thinking Machine Mode** block on the Intelligence page uses stronger visual emphasis (accent card, pill title, glow) so it reads as a primary control.

## 0.5.31

- **Hub:** First tab label is **Intelligence** again (only the tab; settings and “Thinking Machine Mode” wording elsewhere unchanged).
- **Thinking Machine Mode:** Turning **Enabled** on (Settings or hub) now sets the other Thinking Machine Mode checkboxes to **on** at the same scope (after **Engage** on first enable).

## 0.5.30

- **Hub:** **Thinking Machine Mode** is a **checkbox** directly under **One Click Setup** (same master switch as settings). Turning it on uses the normal config path so the **Engage** / neural-link modal still runs on first enable; ⚙ opens all Thinking Machine settings.
- **Settings UI:** **Thinking Machine Mode** section moved to **order 155** (below all **One Click Setup** groups, above Legacy). Master switch property uses display **title** “Thinking Machine Mode”.

## 0.5.29

- **Thinking Machine Mode:** New settings section (master switch, priming options, optional separate context-pack defaults) and **Engage** confirmation the first time the mode is enabled (dismiss reverts the toggle). Command Palette: **prime session** (`runThinkingMachinePriming`) and **open Thinking Machine settings**; hub tab renamed from **Intelligence** to **Thinking Machine** with **Prime session** and split settings tiles (Thinking Machine vs context pack defaults).
- **MCP & Skills — background sync:** `copilot-toolbox.intelligence.autoScanMcpSkillsOnWorkspaceOpen` moved to its own settings group at the bottom; default is now **on**. One-time informational toast after upgrade; open **MCP & Skills — background sync** to change it.
- **Palette:** Former **Intelligence —** command titles now use **Thinking Machine Mode —** where applicable.

## 0.5.28

- **Without npx / bundled CLIs:** Stopped using **`process.execPath`** as the interpreter — in VS Code that path is **Code Helper (Plugin)** (Electron), not Node, so running `cli.mjs` caused **`zsh: trace trap`** / crash. Commands now use **`node` from the integrated terminal’s PATH** (same as npx). Optional setting **`copilot-toolbox.embeddedBridgeNodeExecutable`** overrides with an absolute path when `node` is not on PATH.

## 0.5.27

- **Without npx / bundled CLIs in the VSIX:** Removed **`node_modules/**`** from `.vscodeignore`. vsce applies ignore rules to **production dependency** file paths too (`node_modules/<pkg>/…`), so that line was excluding the three bridge packages from the published extension — `require.resolve` then failed at runtime. Production `npm list` paths are still the only `node_modules` trees packed (root glob skips nested `node_modules`).
- **Resolution fallback:** Embedded CLI lookup also tries **`extensionPath/node_modules/<name>`** when `createRequire(__filename)` fails.

## 0.5.26

- **Without npx = real bridges:** Hub **Without npx** and matching palette commands now run the same **cursor-mcp-to-github-copilot-port**, **github-copilot-memory-bank**, and **cursor-rules-to-github-copilot** CLIs as **bundled npm dependencies** (`node …/cli.mjs` in the **GitHub Copilot Toolbox** terminal), with the same quick picks as the npx flows — no manual merge or “open README” hand-waving.
- **Hub:** Removed per-bridge **GitHub** buttons from Cursor→VS Code & Copilot hero cards (skills row unchanged). **Toolbox CLI repos** palette/hygiene command unchanged.
- **Dependencies:** Extension ships production `dependencies` for those three packages so the VSIX resolves CLIs at runtime (vsce still installs listed dependencies when packaging).
- **MCP port (npx + bundled):** When **User mcp.json** is chosen, **Port Cursor MCP** now respects **`copilot-toolbox.useInsidersPaths`** (`-t insiders` vs `-t user`).

## 0.5.25

- **Intelligence bridge cards:** Third action on each Cursor→Copilot hero — **Without npx** (MCP manual merge, memory bank README + files, rules reveal + instruction picker + Output notes) and **Open folders** for skills (migration already avoids npx). Matching palette commands and **Workspace** tab Intelligence tiles added.

## 0.5.24

- **One Click MCP port default:** `copilot-toolbox.oneClickSetup.portCursorMcp` now defaults to **`user`** (write **user mcp.json** for all workspaces) instead of workspace merge. Settings enum order lists **user** first. The **Port Cursor MCP** command quick pick lists **User mcp.json** first for consistency.

## 0.5.23

- **One Click confirmation:** Removed the extra **Cancel** action item — VS Code modal `showWarningMessage` already supplies cancel/dismiss, so listing `"Cancel"` produced two identical buttons.

## 0.5.22

- **Claude cloud agent (Copilot Chat):** New Intelligence hub **callout** (Enable + Prerequisites), hygiene tile, and Command Palette commands to set **github.copilot.chat.claudeAgent.enabled** (User) and show a modal with plan/org/GitHub/VS Code prerequisites (links to [third-party agents](https://code.visualstudio.com/docs/copilot/agents/third-party-agents) docs). **One Click Setup** can run the same toggle via **`copilot-toolbox.oneClickSetup.enableClaudeCopilotChatAgent`** (default **on**); the One Click confirmation dialog mentions org Partner Agents and the Cloud → Claude flow.

## 0.5.21

- **One Click defaults (Memory Bank + rules):** Settings UI lists **apply** first for `initMemoryBankMode` and `syncCursorRulesMode` (defaults unchanged: **apply**). Descriptions call out defaults explicitly. **`initMemoryBankCursorRules`** now defaults to **on** (matches `appendCursorrules` default **on**); runtime fallback in One Click updated to **true** when the key is unset.

## 0.5.20

- **Fix extension activation:** Re-register **legacy One Click** settings (`initMemoryBank`, `initMemoryBankDryRun`, `initMemoryBankForce`, `syncCursorRules`, `syncCursorRulesDryRun`, `migrateSkills`, `migrateSkillsScope`, `turnOnAutoScanAfter`, `mergeInstructionsWithoutAutoScan`) under `contributes.configuration`. VS Code rejects `configuration.update` for unknown keys, so migration from pre-0.5.15 booleans failed with *“initMemoryBank is not a registered configuration”* and the extension never activated.

## 0.5.19

- **Hub stuck on loading / moving progress bar:** The webview now **always posts `ready`** in a `finally` block so the host can finish loading even if boot `render()` throws. DOM wiring guards **`#q` / `#scroll`** and uses **`qTrim()`** so a missing search box cannot kill the script. **`gatherHubPayload`** is wrapped in a **12s timeout** and hub refreshes are **serialized** (no parallel payload builds). Removed the eager `_postState()` on view resolve that could race before the webview had attached its message listener.

## 0.5.18

- **MCP & skills hub blank panel:** Initial paint now calls `render()` so **Loading…** shows immediately; **CSS** uses `min-height: 100vh` on `body` and a **minimum height** on the scroll region so sidebar webviews (e.g. secondary sidebar beside Chat) do not collapse the main content to **0px**. If building hub payload throws, the hub still receives **safe defaults** and shows a **warning callout** instead of staying empty.

## 0.5.17

- **Dedupe UX:** Removed the **Guide & tools** side bar tree (commands stay in the Command Palette and **MCP & skills** hub). **Workspace kit** “wizard” row and hub kit row now run **One Click Setup** (settings row on Workspace page opens One Click settings).
- **Workspace wizard command** (`workspaceSetupWizard`) now explains and offers **Run One Click Setup** / **Open One Click settings** instead of duplicating the old four-step flow.
- **GitHub CLI repos:** One palette command **open Intelligence Toolbox repo on GitHub…** (`openIntelligenceToolboxRepos`) with a quick pick; hub **Intelligence** has a single **Toolbox CLI repos** tile; bridge cards’ **GitHub** buttons open the matching repo directly. Legacy commands `openIntelligenceRepoMcpPort` / `MemoryBank` / `RulesConverter` still work for scripts and `executeCommand`.
- **MCP hub chips:** Dropped the extra **@mcp registry** chip (use **Registry** for VS Code’s native browse). **`mcpBrowseRegistry`** remains in the palette.

## 0.5.16

- **MCP & Skills awareness — save, don’t auto-open:** Each scan **overwrites** `.github/copilot-toolbox-mcp-skills-awareness.md`. The replaceable MCP/skills block in `.github/copilot-instructions.md` is updated when the scan is **interactive** (e.g. **Scan now**), when **auto-scan on workspace open** is enabled, or when **One Click** requests a one-time merge. No preview editor unless you choose **Open report** on the toast (silent auto-scan stays quiet).
- **Copilot routing hints:** The awareness report and the `copilot-instructions` block now tell Copilot to **match user tasks to configured MCP server ids** (e.g. Confluence work → Confluence/Atlassian MCP) and to use **Agent + MCP** for live tools.
- **Hub / settings copy** updated to describe auto-save and reopen behavior.

## 0.5.15

- **One Click Setup settings — sections:** Configuration is split into titled groups in Settings: **One Click Setup — General**, **Memory Bank**, **Rules**, **Skills**, **MCP**, and **Follow-ups** (plus the main **GitHub Copilot Toolbox** section for npx / Intelligence / translate).
- **Mutually exclusive options → enums:** Replaced overlapping checkboxes with single-select string settings: **`initMemoryBankMode`** (off / dryRun / apply / applyForce), **`syncCursorRulesMode`** (off / dryRun / apply), **`migrateSkillsTarget`** (off / workspace / user / both), **`instructionMergeAfterOneClick`** (enable auto-scan vs one-time copilot-instructions merge vs leave unchanged). VS Code shows these as one-choice controls (dropdown / single-select; not separate conflicting toggles).
- **Migration:** On activate, existing `copilot-toolbox.oneClickSetup.*` boolean pairs (and legacy `GitHubCopilotToolBox.*` copies) are converted to the new keys and old keys removed where applicable.

## 0.5.14

- **Settings keys:** Contributed configuration now uses the prefix **`copilot-toolbox.*`** instead of **`GitHubCopilotToolBox.*`**, so the Settings UI no longer humanizes the segment as **“Github …”**. On activate, existing **`GitHubCopilotToolBox.*`** values are copied into the new keys and removed from User/Workspace (same defaults). **Commands** remain **`GitHubCopilotToolBox.*`**.
- **One Click — Init Memory Bank Force:** Description clarifies default **off** matches the interactive init when you choose **No** / skip if templates already exist; **on** adds **`--force`** (overwrite).
- **Hub — One Click row:** **⚙** is **larger** and placed to the **right** of the **One Click Setup** button.
- **Secondary sidebar** container title: **GitHub Copilot ToolBox** → **GitHub Copilot Toolbox**.

## 0.5.13

- **Intelligence — One Click Setup:** Hub row with **⚙** (opens **One Click Setup** settings) and **One Click Setup** button. Modal confirms you accept responsibility; then runs configurable steps: optional skills migrate, memory-bank init, Cursor rules sync, `.cursorrules` append, Cursor MCP port (workspace merge/overwrite/user/dry/skip), optional turn-on **auto-scan** (respects **workspace vs user** settings scope), MCP & Skills awareness, readiness, config scan, optional first test task. New commands `runOneClickSetup` / `openOneClickSetupSettings`; Guide entries. **Auto-scan checkbox** now writes **Workspace** settings when a folder is open (was always User). Refactors: non-interactive npx helpers for port / rules / memory bank.

## 0.5.12

- **Docs / Marketplace:** Resize **`00-copilot-toolbox-access.png`** (smaller dimensions and file size) and simplify first-image alt text so the first README image loads reliably on the Marketplace; screenshot cache `?v=0.5.12` (extension README + GitHub Pages gallery).

## 0.5.11

- **Docs:** Move **After install: open Copilot Toolbox** (with `00-Copilot Toolbox Access.png`) **above** “One place for Copilot-related setup” in root + extension README; dedupe from Screenshots section; TOC + cross-links updated.

## 0.5.10

- **Docs:** Add **`00-Copilot Toolbox Access.png`** as the first README / site screenshot with step-by-step **Activity Bar → Copilot Toolbox → Side Bar → MCP & skills**; hero and gallery updated; cache `?v=0.5.10`.

## 0.5.9

- **Docs:** README polish; **GitHub Pages** install buttons use `vscode:extension/…` with Marketplace fallback; screenshot cache query `?v=0.5.9`.

## 0.5.8

- **Legal / clarity:** Expanded **Disclaimer** in the monorepo README; added **Disclaimer** to the extension README, Marketplace `description` pointer, and GitHub Pages footer (with link to repo disclaimer). Not a substitute for legal counsel.

## 0.5.7

- **Docs:** Lead README and GitHub Pages gallery with **`02-intelligence-cursor-port.png`** (Cursor → Copilot port hero); site hero image matches.

## 0.5.6

- **Docs:** Replaced hub screenshots in `screenshots/` with higher-resolution captures (~2.5k width) for readable UI in README, Marketplace, and the GitHub Pages site; bumped site asset cache keys.

## 0.5.5

- **Docs:** README refresh (sales-focused intro, hub UI reference for every control); updated extension screenshots in `screenshots/`.

## 0.5.4

- **Branding:** Marketplace icon file is now `resources/marketplace-icon.png` (still rendered from `icon-marketplace.svg` when packaging) so the Extensions detail view picks up updates instead of a stale cached `icon.png`.

## 0.5.3

- **Branding:** Marketplace icon is generated from `resources/icon-marketplace.svg` into `resources/icon.png` during `npm run package` (vsce does not allow SVG for `icon`).

## 0.5.2

- **Skills hub:** **Turn OFF** / **Turn ON** — hides a skill in the hub (extension workspace/global state); folders stay on disk. **Delete…** still moves the folder to trash and clears any hub-off flag for that skill.
- **Awareness report & copilot-instructions block:** project/user skills that are **off** in the hub are listed separately from skills shown as on.

## 0.5.1

- **MCP hub:** **Turn OFF** / **Turn ON** — removes a server from `mcp.json` and stores its JSON in extension workspace/global state until restored; **Remove** deletes the entry from `mcp.json` and clears stash (with confirmation).
- **Skills hub:** **Delete…** — moves a skill folder to the OS trash when it lives under a known project or user skill root (same conventions as discovery).
- **Awareness report & copilot-instructions block:** active vs Toolbox-stashed (off) MCP servers shown separately.

## 0.5.0

- **Intelligence hub — Context hygiene:** snapshot (workspace/user MCP counts, `copilot-instructions.md` lines) plus actions: Copilot/MCP file scan (Output), append session notepad → `memory-bank`, SKILL.md stub, verification checklist, bundled MCP recipe merge, run first test-like task.
- **Commands:** `copilotToolboxConfigScan`, `appendNotepadToMemoryBank`, `createSkillStub`, `verificationChecklist`, `applyBundledMcpRecipe`, `runFirstWorkspaceTestTask` (see Command Palette).
- **Session notepad** path renamed to `.vscode/copilot-toolbox-notepad.md` (one-time migration from `copilot-kit-notepad.md`).
- **Legal / attribution:** `NOTICE` and description note for MIT-licensed inspiration ([everything-claude-code](https://github.com/affaan-m/everything-claude-code)); sample MCP recipe under `resources/mcp-recipes/`.
- **Readiness / MCP awareness:** optional follow-up actions after opening reports (e.g. open workspace `mcp.json`).
- **Tests:** split MCP/skills merge helpers into `mergeMcpSkillsIntoCopilotInstructionsCore.ts`; Vitest `vscode` alias stub so `npm test` works in Node.
- **Monorepo root:** `package.json` `engines` and `npm run package` for packaging from repo root (avoid `npx vsce` at root).

## 0.4.8

- Extension `README.md`: **Screenshots** section uses `raw.githubusercontent.com` URLs so the VS Code **Extensions** details view shows images (relative `screenshots/` only works from the monorepo root on GitHub).

## 0.4.7

- Packaging: `npm run package` stages the monorepo root `README.md` for the `.vsix` (image links rewritten to `raw.githubusercontent.com`), then restores the extension reference `README.md`.
- Added `@vscode/vsce` devDependency and `package:extension-readme-only` for packaging without swapping README.
- Ignore `scripts/**` in `.vscodeignore` so packaging helpers are not shipped in the VSIX.

## 0.4.6

- Previous release baseline (see git history for details).
