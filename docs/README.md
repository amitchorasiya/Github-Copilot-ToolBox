# Static site (GitHub Pages)

This folder is a **static sales landing** for **GitHub Copilot Toolbox**. No build step—plain HTML + CSS.

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

Screenshots load from `raw.githubusercontent.com` (needs network). After you push to `main`, images always match the repo.

## Publish on GitHub Pages

1. Repo **Settings** → **Pages**.
2. **Build and deployment** → Source: **Deploy from a branch**.
3. Branch: **main** → folder **`/docs`** → Save.

The site will be available at:

`https://<user>.github.io/Github-Copilot-ToolBox/`

(path matches your repo name).

## Custom domain: `copilottoolbox.layai.co` (same pattern as [DriveSyncAI](https://github.com/amitchorasiya/DriveSyncAI))

This repo already includes **`docs/CNAME`** with `copilottoolbox.layai.co`. DNS treats hostnames as case-insensitive; `CopilotToolBox.layai.co` in the browser is the same host.

### 1. GitHub Pages

1. **[Github-Copilot-ToolBox](https://github.com/amitchorasiya/Github-Copilot-ToolBox)** → **Settings** → **Pages**.
2. **Build and deployment**: branch **`main`**, folder **`/docs`** → Save.
3. **Custom domain**: enter **`copilottoolbox.layai.co`** → Save (GitHub may create a commit or confirm the existing `CNAME` file).
4. Wait for the **DNS check** to pass, then enable **Enforce HTTPS**.

### 2. DNS at `layai.co` (your registrar / DNS host)

Add a **CNAME** record (same idea as [drivesyncai.layai.co](https://github.com/amitchorasiya/DriveSyncAI) for [DriveSyncAI](https://github.com/amitchorasiya/DriveSyncAI)):

| Type  | Name / Host              | Target / Value        | TTL  |
|-------|---------------------------|------------------------|------|
| CNAME | `copilottoolbox` (or `CopilotToolBox` if the panel allows) | `amitchorasiya.github.io` | Auto or 300 |

Do **not** point the CNAME at `github.com`. For **project** Pages the target is **`<user>.github.io`**.

Propagate can take a few minutes to a few hours. GitHub’s Pages settings show when the domain is verified.

### 3. Push `docs/CNAME` to `main`

If `CNAME` is not on the default branch yet, merge and push so Pages serves the file at the site root.

### 4. Optional checks

- Open **`https://copilottoolbox.layai.co`** — should load `docs/index.html`.
- If assets 404, ensure links in `index.html` are root-relative (`css/site.css`) and you are not opening the old `github.io/RepoName/` URL with a custom domain (custom domain is the site root).

Official reference: [GitHub Pages custom domains](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site).

## Optional: `.nojekyll`

If you later add paths Jekyll might misinterpret, add an empty `docs/.nojekyll` file. Not required for the current site.
