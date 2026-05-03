Scaffold a new React component for this project following established conventions.

Ask the user for the component name if not provided as an argument.

Rules:
- Place the component in `src/components/<ComponentName>.tsx`
- Use Chakra UI 2 primitives (Box, Flex, Text, etc.) for layout and styling — no raw CSS classes
- Add Framer Motion animations consistent with existing components (scroll-triggered reveal is the pattern used in LandingSection, ProjectsSection, etc.)
- Use the `@/` path alias for imports
- Access env vars only through `src/config/env.ts`, never `import.meta.env` directly
- Export the component as a named export
- Create a companion test file at `src/components/__tests__/<ComponentName>.test.tsx` using Vitest + React Testing Library
- The test file must mock Firebase (`src/__mocks__/`) and EmailJS if the component uses them

After creating both files, show the user what was created and how to import the component.
