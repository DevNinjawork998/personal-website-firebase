# Motion and 3D for the portfolio: the gold field

## Context

The portfolio (`src/App.tsx`: Header, Landing, About, Projects, Contact, Footer) is a dark, gold, editorial single page with very little motion: About text and project rows fade up on scroll, and the hero marquee is a CSS keyframe. The user asked for more motion and 3D using Motion, anime.js and Three.js. They approved the direction below as proposed.

Only `framer-motion` 11 is installed today. `three` (0.186.1) and `animejs` (4.5.0) are new; both are MIT.

**Idea:** one thread of gold dust runs through the whole page. It starts scattered and snaps into order, which is what the headline promises ("precision and care"), then reshapes as the visitor scrolls.

## Goals

- A visitor remembers the gold field: dust assembles on load and changes form through the page.
- The hero stops being static: it gets an orchestrated intro.
- Cards, nav and Contact gain small, physical responses.

## Non-goals

- New sections, new copy, or a theme change.
- Custom cursor, page transitions, magnetic buttons, marquee changes.
- Using `@react-three/fiber` or migrating `framer-motion` to the `motion` package.

## Anti-goals (a failure even if it works)

- Text gets harder to read because dust runs behind it.
- The page feels slower: a loader, delayed text, jank on scroll.
- Bouncy or playful motion that fights the quiet editorial look.
- Scroll-jacking. Native scrolling is never touched.

## Decided with the user

- Whole-page gold field: sphere at hero, wave at About, dim drift at Work, ring at Contact, slight cursor tilt.
- anime.js runs the hero intro, line draws and the project count-up.
- Motion runs card 3D tilt, gold scroll progress bar, nav active marker, Contact reveal.

## Builder's calls already made

- Plain `three` with `PointsMaterial` and CPU lerping between position arrays. No custom shaders.
- anime.js overlaps Motion, so its job stays limited to the list above.
- Headline animates by line, not letter. Letter splitting would break `getByText` in `LandingSection.test.tsx` and screen reader output.
- Dust does not form the portrait: the photo background is busy foliage and would read as noise.
- Shrink the 9 MB portrait and fix the "andowner" typo in the same pass.
- Each form holds on scroll, then morphs, with no overlapping morphs.
- Phones get their own composition at desktop brightness, and tablets use the desktop composition. Revised 2026-11-01: the user asked for phone and iPad to match the web view, replacing the original much dimmer dust.
- No new text backings: only `Card.tsx` gets one.

## Implementation

### 1. Setup

- Branch first: `feat/gold-field-motion`. CI deploys on push to master, so do not push or deploy without being asked.
- `pnpm add three animejs` and `pnpm add -D @types/three`. Commit `pnpm-lock.yaml`, because CI installs with `--frozen-lockfile`.

### 2. Housekeeping in `src/components/LandingSection.tsx`

- Replace `src/images/IMG_2796.png` (3024x4032, 9 MB, referenced only at line 6): `sips -Z 1600 -s format jpeg -s formatOptions 80 src/images/IMG_2796.png --out src/images/profile.jpg`, update the import, delete the PNG.
- Lines 106-108: add `{" "}` after `and`.

### 3. Gold field: new `src/components/GoldField.tsx`

Default export is the component. Named exports `stageAt` and the shape builders exist so they can be tested.

Mounting in `src/App.tsx`:

```tsx
const GoldField = lazy(() => import("./components/GoldField"));
const reducedMotion = useReducedMotion();

<MotionConfig reducedMotion="user">
  {!reducedMotion && <Suspense fallback={null}><GoldField /></Suspense>}
  <Box as="main" position="relative" zIndex={1}>...</Box>
</MotionConfig>
```

Lazy loading puts Three.js in its own chunk, so hero text does not wait for it.

Layering: a fixed full-viewport wrapper at `zIndex={0}`, `pointerEvents="none"`, `aria-hidden`, height `100lvh` so mobile URL bars do not cause jumps. Do not use a negative z-index: `theme.ts` paints a background on both `html` and `body`, so the body background would cover it.

