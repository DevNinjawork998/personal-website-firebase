---
name: project-review
description: Use when reviewing code changes in this personal-website-firebase project. Checks project-specific rules: env var access, Chakra UI v2 patterns, Firebase/Firestore safety, Framer Motion 11, Formik/Yup forms, test mock conventions, and anchor-based navigation.
---

# Project Code Review

## Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| UI framework | Chakra UI | **v2** (not v3) |
| Animation | Framer Motion | **11** |
| Data | Firebase / Firestore | latest |
| Email | `@emailjs/browser` | latest |
| Forms | Formik + Yup | latest |
| Tests | Vitest + React Testing Library | latest |
| Build | Vite, TypeScript | latest |

Path alias: `@/` → `src/`

---

## Why This Format Matters

Each rule below comes with a **Why** section. Read it. Rules without understood rationale get blindly applied or silently skipped under pressure. The Why tells you when the rule bends vs. when it never does.

---

## Pass 1 — Env Vars (CRITICAL, check first)

### Rules
- `import.meta.env` must **only** appear in `src/config/env.ts`
- All other files import from `env` (e.g. `import env from '@/config/env'`)
- No hardcoded API keys, Firebase config values, or secrets anywhere in source

### Why
Vite's `import.meta.env` is a build-time substitution. If scattered across files it becomes impossible to mock in tests — you'd need to stub a Vite-internal global instead of a plain JS module. `src/config/env.ts` is the single seam: tests mock it with `vi.mock('@/config/env')` and get full control. Every violation of this rule breaks testability for the whole consuming file.

Hardcoded secrets are a CRITICAL finding regardless of context — they end up in git history and the compiled bundle.

### Red flags
```
import.meta.env.VITE_   ← anywhere outside src/config/env.ts
process.env.            ← wrong runtime entirely (this is Vite, not Node)
"AIzaSy..."             ← hardcoded Firebase key pattern
```

---

## Pass 2 — Data Flow Architecture

### Rules
- Firestore reads/writes: components → `useProjects` hook → `projectsService` → Firestore
- Email sends: components → `emailService` → EmailJS (with mailto fallback → clipboard fallback)
- Global user notifications: components → `useAlert()` from `AlertContext`
- No direct Firestore SDK calls (`getDoc`, `getDocs`, `addDoc`) inside components or hooks other than the designated service

### Why
This project enforces a strict layered architecture for a single-page app. The service layer (`src/services/`) is the only place that knows about external SDKs. This means:
- Tests mock at the service boundary, not deep inside Firebase SDK internals
- If Firebase is swapped out, only `projectsService` changes — no component hunts required
- `emailService` implements a 3-tier fallback (EmailJS → mailto → clipboard). Bypassing it with inline `emailjs.send()` silently removes the fallbacks

`AlertContext` is the single notification channel. Introducing a second one (local state toasts, `console.error` shown to user) creates inconsistent UX and untestable notification flows.

### Red flags
```tsx
import { getDoc, getDocs } from 'firebase/firestore'  ← in a component file
emailjs.send(...)                                      ← inline, bypasses fallback chain
const [error, setError] = useState('')                 ← local error display instead of useAlert
```

---

## Pass 3 — Navigation

### Rules
- No React Router: `<Link>`, `<Route>`, `<Router>`, `useNavigate`, `useLocation` are all banned
- Navigation uses `element.scrollIntoView()` targeting IDs: `#landing`, `#projects-section`, `#contactme-section`
- Anchor hrefs that jump sections use `href="#section-id"`, not `/path`

### Why
This is a **single-page portfolio with no client-side routing**. The architecture decision was made deliberately — React Router adds ~50 KB to the bundle and significant complexity for a site that only needs smooth scroll between three sections. Installing it "just in case" or "for cleaner code" reverses an intentional trade-off.

If React Router imports appear, flag as ERROR. If they're wired into a `<BrowserRouter>`, flag as CRITICAL (breaks the app).

---

## Pass 4 — Chakra UI v2

### Rules
- Import from `@chakra-ui/react` — v2 API only
- Theme extensions go in `src/theme.ts` via `extendTheme()`
- Responsive values use array syntax: `fontSize={['sm', 'md', 'lg']}`
- No v3 API patterns (see red flags)

### Why
Chakra UI v3 is a complete rewrite with a different theming system, different component APIs, and different provider setup. v2 and v3 are **not compatible** in the same app. Mixing v3 import patterns with a v2 install will either silently produce broken styles or throw at runtime.

The most common mistake is copying code from recent Chakra docs (which now default to v3 examples) into this v2 project.

### Red flags
```tsx
import { createSystem, defaultSystem } from '@chakra-ui/react'  ← v3 only
<ChakraProvider value={system}>                                  ← v3 provider API
defineConfig(...)                                                ← v3 config API
import { For, Show } from '@chakra-ui/react'                     ← v3 utility components
```

---

## Pass 5 — Framer Motion 11

### Rules
- Use `useScroll` + `useTransform` for scroll-driven animations
- Use `whileInView` for enter-on-scroll animations — not manual `IntersectionObserver`
- No deprecated v10 APIs

