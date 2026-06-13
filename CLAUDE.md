# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server on port 3000
npm run build        # TypeScript check + Vite build (outputs to build/)
npm test             # Run tests in watch mode
npm run test:ci      # Run tests with verbose reporter (used in CI)
npm run test:coverage # Generate coverage report
npm run format       # Format with Prettier
npm run format:check # Check Prettier compliance
```

Run a single test file:

```bash
npx vitest run src/components/__tests__/Header.test.tsx
```

## Architecture

This is a single-page personal portfolio with no client-side routing — navigation is anchor-based (`#landing`, `#projects-section`, `#contactme-section`) using `scrollIntoView()`.

**Data flow:**

- `ProjectsSection` → `useProjects` hook → `projectsService` → Firestore
- `ContactMeSection` → Formik/Yup form → `emailService` (EmailJS → mailto fallback → clipboard fallback)
- Global notifications via `AlertContext` (wraps the whole app in `App.tsx`)

**Key directories:**

- `src/services/` — External integrations (Firestore, EmailJS)
- `src/hooks/` — `useProjects` for data fetching
- `src/context/` — `alertContext.tsx` for global alert state
- `src/config/env.ts` — Single place to access all `VITE_*` environment variables; always go through this file, never access `import.meta.env` directly elsewhere
- `src/config/firebase.ts` — Firebase app initialization

**UI stack:** Chakra UI 2 + Framer Motion 11. Animations are scroll-triggered and hover-driven throughout. The `@/` path alias maps to `src/`.

## Environment Variables

All env vars are prefixed `VITE_` (not `REACT_APP_`). For local development, copy `.env.example` to `.env` and fill in values. See `docs/ENVIRONMENT_SETUP.md` for the full list and `docs/FIREBASE_SETUP.md` / `docs/EMAILJS_SETUP.md` for service-specific setup.

The CI/CD pipeline (`.github/workflows/deploy.yml`) maps GitHub secrets to env vars and deploys to Firebase Hosting on push to master.

## Testing

Tests use Vitest + React Testing Library with a jsdom environment. Mocks live in `src/__mocks__/`. Firebase and EmailJS are mocked in tests — do not add real credentials to test files.

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