Remove `bg` from `LandingSection`, `AboutSection`, all three `ProjectsSection` return branches, `ContactMeSection` and `Footer`. The body background already matches. The Header stays opaque.

Scene:

- Shapes: `Float32Array`s of the same length for scatter, sphere, wave, drift, ring. 6000 points, 2500 when `innerWidth < 768`.
- Material: `PointsMaterial` in `#C9A843`, additive blending, `depthWrite: false`, a small `CanvasTexture` soft dot so points are round.
- Each frame: lerp the current shape pair into the position attribute, apply slow rotation, ease toward the cursor or finger tilt (about 0.15 rad, from `pointermove` and `touchmove` on `window`, because scrolling cancels a touch's pointer events), ease opacity toward the stage value.
- Intro: scatter to sphere over about 1.8s after the chunk arrives. If the visitor loads mid-page, assemble into the current stage's shape.

Starting values, tuned in the browser. Compact means below 768px, Chakra's `md`, where the hero stacks and no portrait sits beside the text. From 768px up the sphere is measured from the portrait each frame rather than set from a fixed offset, so it frames the photo at every width. Dust never gets a text backing outside `Card.tsx`.

| Stage | Anchor | Form, 768px and up | Form, compact | Opacity, both |
|---|---|---|---|---|
| 0 | top of page | sphere, centred on the portrait with its rim on the corners | sphere, centred behind the headline, clear of the bio | 0.75 |
| 1 | `#about` | wave across full width | wave | 0.3 |
| 2 | `#work` | loose drift | loose drift | 0.18 |
| 3 | `#contact` | ring, centred, text in the hole, shrunk to fit a narrow tablet | ring running off both sides, arcs above and below the card text | 0.7 |

Points render 2.6px at every viewport height via `dotSize`, because three scales point size with height and they would swell on tall tablets.

`stageAt(scrollY, sectionTops, viewportHeight, maxScroll)` returns one `{ from, to, t }` pair:

- Anchor 0 is scroll position 0. Every other anchor is that section's absolute top minus half a viewport, clamped to `maxScroll`, because tall screens may never reach the last one.
- Each form holds for the first and last 20% of the gap between neighbouring anchors. The morph fills the middle 60%. So the page opens on a whole sphere, windows never overlap, and `t` never jumps.
- Skip any gap of zero or less, which clamping can produce.

Read section tops each frame via `getElementById`: the Work section's height changes when Firestore data loads, so cached offsets would go stale.

Lifecycle:

- Create `WebGLRenderer` inside `try/catch`. On failure return and render nothing, so the page stays plain.
- Pixel ratio `min(devicePixelRatio, 2)`.
- `setAnimationLoop` uses rAF, which already stops in hidden tabs, so no visibility handling is needed.
- `src/index.tsx` uses StrictMode, so cleanup must fully dispose: renderer (`dispose` and `forceContextLoss`), geometry, material, texture, listeners, animation loop.

Legibility: change the `Card.tsx` background from `rgba(255,255,255,0.015)` to `rgba(13,12,10,0.72)` so dust never runs through project text.

### 4. Hero intro in `LandingSection.tsx` (anime.js)

- `useLayoutEffect` with `createScope`, returning `scope.revert()`. Hide targets before paint with `utils.set` to avoid a flash. Skip entirely when `useReducedMotion()` is true. Confirm these names against the installed 4.5 types.
- Headline: remove the `<br />`s. Each of the four lines is a `display="block" overflow="hidden"` span containing one `display="block"` span. Keep each line's text in one node so existing `getByText` tests pass. Add `pb="0.12em" mb="-0.12em"` to the mask, or line-height 1.05 clips the italic "p" descender.
- Timeline, 2s at most, ease-out only: eyebrow hairline scales in, eyebrow fades, headline lines slide up staggered 120ms, bio and CTA row fade. The photo unveils with `clip-path` from the bottom outside the timeline, once it is in view, because phones stack it below the fold.
- Marquee: add `sx={{ "@media (prefers-reduced-motion: reduce)": { animation: "none" } }}`.

### 5. Project count-up in `ProjectsSection.tsx` (anime.js)

- Render the label as one template string so it stays one text node. `getByText(/4 projects/)` at `ProjectsSection.test.tsx:174` depends on this, so do not wrap the number in a span.
- Motion's `useInView` (once) on a ref starts anime.js counting 0 to n, writing `textContent` on update.
- The IntersectionObserver mock in `src/setupTests.ts` never fires, so tests see the final text.
- Skip under reduced motion. Also apply the hairline scale-in to the section label hairlines here and in About.

### 6. Motion details

- `Header.tsx`: 2px gold bar at the header's bottom edge using `useScroll` and `useSpring` on `scaleX`, origin left.
- `Header.tsx`: active nav marker. One IntersectionObserver with `rootMargin: "-50% 0px -50% 0px"` over `about`, `work`, `contact`, plus a `motion.span layoutId="nav-active"` underline, on the nav links and on the drawer links on phones.
- `Card.tsx`: use `motion.create(Box)`. `useMotionValue` + `useSpring` drive `rotateX`/`rotateY` up to 3 degrees with `transformPerspective: 900`. Tilt on pointer move and pointer down so a finger press tilts too, and skip under reduced motion. Motion consumes the `transition` prop, so replace the Chakra `transition="all 0.3s ease"` with `sx={{ transition: "border-color 0.3s ease, background 0.3s ease" }}`.
- `ContactMeSection.tsx`: wrap the bordered card in `MotionBox` with the same reveal props as `AboutSection.tsx:31-36`.

### 7. Tests

- New `src/components/__tests__/GoldField.test.ts`: `stageAt` returns `t = 0` for sphere at scroll 0, `t = 0` inside a hold, about 0.5 at the middle of a gap, no jump in `t` across an anchor, correct last-anchor clamp, and skips zero-length gaps; each shape builder returns `count * 3` finite values.
- In `src/setupTests.ts`, stub `HTMLCanvasElement.prototype.getContext` to return `null` so jsdom stays quiet and the `try/catch` path runs.
- Existing tests must pass unchanged.

## Critical files

`src/App.tsx`, `src/components/GoldField.tsx` (new), `LandingSection.tsx`, `ProjectsSection.tsx`, `Card.tsx`, `Header.tsx`, `ContactMeSection.tsx`, `AboutSection.tsx`, `Footer.tsx`, `src/setupTests.ts`, `package.json`, `pnpm-lock.yaml`.

Reuse: the `motion.create(Box)` reveal pattern from `AboutSection.tsx`, `GOLD`/`BG` constants as declared per file, and the existing `IntersectionObserver` mock.

## Left to the builder

Exact opacities, positions, durations and point sizes. Tune them in the browser against the anti-goals above.

## Verification

1. `pnpm run build`, `pnpm run test:ci`, `pnpm run format:check` all pass.
2. Build output shows Three.js in its own chunk, and the main chunk has not grown by more than the anime.js and Motion additions. Report both sizes.
3. Run the dev server and drive it with Playwright at 1440x900 and 390x844. Screenshot every section and a mid-morph scroll point. Pass bar: body copy is readable at every stage on both viewports, the page opens on a whole sphere, the console is clean, and the morph follows the scroll in both directions with no snap. If legibility is in doubt, dim the field.
4. Emulate `prefers-reduced-motion: reduce`: no canvas, no intro, marquee static, all text visible.
5. Disable WebGL (or force the `try/catch` path): the page renders normally.
6. Run `graphify update .` after code changes.

## After approval

Save this document as `docs/superpowers/specs/2026-10-31-gold-field-motion-design.md`, then invoke `superpowers:writing-plans` and build from that plan.