### Why
Framer Motion 11 removed several v10 APIs and changed import paths. Code copied from older tutorials or Stack Overflow will silently fail or produce console errors. `whileInView` is idiomatic and handles cleanup automatically; manual `IntersectionObserver` in components requires cleanup code that is often forgotten, causing memory leaks.

### Red flags
```tsx
import { AnimateSharedLayout } from 'framer-motion'  ← removed in v11
motion.custom(...)                                    ← removed in v11
const observer = new IntersectionObserver(...)        ← prefer whileInView
```

---

## Pass 6 — Formik + Yup (ContactMeSection)

### Rules
- Validation schema: Yup, defined outside the component, not inline ad-hoc validators
- Form state: `useFormik()` or `<Formik>` — no `useState` for individual field values
- Submission errors: surfaced via `useAlert()`, not `console.error` or local state shown in JSX
- Field-level errors: use Formik's `errors` and `touched` — do not re-validate manually

### Why
The form in `ContactMeSection` submits to EmailJS which can fail in multiple ways (network, config, rate limit). Formik handles the submission lifecycle (`isSubmitting`, `setSubmitting`) and prevents double-submits. Rolling manual form state loses these guarantees.

Yup schemas are validated at the seam between user input and business logic — the right place. Inline validators scattered in `onChange` handlers are untestable and inconsistent.

---

## Pass 7 — TypeScript Strictness

### Rules
- No `any` — use proper types, generics, or `unknown` with type guards
- Every component has an explicit props interface or inline type
- Firebase documents: use typed converters (`withConverter`) or explicit cast with interface, not raw `DocumentData`
- No `@ts-ignore` or `@ts-expect-error` without a comment explaining why

### Why
This codebase is small enough that `any` types have no excuse. Firebase's `DocumentData` is `{ [key: string]: any }` — returning it untyped from a service function poisons every downstream consumer with implicit `any`. Typed converters define the shape once at the service boundary.

`@ts-ignore` without explanation is a time bomb. Future refactors won't know if the suppression is still needed.

---

## Pass 8 — Tests

### Rules
- Firebase and EmailJS must be mocked — no real SDK calls in tests
- New mocks go in `src/__mocks__/` (module-level) or `vi.mock()` at top of the test file
- Use the `test-utils.tsx` custom `render` wrapper — it provides Chakra UI theme + AlertContext
- Prefer `userEvent` over `fireEvent` for user interactions
- No real `VITE_*` values in test files

### Why
`test-utils.tsx` exists because bare `render()` from RTL has no providers — Chakra UI components will throw without `ChakraProvider`, and any component that calls `useAlert()` will throw without `AlertContext`. Every test that skips `test-utils.tsx` is silently testing less.

`userEvent` fires the real browser event sequence (pointerdown → mousedown → focus → mouseup → click). `fireEvent.click` fires only the click. Forms and interactive components behave differently between them — `userEvent` is closer to what a real user does.

Real credentials in tests mean the test suite can only pass in environments with `.env` configured — breaking CI.

---

## Pass 9 — Security

### Rules
- No secrets in source: `.env` values, API keys, service account JSON
- No `dangerouslySetInnerHTML` without explicit justification in a comment
- Yup schema is the sanitization boundary for user input — do not bypass it

### Why
Vite inlines `VITE_*` variables into the compiled bundle (they become string literals in the JS). This is expected for public-facing keys (Firebase client config, EmailJS public key). But it means anything in `VITE_*` is visible to anyone who inspects the bundle — never put server-side secrets there.

`dangerouslySetInnerHTML` bypasses React's XSS protection. If it appears, it needs a comment proving the content is safe (e.g. sanitized via DOMPurify, or a static string).

---

## Pass 10 — General Quality

### Rules
- Comments explain WHY (hidden constraint, workaround, non-obvious invariant) — not WHAT
- Imports use `@/` for anything beyond one level deep in `src/`
- No feature flags, backwards-compat shims, or `// TODO: remove after X`
- Unused variables/imports must be deleted, not renamed `_unused`

### Why
This is a solo personal project with no backward-compatibility requirement. Dead code paths, feature flags, and compatibility shims add cognitive load with zero benefit. If something is unused, delete it — git history preserves it.

Comments that describe WHAT the code does rot as the code evolves. The code is the truth; comments that contradict it are actively harmful.

---

## Output Format

```
path:line: SEVERITY: problem. fix.
```

| Severity | Meaning |
|----------|---------|
| `CRITICAL` | App-breaking or security issue. Must fix before merge. |
| `ERROR` | Violates architecture or will cause bugs. Fix before merge. |
| `WARNING` | Convention violation, likely to cause problems later. |
| `STYLE` | Preference / quality issue. Nice to fix, not blocking. |

CRITICAL triggers: raw `import.meta.env` outside `env.ts`, hardcoded secrets, real credentials in tests, React Router wired into the app.

After all findings, one-line summary:
```
N CRITICAL, N ERROR, N WARNING, N STYLE — [clean / needs work before merge]
```
