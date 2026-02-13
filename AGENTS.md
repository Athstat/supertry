# Repository Guidelines

## Project Structure & Module Organization
- `src/` contains the React + TypeScript app. Key areas include `components/`, `screens/`, `routing/`, `services/`, `state/`, and `utils/`.
- `public/` holds static assets served by Vite.
- `tests/unit/` contains Jest unit tests.
- `docs/` and `WIKI.md` store project documentation.

## Build, Test, and Development Commands
- `pnpm dev` starts the Vite dev server (uses `--host=0.0.0.0`).
- `pnpm build` creates a production build in `dist/`.
- `pnpm preview` serves the production build locally.
- `pnpm lint` runs ESLint; `pnpm lint:fix` auto-fixes where possible.
- `pnpm format` runs Prettier across the repo.
- `pnpm test` runs Jest unit tests.
- `pnpm test:e2e` runs Maestro flows (requires `.maestro/` and a configured device/emulator).
- `pnpm ci` runs lint, tests, and build.

## Coding Style & Naming Conventions
- Indentation: 2 spaces; semicolons required; single quotes; max line length 100 (see `.prettierrc`).
- TypeScript + React with Vite; prefer functional components and hooks.
- Naming: `PascalCase` for components, `camelCase` for variables/functions, `kebab-case` for file names where used in tests.

## Testing Guidelines
- Jest + `ts-jest` for unit tests (`tests/unit/**`).
- Test files use `*.test.ts` naming (see `tests/unit/utils/*`).
- Run all unit tests with `pnpm test`. Add coverage only if requested.

## Commit & Pull Request Guidelines
- Recent commit history uses short, imperative, lowercase messages (e.g., “adds context provider to league screen”). Keep messages concise and action-oriented.
- PRs should include: summary, testing performed, and screenshots for UI changes. Link related issues if available.

## Workflow Notes
- Before starting any planning, pull from `main` to ensure the latest context from other contributors.
- When a Notion page includes embedded URLs (images, PDFs, other Notion pages, docs), load those assets/pages; if any cannot be loaded, explicitly report it.

## Configuration & Environment
- Copy `.env.example` to `.env` and set required `VITE_` variables (e.g., `VITE_API_BASE_URL`). The app will fail fast if required variables are missing.
- Deployment is Vite-based; see `render.yaml` for Render configuration.
