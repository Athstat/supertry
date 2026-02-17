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
- Prefer small PRs that are easy to review.
- Use meaningful PR titles.
- Avoid "AI slop" code. Keep code clean and intentional.
- For Notion tickets, include clear, non-overly-technical detail so non-engineers can understand.

## Workflow Notes
- Before starting any planning, pull from `main` to ensure the latest context from other contributors.
- When a Notion page includes embedded URLs (images, PDFs, other Notion pages, docs), load those assets/pages; if any cannot be loaded, explicitly report it.

## Releases
- Production deploys require a release card in Notion listing Major (if any), Minor, and Patch changes for UAT.
- UAT feedback is posted in `uat-reports`. Tackle UAT issues one by one.
- When a task for a release is complete, update the release Notion ticket.
- When ready to deploy, create a GitHub release with an appropriate version and name, copying release notes from Notion. Do this for both server and frontend apps.

## React Guidelines
- Avoid over-engineering or unnecessary verbosity.
- Optimize for memory usage, FPS, and bundle size.
- Write small, reusable components that are easy to extend.
- Split overly long files into smaller components where appropriate.
- Use relative imports with `@/` mapped to `./src/**`.
- Follow the existing feature-based folder structure.
- Prioritize readability for easier PR review.
- The `<Activity />` component exists and should be used when applicable.
- Delete dead code and unused components.
- Refactor after completing tasks to reduce redundancy and bundle size.

## Github
- Before opening a PR, run `lint`, `build`, and `test`, and fix any errors.
- Pull latest `main` into the feature branch and resolve conflicts before PR.

## Configuration & Environment
- Copy `.env.example` to `.env` and set required `VITE_` variables (e.g., `VITE_API_BASE_URL`). The app will fail fast if required variables are missing.
- Deployment is Vite-based; see `render.yaml` for Render configuration.
