# Static site (GitHub Pages)

This folder is a **static sales landing** for **GitHub Copilot Toolbox**. No build step—plain HTML + CSS.

**Note:** This file is named **`PAGES-SETUP.md`** (not `README.md`) so GitHub Pages never treats it as the site homepage. The live site entry is **`index.html`**.

**Themes:** The landing page defaults to **dark** mode, styled like **GitHub Copilot CLI** / **github.com dark** (`#0d1117` canvas, `#58a6ff` accent, `#d2a8ff` secondary, monospace **JetBrains Mono**). **Light** matches **github.com light** with the same font stack. **Light** / **Dark** toggles persist in **`localStorage`** under **`copilot-toolbox-site-theme`**. Styles: **`css/site.css`**.

## Preview locally

From the **monorepo root**:

```bash
npm run serve:site
```

From **`packages/github-copilot-toolbox/`** (extension folder):

```bash
npm run serve:site
```

Either way opens **http://localhost:5173** (same script; the extension package serves **`../../docs`**).

Alternatively from the repo root:

```bash
npx --yes serve docs -l 5173
```

Alternatively:

```bash
cd docs && python3 -m http.server 8080
```

Open **http://localhost:8080**.

**Screenshots:** `index.html` uses **same-origin** paths under **`docs/screenshots/`** (copies of the repo-root `screenshots/`). That way the live site does not depend on `raw.githubusercontent.com`, which some browsers, extensions, or `Content-Security-Policy` rules block—those blocks showed as broken images on the marketing page. When you update hub captures, from the **repo root** run: `cp screenshots/*.png docs/screenshots/`.

## Publish on GitHub Pages

1. Repo **Settings** → **Pages**.
2. **Build and deployment** → Source: **Deploy from a branch**.
3. Branch: **`main`** → folder **`/docs`** (not **`/` (root)**) → Save.

**Important:** If the folder is **`/` (root)**`, GitHub turns your **repo `README.md`** into the site home — you get plain, unstyled text. The **designed** site lives in **`docs/index.html`**, so the source **must** be **`/docs`**.

This folder includes **`.nojekyll`** so GitHub does not run Jekyll on your static files.

The default GitHub URL (before custom domain) is:

`https://<user>.github.io/Github-Copilot-ToolBox/`

## Custom domain: `copilottoolbox.layai.co`

See **`docs/CNAME`**. DNS: CNAME **`copilottoolbox`** → **`amitchorasiya.github.io`**.

Full steps: [GitHub Pages custom domains](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site).

## If the custom domain still shows a plain README

1. Confirm Pages **folder** is **`/docs`**, not **`/`**.
2. Open **`https://copilottoolbox.layai.co/index.html`** — if that shows the styled site, wait a few minutes and hard-refresh `/` (CDN cache).
3. Safari: **Develop → Empty Caches** (enable Develop menu first), or try a private window.
