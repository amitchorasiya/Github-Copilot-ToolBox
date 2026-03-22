/** Inline HTML document for MCP & skills hub (CSP: inline style + script only). */
export function getHubWebviewHtml(csp: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta http-equiv="Content-Security-Policy" content="${csp}" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>
    :root {
      --pad: 10px;
      --r-lg: 12px;
      --r-sm: 8px;
      --border: color-mix(in srgb, var(--vscode-widget-border) 75%, transparent);
      --card: color-mix(in srgb, var(--vscode-editor-background) 82%, var(--vscode-sideBar-background));
      --card-hover: color-mix(in srgb, var(--vscode-editor-background) 70%, var(--vscode-sideBar-background));
      --accent: var(--vscode-button-background);
      --muted: var(--vscode-descriptionForeground);
      --ok: var(--vscode-testing-iconPassed, var(--vscode-charts-green));
      --warn: var(--vscode-list-warningForeground, var(--vscode-editorWarning-foreground));
    }
    * { box-sizing: border-box; }
    html, body { height: 100%; margin: 0; }
    body {
      display: flex;
      flex-direction: column;
      font-family: var(--vscode-font-family);
      font-size: 12px;
      color: var(--vscode-foreground);
      background: var(--vscode-sideBar-background);
      padding: var(--pad);
      padding-bottom: 0;
    }
    .hub-header { flex-shrink: 0; margin-bottom: 8px; }
    .pages {
      display: flex;
      gap: 2px;
      padding: 3px;
      border-radius: var(--r-lg);
      background: color-mix(in srgb, var(--vscode-input-background) 85%, transparent);
      border: 1px solid var(--border);
      margin-bottom: 8px;
    }
    .page-btn {
      flex: 1;
      border: none;
      border-radius: var(--r-sm);
      padding: 7px 6px;
      font-size: 11px;
      font-weight: 500;
      cursor: pointer;
      background: transparent;
      color: var(--vscode-foreground);
      opacity: 0.82;
    }
    .page-btn:hover { opacity: 1; background: color-mix(in srgb, var(--vscode-toolbar-hoverBackground) 60%, transparent); }
    .page-btn.active {
      opacity: 1;
      background: var(--vscode-button-background);
      color: var(--vscode-button-foreground);
    }
    .subpages {
      display: flex;
      gap: 6px;
      margin-bottom: 8px;
    }
    .sub-btn {
      padding: 5px 12px;
      border-radius: 999px;
      border: 1px solid var(--border);
      background: var(--card);
      color: inherit;
      font-size: 11px;
      cursor: pointer;
    }
    .sub-btn.active {
      border-color: var(--accent);
      background: color-mix(in srgb, var(--accent) 18%, var(--card));
    }
    .search-wrap { margin-bottom: 8px; }
    .search {
      width: 100%;
      padding: 8px 10px;
      border-radius: var(--r-sm);
      border: 1px solid var(--border);
      background: var(--vscode-input-background);
      color: var(--vscode-input-foreground);
      font: inherit;
    }
    .search::placeholder { color: var(--muted); }
    .chip-row { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 8px; }
    .chip {
      padding: 5px 10px;
      border-radius: var(--r-sm);
      border: 1px solid var(--border);
      background: var(--card);
      font-size: 10px;
      cursor: pointer;
      color: inherit;
    }
    .chip:hover { border-color: var(--vscode-focusBorder); background: var(--card-hover); }
    #scroll {
      flex: 1;
      min-height: 0;
      overflow-y: auto;
      padding-bottom: 12px;
    }
    .section-title {
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--muted);
      margin: 14px 0 8px;
    }
    .section-title:first-child { margin-top: 4px; }
    .callout {
      border-radius: var(--r-lg);
      border: 1px solid var(--border);
      padding: 12px 14px;
      background: var(--card);
      margin-bottom: 10px;
      border-left: 4px solid var(--vscode-focusBorder);
    }
    .callout h4 { margin: 0 0 6px; font-size: 13px; font-weight: 600; }
    .callout p { margin: 0 0 10px; font-size: 11px; line-height: 1.45; color: var(--muted); }
    .mcp-card, .skill-card, .kit-card {
      border-radius: var(--r-lg);
      border: 1px solid var(--border);
      background: var(--card);
      padding: 10px 12px;
      margin-bottom: 8px;
      transition: border-color 0.12s ease, background 0.12s ease;
    }
    .mcp-card:hover, .skill-card:hover, .kit-card:hover {
      border-color: color-mix(in srgb, var(--vscode-focusBorder) 65%, var(--border));
      background: var(--card-hover);
    }
    .mcp-card, .skill-card { border-left: 3px solid var(--vscode-focusBorder); }
    .mcp-card--disabled, .skill-card--disabled { opacity: 0.9; border-left-color: var(--vscode-descriptionForeground); }
    .card-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 8px; }
    .card-top h3 { margin: 0; font-size: 13px; font-weight: 600; line-height: 1.25; }
    .badge {
      font-size: 9px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      padding: 2px 7px;
      border-radius: 999px;
      background: color-mix(in srgb, var(--accent) 22%, transparent);
      color: var(--vscode-button-foreground);
      white-space: nowrap;
    }
    .meta { font-size: 10px; color: var(--muted); margin-top: 4px; word-break: break-all; }
    .desc { font-size: 11px; line-height: 1.4; margin-top: 8px; opacity: 0.95; }
    .row { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 10px; }
    .btn {
      padding: 5px 11px;
      font-size: 11px;
      border-radius: var(--r-sm);
      border: 1px solid var(--border);
      background: var(--vscode-toolbar-hoverBackground);
      color: var(--vscode-foreground);
      cursor: pointer;
      font-family: inherit;
    }
    .btn.primary {
      background: var(--vscode-button-background);
      color: var(--vscode-button-foreground);
      border-color: transparent;
    }
    .hero {
      border-radius: var(--r-lg);
      border: 1px solid var(--border);
      padding: 14px 14px 12px;
      margin-bottom: 10px;
      background: var(--card);
    }
    .hero .ic { font-size: 22px; margin-bottom: 6px; }
    .hero h3 { margin: 0 0 4px; font-size: 13px; }
    .hero p { margin: 0 0 12px; font-size: 11px; color: var(--muted); line-height: 1.4; }
    details.tool-block {
      border: 1px solid var(--border);
      border-radius: var(--r-lg);
      margin-bottom: 8px;
      background: color-mix(in srgb, var(--card) 50%, transparent);
      overflow: hidden;
    }
    details.tool-block summary {
      padding: 10px 12px;
      cursor: pointer;
      font-weight: 600;
      font-size: 11px;
      list-style: none;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    details.tool-block summary::-webkit-details-marker { display: none; }
    details.tool-block summary::after { content: "▸"; font-size: 10px; opacity: 0.5; }
    details.tool-block[open] summary::after { content: "▾"; }
    .tile-grid { padding: 0 8px 10px; display: flex; flex-direction: column; gap: 6px; }
    button.tile {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      width: 100%;
      text-align: left;
      padding: 10px 10px;
      border-radius: var(--r-sm);
      border: 1px solid var(--border);
      background: var(--card);
      cursor: pointer;
      font: inherit;
      color: inherit;
    }
    button.tile:hover { border-color: var(--vscode-focusBorder); background: var(--card-hover); }
    button.tile .ic { font-size: 17px; line-height: 1.2; flex-shrink: 0; }
    button.tile .body .t { font-weight: 600; font-size: 12px; }
    button.tile .body .d { font-size: 10px; color: var(--muted); margin-top: 3px; line-height: 1.35; }
    .kit-card .status {
      width: 8px; height: 8px; border-radius: 50%;
      margin-top: 5px;
      flex-shrink: 0;
    }
    .kit-card .status.ok { background: var(--ok); box-shadow: 0 0 0 2px color-mix(in srgb, var(--ok) 35%, transparent); }
    .kit-card .status.miss { background: var(--muted); opacity: 0.45; }
    .kit-inner { display: flex; gap: 10px; align-items: flex-start; }
    .kit-body { flex: 1; min-width: 0; }
    .kit-body .t { font-weight: 600; font-size: 12px; }
    .kit-body .p { font-size: 10px; color: var(--muted); margin-top: 3px; word-break: break-all; }
    .empty { font-size: 11px; color: var(--muted); padding: 10px 0; line-height: 1.4; }
    .hub-foot {
      flex-shrink: 0;
      font-size: 10px;
      color: var(--muted);
      line-height: 1.35;
      padding: 8px 0 4px;
      border-top: 1px solid var(--border);
      margin-top: 4px;
    }
    .hub-foot code { font-size: 9px; }
    .catalog-card { border-left-color: color-mix(in srgb, var(--vscode-charts-purple, var(--vscode-symbolIcon-classForeground)) 55%, var(--vscode-focusBorder)); }
    .intel-auto-scan {
      display: none;
      margin-bottom: 8px;
      padding: 8px 10px;
      border-radius: var(--r-sm);
      border: 1px solid var(--border);
      background: color-mix(in srgb, var(--vscode-editor-background) 88%, var(--vscode-sideBar-background));
    }
    .intel-auto-scan .auto-row {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 8px;
    }
    .intel-auto-label {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      font-size: 11px;
      line-height: 1.35;
      flex: 1;
      min-width: 140px;
      cursor: pointer;
      color: var(--vscode-foreground);
    }
    .intel-auto-label input { margin-top: 2px; flex-shrink: 0; }
    .hygiene-actions {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
      margin-bottom: 12px;
    }
    button.hygiene-tile {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      text-align: left;
      padding: 8px 10px;
      border-radius: var(--r-sm);
      border: 1px solid var(--border);
      background: var(--card);
      cursor: pointer;
      font: inherit;
      color: inherit;
    }
    button.hygiene-tile:hover { border-color: var(--vscode-focusBorder); background: var(--card-hover); }
    .hic { font-size: 16px; line-height: 1.2; flex-shrink: 0; }
    .htext { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
    .htt { font-weight: 600; font-size: 11px; }
    .htp { font-size: 9px; color: var(--muted); line-height: 1.3; }
  </style>
</head>
<body>
  <div class="hub-header">
    <nav class="pages" id="pages" aria-label="Hub sections">
      <button type="button" class="page-btn active" data-page="intel">Intelligence</button>
      <button type="button" class="page-btn" data-page="mcp">MCP</button>
      <button type="button" class="page-btn" data-page="skills">Skills</button>
      <button type="button" class="page-btn" data-page="workspace">Workspace</button>
    </nav>
    <nav class="subpages" id="subpages" aria-label="Browse or installed">
      <button type="button" class="sub-btn active" data-sub="browse">Browse</button>
      <button type="button" class="sub-btn" data-sub="installed">Installed</button>
    </nav>
    <div id="intel-auto-scan" class="intel-auto-scan" aria-label="Auto MCP and skills scan">
      <div class="auto-row">
        <label class="intel-auto-label" for="intel-auto-scan-cb">
          <input type="checkbox" id="intel-auto-scan-cb" />
          <span>When a workspace folder opens: auto-open MCP &amp; Skills awareness, refresh hub data, and update <code>.github/copilot-instructions.md</code> with a replaceable MCP/skills block (also when you run the scan with this on).</span>
        </label>
        <button type="button" class="btn primary" id="intel-scan-now">Scan now</button>
      </div>
    </div>
    <div class="search-wrap" id="search-wrap">
      <input class="search" type="search" id="q" placeholder="Search servers, skills, or tools…" />
    </div>
    <div class="chip-row" id="mcp-chips">
      <button type="button" class="chip" data-cmd="workbench.mcp.browseServers">Registry</button>
      <button type="button" class="chip" data-cmd="workbench.mcp.addConfiguration">Add server</button>
      <button type="button" class="chip" data-cmd="workbench.mcp.listServer">List (native)</button>
      <button type="button" class="chip" data-cmd="GitHubCopilotToolBox.portCursorMcp">Port Cursor → VS Code</button>
      <button type="button" class="chip" data-cmd="GitHubCopilotToolBox.mcpBrowseRegistry">@mcp registry</button>
      <button type="button" class="chip" data-cmd="dummy-refresh">Refresh</button>
    </div>
  </div>
  <div id="scroll"><div id="root"></div></div>
  <footer class="hub-foot">
    Skills: Copilot does not auto-load — use Open / Reveal; <strong>Turn OFF</strong> hides the skill in this hub (folder stays on disk) until <strong>Turn ON</strong>; <strong>Delete…</strong> moves the skill folder to trash (known roots only). MCP: <strong>Turn OFF</strong> removes the server from <code>mcp.json</code> and stashes its config in this extension until <strong>Turn ON</strong>; <strong>Remove</strong> deletes stash and/or mcp.json entry. Project skills: <code>.github/skills</code>, <code>.claude/skills</code>, <code>.agents/skills</code>, <code>.cursor/skills</code> · User: <code>~/.copilot/skills</code>, <code>~/.claude/skills</code>, <code>~/.agents/skills</code>, <code>~/.cursor/skills</code>.
  </footer>
  <script>
(function () {
  var vscode = acquireVsCodeApi();
  var state = null;
  var page = "intel";
  var sub = "browse";

  var reg = { generation: 0, servers: [], nextCursor: null, loading: false, error: null, q: "" };
  var skillRm = { generation: 0, items: [], loading: false, error: null, q: "" };
  var debReg = null;
  var debSkill = null;

  var TOOL_GROUPS = [
    {
      title: "Intelligence",
      items: [
        { ic: "\\uD83D\\uDCE6", t: "Build context pack", d: "Structured bundle for Copilot Chat (copy)", c: "GitHubCopilotToolBox.buildContextPack" },
        { ic: "\\uD83D\\uDEE1", t: "Readiness summary", d: "Check workspace + instructions + MCP wiring", c: "GitHubCopilotToolBox.showIntelligenceReadiness" },
        { ic: "\\u2699", t: "Intelligence settings", d: "Git, diagnostics, notepad defaults", c: "GitHubCopilotToolBox.openIntelligenceSettings" },
        { ic: "\\uD83D\\uDD17", t: "MCP port repo (GitHub)", d: "Github-Copilot-ToolBox", c: "GitHubCopilotToolBox.openIntelligenceRepoMcpPort" },
        { ic: "\\uD83D\\uDD17", t: "Memory bank repo (GitHub)", d: "Github-Copilot-Memory-Bank", c: "GitHubCopilotToolBox.openIntelligenceRepoMemoryBank" },
        { ic: "\\uD83D\\uDD17", t: "Rules converter repo (GitHub)", d: "Github-Copilot-Cursor-Rules-Converter", c: "GitHubCopilotToolBox.openIntelligenceRepoRulesConverter" },
        { ic: "\\uD83D\\uDCE5", t: "Migrate skills .cursor → .agents", d: "SKILL.md folders to .agents/skills (copy or move)", c: "GitHubCopilotToolBox.migrateSkillsCursorToAgents" },
        { ic: "\\uD83D\\uDD0D", t: "Scan MCP & Skills awareness", d: "Open report: configured MCP + local SKILL.md (how Copilot can use them)", c: "GitHubCopilotToolBox.showMcpSkillsAwareness" },
        { ic: "\\uD83D\\uDD0D", t: "Copilot/MCP config scan", d: "Heuristic scan → Output (mcp.json, instructions)", c: "GitHubCopilotToolBox.copilotToolboxConfigScan" },
        { ic: "\\uD83D\\uDCD3", t: "Append notepad → memory-bank", d: "Preview then write to memory-bank/**/*.md", c: "GitHubCopilotToolBox.appendNotepadToMemoryBank" },
        { ic: "\\u2728", t: "Create SKILL.md stub", d: ".github/skills/<name>/SKILL.md", c: "GitHubCopilotToolBox.createSkillStub" },
        { ic: "\\u2705", t: "Verification checklist", d: "Quick multi-pick before ship", c: "GitHubCopilotToolBox.verificationChecklist" },
        { ic: "\\uD83E\\uDDE9", t: "Apply bundled MCP recipe", d: "Merge sample server into .vscode/mcp.json", c: "GitHubCopilotToolBox.applyBundledMcpRecipe" },
        { ic: "\\u25B6", t: "Run first test task", d: "tasks.json (test-like name or first task)", c: "GitHubCopilotToolBox.runFirstWorkspaceTestTask" }
      ]
    },
    {
      title: "Chat & session",
      items: [
        { ic: "\\uD83D\\uDCAC", t: "Open Copilot Chat", d: "Focus GitHub Copilot Chat", c: "GitHubCopilotToolBox.openCopilotChat" },
        { ic: "\\uD83D\\uDCD2", t: "Session notepad", d: "Scratch space for this session", c: "GitHubCopilotToolBox.openSessionNotepad" },
        { ic: "\\uD83D\\uDCCB", t: "Copy notepad", d: "Clipboard", c: "GitHubCopilotToolBox.copySessionNotepad" },
        { ic: "\\uD83D\\uDDBC", t: "Composer tips hub", d: "Panel with chat / composer notes", c: "GitHubCopilotToolBox.openComposerHub" },
        { ic: "\\uD83D\\uDCAC", t: "Inline chat (Cursor-style)", d: "Shortcut-friendly proxy", c: "GitHubCopilotToolBox.openInlineChatCursorStyle" }
      ]
    },
    {
      title: "Rules & instructions",
      items: [
        { ic: "\\uD83D\\uDCD6", t: "Cursor vs Copilot reference", d: "Side-by-side behaviors", c: "GitHubCopilotToolBox.openCursorCopilotReference" },
        { ic: "\\uD83D\\uDD04", t: "Translate @-mentions", d: "Selection → Copilot-ish phrasing", c: "GitHubCopilotToolBox.translateContextSelection" },
        { ic: "\\u279E", t: "Append .cursorrules", d: "Into copilot-instructions", c: "GitHubCopilotToolBox.appendCursorrules" },
        { ic: "\\uD83D\\uDCC4", t: "Open instruction file…", d: "Picker for copilot instructions", c: "GitHubCopilotToolBox.openInstructionsPicker" },
        { ic: "\\u2728", t: "Create .cursorrules template", d: "Starter file in workspace", c: "GitHubCopilotToolBox.createCursorrulesTemplate" },
        { ic: "\\uD83D\\uDD04", t: "Sync Cursor rules → Copilot", d: "npx bridge", c: "GitHubCopilotToolBox.syncCursorRules" }
      ]
    },
    {
      title: "MCP & Cursor bridges",
      items: [
        { ic: "\\uD83D\\uDD0C", t: "Open workspace mcp.json", d: "Extension command", c: "GitHubCopilotToolBox.openWorkspaceMcp" },
        { ic: "\\uD83D\\uDD0C", t: "Open user mcp.json", d: "Extension command", c: "GitHubCopilotToolBox.openUserMcp" },
        { ic: "\\u2699", t: "Toggle MCP discovery", d: "chat.mcp.discovery.enabled", c: "GitHubCopilotToolBox.toggleMcpDiscovery" },
        { ic: "\\u2795", t: "Add server (native)", d: "VS Code MCP UI", c: "GitHubCopilotToolBox.mcpAddServer" }
      ]
    },
    {
      title: "Workspace setup",
      items: [
        { ic: "\\uD83E\\uDDE9", t: "Workspace wizard", d: "Cursor → Copilot checklist", c: "GitHubCopilotToolBox.workspaceSetupWizard" },
        { ic: "\\uD83E\\uDDE0", t: "Init memory bank", d: "npx Copilot memory bank", c: "GitHubCopilotToolBox.initMemoryBank" }
      ]
    },
    {
      title: "Docs & environment",
      items: [
        { ic: "\\uD83D\\uDCCA", t: "Copilot billing / usage", d: "PRU documentation", c: "GitHubCopilotToolBox.openCopilotBillingDocs" },
        { ic: "\\u2705", t: "Environment sync checklist", d: "Tooling alignment", c: "GitHubCopilotToolBox.openEnvSyncChecklist" }
      ]
    }
  ];

  function $(sel) { return document.querySelector(sel); }
  function norm(s) { return (s || "").toLowerCase(); }

  function setSearchPlaceholder() {
    var inp = $("#q");
    if (!inp) return;
    if (page === "mcp" && sub === "browse") {
      inp.setAttribute("placeholder", "Search official MCP registry…");
    } else if (page === "skills" && sub === "browse") {
      inp.setAttribute("placeholder", "Search skills.sh…");
    } else if (page === "workspace") {
      inp.setAttribute("placeholder", "Filter toolbox commands…");
    } else {
      inp.setAttribute("placeholder", "Filter installed items…");
    }
  }

  function updateChrome() {
    var showSub = page === "mcp" || page === "skills";
    $("#subpages").style.display = showSub ? "flex" : "none";
    $("#search-wrap").style.display = page === "intel" ? "none" : "block";
    $("#mcp-chips").style.display = page === "mcp" && sub === "browse" ? "flex" : "none";
    var intelAuto = $("#intel-auto-scan");
    if (intelAuto) intelAuto.style.display = page === "intel" ? "block" : "none";
    setSearchPlaceholder();
  }

  function syncIntelAutoScanCheckbox() {
    var cb = $("#intel-auto-scan-cb");
    if (!cb || !state) return;
    cb.checked = state.autoScanMcpSkillsOnWorkspaceOpen === true;
  }

  function scheduleRegistry(append) {
    if (debReg) clearTimeout(debReg);
    debReg = setTimeout(function () {
      debReg = null;
      runRegistrySearch(append);
    }, 450);
  }

  function runRegistrySearch(append) {
    if (page !== "mcp" || sub !== "browse") return;
    var q = $("#q").value.trim();
    if (!append) {
      reg.generation++;
    }
    var gen = reg.generation;
    if (!q) {
      reg.servers = [];
      reg.nextCursor = null;
      reg.loading = false;
      reg.error = null;
      reg.q = "";
      render();
      return;
    }
    reg.loading = true;
    reg.error = null;
    reg.q = q;
    if (!append) {
      reg.servers = [];
      reg.nextCursor = null;
    }
    render();
    vscode.postMessage({
      type: "registrySearch",
      generation: gen,
      search: q,
      cursor: append ? reg.nextCursor : undefined,
      append: !!append
    });
  }

  function scheduleSkillRemote() {
    if (debSkill) clearTimeout(debSkill);
    debSkill = setTimeout(function () {
      debSkill = null;
      runSkillRemoteSearch();
    }, 450);
  }

  function runSkillRemoteSearch() {
    if (page !== "skills" || sub !== "browse") return;
    skillRm.generation++;
    var gen = skillRm.generation;
    var q = $("#q").value.trim();
    if (!q) {
      skillRm.items = [];
      skillRm.loading = false;
      skillRm.error = null;
      skillRm.q = "";
      render();
      return;
    }
    skillRm.loading = true;
    skillRm.error = null;
    skillRm.q = q;
    render();
    vscode.postMessage({ type: "skillSearch", generation: gen, query: q });
  }

  function registryRepoLine(entry) {
    var s = entry && entry.server ? entry.server : entry;
    if (!s || !s.repository || !s.repository.url) return "";
    return String(s.repository.url);
  }

  function appendRegistryCatalog(rootEl) {
    rootEl.appendChild(el("div", "section-title", "Official MCP registry"));
    var qv = $("#q").value.trim();
    if (!qv && !reg.loading && reg.servers.length === 0) {
      rootEl.appendChild(el("div", "empty", "Use the search box to query the public MCP registry, then click Install to open VS Code\u2019s MCP setup."));
      return;
    }
    if (reg.loading && reg.servers.length === 0) {
      rootEl.appendChild(el("div", "empty", "Searching registry…"));
      return;
    }
    if (reg.error) {
      rootEl.appendChild(el("div", "empty", "Registry error: " + reg.error));
      return;
    }
    if (reg.servers.length === 0) {
      rootEl.appendChild(el("div", "empty", "No registry results for this query."));
      return;
    }
    reg.servers.forEach(function (entry, idx) {
      var s = entry && entry.server ? entry.server : entry;
      var title = (s && s.name) ? s.name : "MCP server";
      var desc = (s && s.description) ? s.description : "";
      var card = el("div", "mcp-card catalog-card");
      var top = el("div", "card-top");
      top.appendChild(el("h3", null, title));
      top.appendChild(el("span", "badge", "Registry"));
      card.appendChild(top);
      var repo = registryRepoLine(entry);
      if (repo) card.appendChild(el("div", "meta", repo));
      if (desc) card.appendChild(el("div", "desc", desc));
      var row = el("div", "row");
      var ins = el("button", "btn primary", "Install");
      ins.setAttribute("data-reg-idx", String(idx));
      row.appendChild(ins);
      card.appendChild(row);
      rootEl.appendChild(card);
    });
    if (reg.nextCursor) {
      var moreRow = el("div", "row");
      var more = el("button", "btn", "Load more results");
      more.addEventListener("click", function () {
        runRegistrySearch(true);
      });
      moreRow.appendChild(more);
      rootEl.appendChild(moreRow);
    }
  }

  function appendSkillRemoteCatalog(rootEl) {
    rootEl.appendChild(el("div", "section-title", "skills.sh catalog"));
    var qv = $("#q").value.trim();
    if (!qv && !skillRm.loading && skillRm.items.length === 0) {
      rootEl.appendChild(el("div", "empty", "Search to browse skills from skills.sh. Install runs npx skills add (often targets Cursor). Local SKILL.md folders below are listed for browsing only — they are not registered with Copilot."));
      return;
    }
    if (skillRm.loading && skillRm.items.length === 0) {
      rootEl.appendChild(el("div", "empty", "Searching skills.sh…"));
      return;
    }
    if (skillRm.error) {
      rootEl.appendChild(el("div", "empty", "skills.sh error: " + skillRm.error));
      return;
    }
    if (skillRm.items.length === 0) {
      rootEl.appendChild(el("div", "empty", "No skills matched this query."));
      return;
    }
    skillRm.items.forEach(function (it) {
      var card = el("div", "skill-card catalog-card");
      var top = el("div", "card-top");
      top.appendChild(el("h3", null, it.name));
      top.appendChild(el("span", "badge", "skills.sh"));
      card.appendChild(top);
      card.appendChild(el("div", "meta", it.source + " \u00b7 " + String(it.installs) + " installs"));
      var row = el("div", "row");
      var bp = el("button", "btn primary", "Install (project)");
      bp.setAttribute("data-sh-proj", "1");
      bp.setAttribute("data-src", it.source);
      bp.setAttribute("data-sid", it.skillId);
      var bg = el("button", "btn", "Install (global)");
      bg.setAttribute("data-sh-glob", "1");
      bg.setAttribute("data-src", it.source);
      bg.setAttribute("data-sid", it.skillId);
      row.appendChild(bp);
      row.appendChild(bg);
      card.appendChild(row);
      rootEl.appendChild(card);
    });
  }

  document.querySelectorAll(".page-btn").forEach(function (el) {
    el.addEventListener("click", function () {
      page = el.getAttribute("data-page");
      document.querySelectorAll(".page-btn").forEach(function (b) {
        b.classList.toggle("active", b.getAttribute("data-page") === page);
      });
      updateChrome();
      var qq = $("#q").value.trim();
      if (page === "mcp" && sub === "browse" && qq) scheduleRegistry(false);
      if (page === "skills" && sub === "browse" && qq) scheduleSkillRemote();
      render();
    });
  });
  document.querySelectorAll(".sub-btn").forEach(function (el) {
    el.addEventListener("click", function () {
      sub = el.getAttribute("data-sub");
      document.querySelectorAll(".sub-btn").forEach(function (b) {
        b.classList.toggle("active", b.getAttribute("data-sub") === sub);
      });
      updateChrome();
      var qq = $("#q").value.trim();
      if (page === "mcp" && sub === "browse" && qq) scheduleRegistry(false);
      if (page === "skills" && sub === "browse" && qq) scheduleSkillRemote();
      render();
    });
  });
  $("#q").addEventListener("input", function () {
    if (page === "workspace") {
      filterWorkspaceTools();
      return;
    }
    if (page === "mcp" && sub === "browse") {
      scheduleRegistry(false);
      return;
    }
    if (page === "skills" && sub === "browse") {
      scheduleSkillRemote();
      return;
    }
    render();
  });

  document.getElementById("scroll").addEventListener("click", function (e) {
    var ir = e.target.closest("button[data-reg-idx]");
    if (ir) {
      var i = parseInt(ir.getAttribute("data-reg-idx"), 10);
      var ent = reg.servers[i];
      if (ent) vscode.postMessage({ type: "installMcpRegistry", entry: ent });
      return;
    }
    var sp = e.target.closest("button[data-sh-proj]");
    if (sp) {
      vscode.postMessage({
        type: "installSkillSh",
        source: sp.getAttribute("data-src") || "",
        skillId: sp.getAttribute("data-sid") || "",
        global: false
      });
      return;
    }
    var sg = e.target.closest("button[data-sh-glob]");
    if (sg) {
      vscode.postMessage({
        type: "installSkillSh",
        source: sg.getAttribute("data-src") || "",
        skillId: sg.getAttribute("data-sid") || "",
        global: true
      });
    }
  });

  document.body.addEventListener("click", function (e) {
    var btn = e.target.closest("button[data-cmd]");
    if (!btn) return;
    var cmd = btn.getAttribute("data-cmd");
    if (cmd === "dummy-refresh") {
      vscode.postMessage({ type: "refresh" });
      return;
    }
    vscode.postMessage({ type: "runCommand", command: cmd });
  });

  (function wireIntelAutoScan() {
    var cb = $("#intel-auto-scan-cb");
    if (cb) {
      cb.addEventListener("change", function () {
        vscode.postMessage({ type: "setAutoScanMcpSkillsOnWorkspaceOpen", value: cb.checked });
      });
    }
    var sn = $("#intel-scan-now");
    if (sn) {
      sn.addEventListener("click", function () {
        vscode.postMessage({ type: "runCommand", command: "GitHubCopilotToolBox.showMcpSkillsAwareness" });
      });
    }
  })();

  window.addEventListener("message", function (e) {
    if (!e.data) return;
    if (e.data.type === "state") {
      state = e.data.payload;
      render();
      return;
    }
    if (e.data.type === "registrySearchResult") {
      if (e.data.generation !== reg.generation) return;
      reg.loading = false;
      if (e.data.error) {
        reg.error = e.data.error;
        if (!e.data.append) reg.servers = [];
      } else {
        reg.error = null;
        var list = e.data.servers || [];
        if (e.data.append) reg.servers = reg.servers.concat(list);
        else reg.servers = list;
        reg.nextCursor = e.data.nextCursor || null;
      }
      render();
      return;
    }
    if (e.data.type === "skillSearchResult") {
      if (e.data.generation !== skillRm.generation) return;
      skillRm.loading = false;
      if (e.data.error) {
        skillRm.error = e.data.error;
        skillRm.items = [];
      } else {
        skillRm.error = null;
        skillRm.items = e.data.items || [];
      }
      render();
    }
  });

  function filterText(items, getStr) {
    var q = norm($("#q").value);
    if (!q) return items;
    return items.filter(function (it) { return norm(getStr(it)).indexOf(q) !== -1; });
  }

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function filterWorkspaceTools() {
    var q = norm($("#q").value);
    document.querySelectorAll(".tile").forEach(function (tile) {
      var hay = norm(tile.getAttribute("data-filter") || "");
      tile.style.display = !q || hay.indexOf(q) !== -1 ? "flex" : "none";
    });
    document.querySelectorAll("details.tool-block").forEach(function (d) {
      var any = false;
      d.querySelectorAll(".tile").forEach(function (t) {
        if (t.style.display !== "none") any = true;
      });
      d.style.display = any ? "" : "none";
    });
  }

  function renderKitRow(row) {
    var card = el("div", "kit-card");
    var inner = el("div", "kit-inner");
    var dot = el("div", "status " + (row.present ? "ok" : "miss"));
    inner.appendChild(dot);
    var body = el("div", "kit-body");
    body.appendChild(el("div", "t", row.label));
    if (row.displayPath) body.appendChild(el("div", "p", row.displayPath));
    inner.appendChild(body);
    card.appendChild(inner);
    var rowBtns = el("div", "row");
    if (row.isWizard) {
      var w = el("button", "btn primary", "Run wizard");
      w.addEventListener("click", function () {
        vscode.postMessage({ type: "runCommand", command: "GitHubCopilotToolBox.workspaceSetupWizard" });
      });
      rowBtns.appendChild(w);
    } else if (row.present && row.openUri) {
      var op = el("button", "btn primary", "Open");
      op.addEventListener("click", function () {
        vscode.postMessage({
          type: "runCommandWithArgs",
          command: "GitHubCopilotToolBox.openKitTarget",
          args: [row.openUri, !!row.isDirectory]
        });
      });
      rowBtns.appendChild(op);
    } else if (!row.present && row.runCommand) {
      var fix = el("button", "btn primary", "Create / sync");
      fix.addEventListener("click", function () {
        vscode.postMessage({ type: "runCommand", command: row.runCommand });
      });
      rowBtns.appendChild(fix);
    }
    card.appendChild(rowBtns);
    return card;
  }

  function mcpCard(s) {
    var card = el("div", s.disabled ? "mcp-card mcp-card--disabled" : "mcp-card");
    var top = el("div", "card-top");
    top.appendChild(el("h3", null, s.id));
    top.appendChild(el("span", "badge", s.disabled ? "Off" : s.kind));
    card.appendChild(top);
    card.appendChild(el("div", "meta", (s.scope === "workspace" ? "Workspace" : "User") + (s.disabled ? " — not in mcp.json (Toolbox stash)" : "")));
    card.appendChild(el("div", "desc", s.detail));
    var row = el("div", "row");
    var toggle = el("button", "btn primary", s.disabled ? "Turn ON" : "Turn OFF");
    toggle.addEventListener("click", function () {
      vscode.postMessage({ type: "mcpToggleServer", scope: s.scope, id: s.id, enable: !!s.disabled });
    });
    var del = el("button", "btn", "Remove");
    del.addEventListener("click", function () {
      vscode.postMessage({ type: "mcpDeleteServer", scope: s.scope, id: s.id });
    });
    var ed = el("button", "btn", "Edit mcp.json");
    ed.addEventListener("click", function () {
      var cmd = s.scope === "workspace" ? "workbench.mcp.openWorkspaceFolderMcpJson" : "workbench.mcp.openUserMcpJson";
      vscode.postMessage({ type: "runCommand", command: cmd });
    });
    row.appendChild(toggle);
    row.appendChild(del);
    row.appendChild(ed);
    card.appendChild(row);
    return card;
  }

  function skillCard(s) {
    var card = el("div", s.disabled ? "skill-card skill-card--disabled" : "skill-card");
    var top = el("div", "card-top");
    top.appendChild(el("h3", null, s.name));
    top.appendChild(el("span", "badge", s.disabled ? "Off" : s.scope === "workspace" ? "Workspace" : "User"));
    card.appendChild(top);
    card.appendChild(
      el(
        "div",
        "meta",
        s.rootPath + (s.disabled ? " — hidden in hub (Toolbox); still on disk" : "")
      )
    );
    card.appendChild(el("div", "desc", s.description));
    var row = el("div", "row");
    var toggle = el("button", "btn primary", s.disabled ? "Turn ON" : "Turn OFF");
    toggle.addEventListener("click", function () {
      vscode.postMessage({
        type: "skillToggleHub",
        skillId: s.id,
        scope: s.scope,
        enable: !!s.disabled
      });
    });
    var delSk = el("button", "btn", "Delete…");
    delSk.addEventListener("click", function () {
      vscode.postMessage({ type: "deleteSkillFolder", fsPath: s.rootPath, scope: s.scope });
    });
    var o = el("button", "btn", "Open SKILL.md");
    o.addEventListener("click", function () {
      vscode.postMessage({ type: "openFile", fsPath: s.skillMdPath });
    });
    var r = el("button", "btn", "Reveal folder");
    r.addEventListener("click", function () {
      vscode.postMessage({ type: "revealPath", fsPath: s.rootPath });
    });
    row.appendChild(toggle);
    row.appendChild(delSk);
    row.appendChild(o);
    row.appendChild(r);
    card.appendChild(row);
    return card;
  }

  function callout(title, body, cmd, btnLabel) {
    var c = el("div", "callout");
    c.appendChild(el("h4", null, title));
    c.appendChild(el("p", null, body));
    var b = el("button", "btn primary", btnLabel);
    b.addEventListener("click", function () {
      vscode.postMessage({ type: "runCommand", command: cmd });
    });
    c.appendChild(b);
    return c;
  }

  function renderContextHygiene() {
    var hy = state && state.hygiene;
    if (!hy) {
      return;
    }
    $("#root").appendChild(el("div", "section-title", "Context hygiene"));
    var snap = el("div", "callout");
    snap.appendChild(el("h4", null, "Snapshot"));
    var line1 =
      "Workspace MCP servers: " +
      hy.workspaceMcpServerCount +
      ". User MCP servers: " +
      hy.userMcpServerCount +
      ". .github/copilot-instructions.md: " +
      (hy.copilotInstructionsMissing ? "missing." : hy.copilotInstructionsLines + " line(s).");
    snap.appendChild(el("p", null, line1));
    snap.appendChild(
      el(
        "p",
        null,
        "These counts come from local config files only — not chat token usage or live MCP runtime state."
      )
    );
    $("#root").appendChild(snap);

    var grid = el("div", "hygiene-actions");
    var actions = [
      {
        ic: "\\uD83D\\uDD0D",
        t: "Scan Copilot/MCP files",
        p: "Heuristic secret-shaped patterns in mcp.json + instructions",
        c: "GitHubCopilotToolBox.copilotToolboxConfigScan"
      },
      {
        ic: "\\uD83D\\uDCD3",
        t: "Notepad \\u2192 memory-bank",
        p: "Append session notepad to a memory-bank .md file",
        c: "GitHubCopilotToolBox.appendNotepadToMemoryBank"
      },
      { ic: "\\u2728", t: "New SKILL.md stub", p: ".github/skills/<name>/", c: "GitHubCopilotToolBox.createSkillStub" },
      {
        ic: "\\u2705",
        t: "Verification checklist",
        p: "Multi-pick acknowledgement before you ship",
        c: "GitHubCopilotToolBox.verificationChecklist"
      },
      {
        ic: "\\uD83E\\uDDE9",
        t: "Bundled MCP recipe",
        p: "Merge a sample server into .vscode/mcp.json",
        c: "GitHubCopilotToolBox.applyBundledMcpRecipe"
      },
      {
        ic: "\\u25B6",
        t: "Run first test task",
        p: "From tasks.json (name heuristics)",
        c: "GitHubCopilotToolBox.runFirstWorkspaceTestTask"
      }
    ];
    actions.forEach(function (a) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "hygiene-tile";
      btn.appendChild(el("span", "hic", a.ic));
      var body = el("span", "htext");
      body.appendChild(el("span", "htt", a.t));
      body.appendChild(el("span", "htp", a.p));
      btn.appendChild(body);
      btn.addEventListener("click", function () {
        vscode.postMessage({ type: "runCommand", command: a.c });
      });
      grid.appendChild(btn);
    });
    $("#root").appendChild(grid);
  }

  function renderIntel() {
    renderContextHygiene();
    $("#root").appendChild(el("div", "section-title", "Cursor \\u2192 VS Code & Copilot"));

    var bridges = [
      {
        ic: "\\uD83D\\uDD0C",
        t: "Port Cursor MCP",
        p: "npx package cursor-mcp-to-github-copilot-port: Cursor ~/.cursor/mcp.json to VS Code mcp.json. Source: amitchorasiya/Github-Copilot-ToolBox on GitHub.",
        c: "GitHubCopilotToolBox.portCursorMcp",
        b: "Run npx port",
        r: "GitHubCopilotToolBox.openIntelligenceRepoMcpPort"
      },
      {
        ic: "\\uD83E\\uDDE0",
        t: "GitHub Copilot memory bank",
        p: "npx package github-copilot-memory-bank: scaffold memory-bank/ and merge .github/copilot-instructions.md. Source: amitchorasiya/Github-Copilot-Memory-Bank on GitHub.",
        c: "GitHubCopilotToolBox.initMemoryBank",
        b: "Run npx init",
        r: "GitHubCopilotToolBox.openIntelligenceRepoMemoryBank"
      },
      {
        ic: "\\uD83D\\uDD04",
        t: "Cursor rules to Copilot",
        p: "npx package cursor-rules-to-github-copilot: .cursor/rules to Copilot instruction files under .github/. Source: amitchorasiya/Github-Copilot-Cursor-Rules-Converter on GitHub.",
        c: "GitHubCopilotToolBox.syncCursorRules",
        b: "Run converter",
        r: "GitHubCopilotToolBox.openIntelligenceRepoRulesConverter"
      },
      {
        ic: "\\uD83D\\uDCE5",
        t: "Migrate skills to .agents",
        p: "Copy or move SKILL.md skill folders from .cursor/skills to .agents/skills (workspace and/or home). Editor-side layout only; does not register skills with Copilot.",
        c: "GitHubCopilotToolBox.migrateSkillsCursorToAgents",
        b: "Run migration"
      }
    ];
    bridges.forEach(function (h0) {
      var h = el("div", "hero");
      h.appendChild(el("div", "ic", h0.ic));
      h.appendChild(el("h3", null, h0.t));
      h.appendChild(el("p", null, h0.p));
      var row = el("div", "row");
      var b1 = el("button", "btn primary", h0.b);
      b1.addEventListener("click", function () {
        vscode.postMessage({ type: "runCommand", command: h0.c });
      });
      row.appendChild(b1);
      if (h0.r) {
        var b2 = el("button", "btn", "GitHub");
        b2.addEventListener("click", function () {
          vscode.postMessage({ type: "runCommand", command: h0.r });
        });
        row.appendChild(b2);
      }
      h.appendChild(row);
      $("#root").appendChild(h);
    });

    $("#root").appendChild(el("div", "section-title", "Context & readiness"));

    var heroes = [
      { ic: "\\uD83D\\uDD0D", t: "Scan MCP & Skills awareness", p: "Opens a markdown report of mcp.json servers and local SKILL.md skill folders — with notes on Agent/MCP tools vs reference-only skills.", c: "GitHubCopilotToolBox.showMcpSkillsAwareness", b: "Run scan" },
      { ic: "\\uD83D\\uDCE6", t: "Context pack for Chat", p: "Gathers workspace signals you choose (files, git, diagnostics) and copies a pack for Copilot.", c: "GitHubCopilotToolBox.buildContextPack", b: "Build pack" },
      { ic: "\\uD83D\\uDEE1", t: "Readiness summary", p: "Markdown checklist: instructions, rules, MCP, and suggested next commands.", c: "GitHubCopilotToolBox.showIntelligenceReadiness", b: "Run readiness" },
      { ic: "\\u2699", t: "Tune defaults", p: "Pre-select git, diagnostics, notepad, and chat follow-ups in the pack flow.", c: "GitHubCopilotToolBox.openIntelligenceSettings", b: "Open settings" }
    ];
    heroes.forEach(function (h0) {
      var h = el("div", "hero");
      h.appendChild(el("div", "ic", h0.ic));
      h.appendChild(el("h3", null, h0.t));
      h.appendChild(el("p", null, h0.p));
      var btn = el("button", "btn primary", h0.b);
      btn.addEventListener("click", function () {
        vscode.postMessage({ type: "runCommand", command: h0.c });
      });
      h.appendChild(btn);
      $("#root").appendChild(h);
    });

    $("#root").appendChild(el("div", "empty", "Tip: run \u201cIntelligence\u201d actions from the Command Palette anytime — they live here for quick access."));
  }

  function renderWorkspace() {
    $("#root").appendChild(el("div", "section-title", "Workspace checklist"));
    var kit = (state && state.kit) || [];
    if (!kit.length) {
      $("#root").appendChild(el("div", "empty", "No kit data."));
    } else {
      kit.forEach(function (row) {
        $("#root").appendChild(renderKitRow(row));
      });
    }
    $("#root").appendChild(el("div", "section-title", "All toolbox commands"));
    $("#root").appendChild(el("div", "empty", "Use the search box above to filter. Open a section to run an action."));
    TOOL_GROUPS.forEach(function (g) {
      var det = document.createElement("details");
      det.className = "tool-block";
      det.open = true;
      var sum = document.createElement("summary");
      sum.textContent = g.title;
      det.appendChild(sum);
      var grid = el("div", "tile-grid");
      g.items.forEach(function (it) {
        var tile = document.createElement("button");
        tile.type = "button";
        tile.className = "tile";
        tile.setAttribute("data-cmd", it.c);
        tile.setAttribute("data-filter", norm(it.t + " " + it.d + " " + g.title));
        var ic = el("span", "ic", it.ic);
        var body = el("div", "body");
        body.appendChild(el("div", "t", it.t));
        body.appendChild(el("div", "d", it.d));
        tile.appendChild(ic);
        tile.appendChild(body);
        grid.appendChild(tile);
      });
      det.appendChild(grid);
      $("#root").appendChild(det);
    });
    filterWorkspaceTools();
  }

  function render() {
    var root = $("#root");
    root.textContent = "";
    updateChrome();
    if (!state) {
      root.appendChild(el("div", "empty", "Loading\u2026"));
      return;
    }
    syncIntelAutoScanCheckbox();

    if (page === "intel") {
      renderIntel();
      return;
    }
    if (page === "workspace") {
      renderWorkspace();
      return;
    }

    if (page === "skills") {
      if (sub === "browse") {
        appendSkillRemoteCatalog($("#root"));
      }
      var skills = filterText(state.skills || [], function (s) {
        return s.name + " " + s.description + " " + s.rootPath + (s.disabled ? " off hidden" : "");
      });
      $("#root").appendChild(el("div", "section-title", sub === "browse" ? "Local skills (this machine)" : "Installed skills"));
      $("#root").appendChild(el("div", "empty", "Browsing only — Copilot does not automatically load SKILL.md from these paths."));
      if (!skills.length) {
        $("#root").appendChild(el("div", "empty", "No SKILL.md skill folders found. Add subfolders with SKILL.md under project roots (.github/skills, .claude/skills, .agents/skills, .cursor/skills) or user roots (~/.copilot/skills, ~/.claude/skills, ~/.agents/skills, ~/.cursor/skills)."));
        return;
      }
      skills.forEach(function (s) {
        $("#root").appendChild(skillCard(s));
      });
      return;
    }

    /* MCP */
    var ws = state.workspaceServers || [];
    var us = state.userServers || [];
    var browse = sub === "browse";
    var rootEl = $("#root");

    if (browse) {
      appendRegistryCatalog(rootEl);
      rootEl.appendChild(el("div", "section-title", "Workspace MCP"));
      if (!state.workspaceName) {
        rootEl.appendChild(callout("No folder open", "Open a workspace folder to edit .vscode/mcp.json and list workspace-scoped servers.", "workbench.mcp.openWorkspaceFolderMcpJson", "Open workspace mcp.json"));
      } else if (state.workspaceMcp === "missing") {
        rootEl.appendChild(callout("Workspace mcp.json missing", "Create .vscode/mcp.json to register MCP servers for this project.", "workbench.mcp.openWorkspaceFolderMcpJson", "Create workspace mcp.json"));
      } else if (state.workspaceMcp === "empty") {
        if ((ws || []).length === 0) {
          rootEl.appendChild(callout("No servers yet", "Your mcp.json exists but defines no servers.", "workbench.mcp.openWorkspaceFolderMcpJson", "Edit workspace mcp.json"));
        }
        filterText(ws, function (x) { return x.id + x.kind + x.detail + (x.disabled ? " off disabled" : ""); }).forEach(function (s) {
          rootEl.appendChild(mcpCard(s));
        });
      } else {
        filterText(ws, function (x) { return x.id + x.kind + x.detail + (x.disabled ? " off disabled" : ""); }).forEach(function (s) {
          rootEl.appendChild(mcpCard(s));
        });
      }

      rootEl.appendChild(el("div", "section-title", "User MCP"));
      if (state.userMcp === "missing") {
        if ((us || []).length === 0) {
          rootEl.appendChild(callout("User mcp.json missing", "Opens your global MCP config (VS Code will create the file if needed).", "workbench.mcp.openUserMcpJson", "Open user mcp.json"));
        }
        filterText(us, function (x) { return x.id + x.kind + x.detail + (x.disabled ? " off disabled" : ""); }).forEach(function (s) {
          rootEl.appendChild(mcpCard(s));
        });
      } else if (state.userMcp === "empty") {
        if ((us || []).length === 0) {
          rootEl.appendChild(callout("No user servers", "Add servers to your user mcp.json for every workspace.", "workbench.mcp.openUserMcpJson", "Edit user mcp.json"));
        }
        filterText(us, function (x) { return x.id + x.kind + x.detail + (x.disabled ? " off disabled" : ""); }).forEach(function (s) {
          rootEl.appendChild(mcpCard(s));
        });
      } else {
        filterText(us, function (x) { return x.id + x.kind + x.detail + (x.disabled ? " off disabled" : ""); }).forEach(function (s) {
          rootEl.appendChild(mcpCard(s));
        });
      }
    } else {
      rootEl.appendChild(el("div", "section-title", "Workspace servers"));
      if (!state.workspaceName) {
        rootEl.appendChild(el("div", "empty", "No workspace folder."));
      } else if ((ws || []).length > 0) {
        filterText(ws, function (x) { return x.id + x.kind + x.detail + (x.disabled ? " off disabled" : ""); }).forEach(function (s) {
          rootEl.appendChild(mcpCard(s));
        });
      } else if (state.workspaceMcp === "missing") {
        rootEl.appendChild(el("div", "empty", "Missing mcp.json"));
      } else {
        rootEl.appendChild(el("div", "empty", "No servers defined"));
      }

      rootEl.appendChild(el("div", "section-title", "User servers"));
      if ((us || []).length > 0) {
        filterText(us, function (x) { return x.id + x.kind + x.detail + (x.disabled ? " off disabled" : ""); }).forEach(function (s) {
          rootEl.appendChild(mcpCard(s));
        });
      } else if (state.userMcp === "missing") {
        rootEl.appendChild(el("div", "empty", "Missing user mcp.json"));
      } else {
        rootEl.appendChild(el("div", "empty", "No servers"));
      }
    }
  }

  updateChrome();
  vscode.postMessage({ type: "ready" });
})();
  </script>
</body>
</html>`;
}
