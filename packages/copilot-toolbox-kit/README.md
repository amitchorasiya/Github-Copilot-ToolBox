# copilot-toolbox-kit

Private workspace package: **shared TypeScript** for the [Github-Copilot-ToolBox](https://github.com/amitchorasiya/Github-Copilot-ToolBox) monorepo (VS Code extension, optional **IntelliJ** plugin, bridge CLIs).

## Setup

```bash
cd packages/copilot-toolbox-kit
npm install
npm run build
```

## Rename

If you want a different name, change the directory, update `package.json` `"name"`, and add a dependency from `packages/github-copilot-toolbox` (or others) using a `file:` or workspace reference.

## License

MIT (match the repo root unless you choose otherwise).
