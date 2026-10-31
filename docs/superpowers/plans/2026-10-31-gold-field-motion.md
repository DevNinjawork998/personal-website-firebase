# Gold Field Motion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a scroll-driven 3D gold particle field behind the whole page, an anime.js hero intro, and Motion responses on cards, nav and Contact.

**Architecture:** One lazy-loaded `GoldField` component owns a fixed Three.js canvas behind `<main>` and picks its form from pure, tested functions. Sections go transparent so the field shows through. anime.js and Motion additions stay inside the components they animate.

**Tech Stack:** React 18, Chakra UI 2, framer-motion 11, three 0.187, animejs 4.5, Vitest, Playwright for browser checks.

**Spec:** `docs/superpowers/specs/2026-10-31-gold-field-motion-design.md`

## Global Constraints

- Work on branch `feat/gold-field-motion`. Never push or deploy: CI deploys on push to master.
- Every commit message ends with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
- No `@react-three/fiber`, no custom shaders, no migration from `framer-motion` to `motion`.
- No loader, no scroll-jacking, no changes to copy, sections or theme.
- Ease-out only. Never `outBack`, `outElastic`, `outBounce`, or a spring that overshoots.
- Colours are `#C9A843` and `#0D0C0A`, declared as `GOLD`/`BG` per file as the code already does.
- Existing tests pass unchanged, except the new assertions this plan adds.
- `pnpm run format:check` passes before each commit.

## Review Focus

1. **Reduced-motion visitor:** all text is visible with no leftover inline hiding, no canvas, marquee still. Test in Task 4.
2. **Browser without WebGL:** the page renders plain, with no crash and no stray canvas. Test in Task 3.
3. **Short page (Firestore error or empty projects):** later anchors collapse at `maxScroll`, and the field neither produces NaN nor snaps. Test in Task 2.
4. **StrictMode remount:** the first mount's WebGL context is released, not leaked. Test in Task 3.
5. **Phone rotation or window resize across 768px:** composition switches at the boundary. Test in Task 2.

---

### Task 1: Dependencies, portrait and bio typo

**Files:**
- Modify: `package.json`, `pnpm-lock.yaml`, `src/components/LandingSection.tsx:6,106-108`
- Create: `src/images/profile.jpg`
- Delete: `src/images/IMG_2796.png`
- Test: `src/components/__tests__/LandingSection.test.tsx`

**Interfaces:**
- Produces: `three`, `animejs` and `@types/three` installed.

- [ ] **Step 1: Write the failing test**

```tsx
test("bio keeps a space before owner", () => {
  const { container } = render(<LandingSection />);
  expect(container.textContent).toContain("and owner of JNS Nexion Enterprise");
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm exec vitest run src/components/__tests__/LandingSection.test.tsx`
Expected: FAIL, received text contains `andowner`.

- [ ] **Step 3: Install dependencies**

Run: `pnpm add three animejs && pnpm add -D @types/three`
Expected: `package.json` lists `three` ^0.187.0 and `animejs` ^4.5.0.

- [ ] **Step 4: Shrink the portrait**

Run: `sips -Z 1600 -s format jpeg -s formatOptions 80 src/images/IMG_2796.png --out src/images/profile.jpg`
Expected: `sips -g pixelWidth -g pixelHeight src/images/profile.jpg` reports 1200 x 1600.

Change the import at line 6 to `../images/profile.jpg`, then delete the PNG.

- [ ] **Step 5: Add `{" "}` after `and` at line 106**

- [ ] **Step 6: Run test to verify it passes**

Run: `pnpm exec vitest run src/components/__tests__/LandingSection.test.tsx`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add docs/superpowers package.json pnpm-lock.yaml src/images src/components/LandingSection.tsx src/components/__tests__/LandingSection.test.tsx
git commit -m "chore: add three and animejs, shrink portrait, fix bio spacing"
```

### Task 2: Gold field stage logic and shapes

**Files:**
- Create: `src/components/GoldField.tsx`
- Test: `src/components/__tests__/GoldField.test.tsx`

**Interfaces:**
- Produces, as named exports from `GoldField.tsx`:
  - `type StageMix = { from: number; to: number; t: number }`, indices into stages 0 to 3 (sphere, wave, drift, ring).
  - `stageAt(scrollY: number, sectionTops: number[], viewportHeight: number, maxScroll: number): StageMix`
  - `type Composition = { opacity: number; x: number; y: number; scale: number; spin: number }`
  - `compositionFor(width: number): Composition[]`, four entries.
  - `sphereShape`, `waveShape`, `driftShape`, `ringShape`, `scatterShape`, each `(count: number) => Float32Array` of length `count * 3`.
  - `RING_RADIUS = 2.4`

- [ ] **Step 1: Write the failing tests**

```ts
const TOPS = [950, 1500, 3500]; // anchors become 0, 500, 1050, 3050
const at = (y: number) => stageAt(y, TOPS, 900, 3900);

test("opens on a whole sphere", () => expect(at(0)).toEqual({ from: 0, to: 1, t: 0 }));
test("holds for the first 20% of a gap", () => expect(at(100).t).toBe(0));
test("is halfway at the middle of a gap", () => expect(at(250).t).toBeCloseTo(0.5));
test("holds for the last 20% of a gap", () => expect(at(400).t).toBe(1));
test("does not jump across an anchor", () => {
  expect(at(499)).toEqual({ from: 0, to: 1, t: 1 });
  expect(at(500)).toEqual({ from: 1, to: 2, t: 0 });
});
test("clamps the last anchor to maxScroll", () => {
  const clamped = (y: number) => stageAt(y, [950, 1500, 5000], 900, 3900);
  expect(clamped(3899)).toEqual({ from: 2, to: 3, t: 1 });
  expect(clamped(3900)).toEqual({ from: 3, to: 3, t: 0 });
});
test("skips zero-length gaps on a short page", () => {
  const short = (y: number) => stageAt(y, [950, 1500, 1600], 900, 900);
  expect(short(700)).toEqual({ from: 1, to: 3, t: 0.5 });
  expect(short(900)).toEqual({ from: 3, to: 3, t: 0 });
});
test("survives overscroll", () => {
  expect(at(-20).t).toBe(0);
  expect(at(5000)).toEqual({ from: 3, to: 3, t: 0 });
});
test("uses the phone composition below 768px", () => {
  expect(compositionFor(767).map((c) => c.opacity)).toEqual([0.25, 0.2, 0.12, 0.25]);
  expect(compositionFor(768).map((c) => c.opacity)).toEqual([0.75, 0.3, 0.18, 0.7]);
});
test.each([sphereShape, waveShape, driftShape, ringShape, scatterShape])(
  "%o returns count * 3 finite values",
  (shape) => {
    const points = shape(100);
    expect(points).toHaveLength(300);
    expect(points.every(Number.isFinite)).toBe(true);
  }
);
test("ring leaves a hole for the Contact text", () => {
  const p = ringShape(200);
  for (let i = 0; i < 600; i += 3) {
    expect(Math.hypot(p[i], p[i + 1])).toBeGreaterThanOrEqual(RING_RADIUS - 0.2);
  }
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `pnpm exec vitest run src/components/__tests__/GoldField.test.tsx`
Expected: FAIL, module not found.

- [ ] **Step 3: Implement the pure functions in `src/components/GoldField.tsx`**

`stageAt` algorithm: build `anchors = [0, ...tops.map((top) => min(max(top - viewportHeight / 2, 0), maxScroll))]`. Walk the gaps. Skip a gap of zero or less. For the first gap where `scrollY < b`, `from` is the gap's start index, `to` is the last index whose anchor equals `b`, and `t = clamp((scrollY - a - 0.2 * gap) / (0.6 * gap), 0, 1)`. Past every gap, return the last index for both with `t = 0`.

`compositionFor` starting values, with the camera at `z = 6`, FOV 50 (visible height 5.6 units at `z = 0`):

| Stage | Desktop `x, y, scale, spin` | Phone `x, y, scale, spin` |
|---|---|---|
| sphere | `2.2, 0, 1, 0.12` | `0, 0.6, 0.8, 0.12` |
| wave | `0, 0, 1, 0` | `0, 0, 0.7, 0` |
| drift | `0, 0, 1, 0.03` | `0, 0, 0.8, 0.03` |
| ring | `0, 0, 1, 0` | `0, 0, 0.85, 0` |

Shapes: sphere shell of radius 1.7; wave as a jittered grid over `x` in -5 to 5 and `z` in -2.5 to 2.5; drift as a loose cloud spanning the view; ring in the XY plane at radius `RING_RADIUS` ± 0.2 with slight `z` jitter, so it faces the camera; scatter as a wide random box.

- [ ] **Step 4: Run tests to verify they pass**

Run: `pnpm exec vitest run src/components/__tests__/GoldField.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/GoldField.tsx src/components/__tests__/GoldField.test.tsx
git commit -m "feat: add gold field stage logic and shapes"
```

### Task 3: Gold field scene, mounting and transparent sections

**Files:**
- Modify: `src/components/GoldField.tsx`, `src/App.tsx`, `src/setupTests.ts`, `src/components/LandingSection.tsx:43`, `AboutSection.tsx:10`, `ProjectsSection.tsx:33,50,76`, `ContactMeSection.tsx:18`, `Footer.tsx:7`, `Card.tsx:30`
- Test: `src/components/__tests__/GoldField.test.tsx`

**Interfaces:**
- Consumes: everything from Task 2.
- Produces: default export `GoldField(): JSX.Element`, a wrapper with `data-testid="gold-field"` and `aria-hidden`.

- [ ] **Step 1: Stub the canvas context in `src/setupTests.ts`**

`HTMLCanvasElement.prototype.getContext = (() => null) as any;`

- [ ] **Step 2: Write the failing lifecycle tests**

Mock only the renderer, keeping the rest of `three` real:

```tsx
vi.mock("three", async (importOriginal) => ({
  ...(await importOriginal<typeof import("three")>()),
  WebGLRenderer: vi.fn(),
}));

const fakeRenderer = () => ({
  domElement: document.createElement("canvas"),
  setPixelRatio: vi.fn(),
  setSize: vi.fn(),
  setAnimationLoop: vi.fn(),
  render: vi.fn(),
  dispose: vi.fn(),
  forceContextLoss: vi.fn(),
});

test("leaves no canvas when WebGL is unavailable", () => {
  vi.mocked(WebGLRenderer).mockImplementation(function () {
    throw new Error("no WebGL");
  } as any);
  const { container } = render(<GoldField />);
  expect(container.querySelector("canvas")).toBeNull();
});

test("mounts a hidden canvas", () => {
  const fake = fakeRenderer();
  vi.mocked(WebGLRenderer).mockImplementation(function () {
    return fake;
  } as any);
  render(<GoldField />);
  expect(screen.getByTestId("gold-field")).toHaveAttribute("aria-hidden", "true");
  expect(screen.getByTestId("gold-field")).toContainElement(fake.domElement);
});

test("releases the context on unmount", () => {
  const fake = fakeRenderer();
  vi.mocked(WebGLRenderer).mockImplementation(function () {
    return fake;
  } as any);
  const { unmount } = render(<GoldField />);
  unmount();
  expect(fake.setAnimationLoop).toHaveBeenLastCalledWith(null);
  expect(fake.dispose).toHaveBeenCalled();
  expect(fake.forceContextLoss).toHaveBeenCalled();
  expect(fake.domElement.isConnected).toBe(false);
});
```

- [ ] **Step 3: Run tests to verify they fail**

Run: `pnpm exec vitest run src/components/__tests__/GoldField.test.tsx`
Expected: the three lifecycle tests FAIL; no default export yet.

- [ ] **Step 4: Implement `GoldField` as the default export**

Wrapper: `Box` with `position="fixed"`, `top={0} left={0} w="100%" h="100lvh"`, `zIndex={0}`, `pointerEvents="none"`, `aria-hidden`, `data-testid="gold-field"`.

One `useEffect` with `[]` deps does all the work:

- Create `WebGLRenderer({ alpha: true })` in `try/catch`; on failure return. Set pixel ratio `min(devicePixelRatio, 2)`, append `domElement`.
- `PerspectiveCamera(50, aspect, 0.1, 100)` at `z = 6`. `count = innerWidth < 768 ? 2500 : 6000`.
- `PointsMaterial` with `color: "#C9A843"`, `transparent: true`, `opacity: 0`, `depthWrite: false`, `blending: AdditiveBlending`, `size` about 0.03, `map` from a soft-dot `CanvasTexture`. The dot helper returns `null` when `getContext("2d")` is null.
- A `ResizeObserver` on the wrapper updates the renderer size, camera aspect and `compositionFor(clientWidth)`.
- `pointermove` on `window` sets a tilt target within ±0.15 rad.

`setAnimationLoop((time) => ...)` each frame:

1. `mix = stageAt(scrollY, ["about", "work", "contact"].map(topOf), innerHeight, scrollHeight - innerHeight)`, where `topOf` reads `getElementById(id)` and `getBoundingClientRect().top + scrollY`, so Firestore height changes are picked up.
2. `assembled` eases 0 to 1 over 1.8s from the first frame.
3. Write each position: lerp `shapes[mix.from]` to `shapes[mix.to]` by `mix.t`, then lerp from `scatter` by `assembled`. Add a gentle `sin` ripple to `y`, weighted by how much the current mix is wave.
4. Lerp group `x, y, scale` between the two compositions by `mix.t`. Ease `material.opacity` toward the lerped opacity.
5. Rotation: keep the form's spin while settling flat forms facing the camera.

```ts
const spin = lerp(comp[mix.from].spin, comp[mix.to].spin, mix.t);
yaw += spin * dt;
if (spin === 0) yaw += (Math.round(yaw / TAU) * TAU - yaw) * 0.06;
group.rotation.y = yaw + tiltY;
```

Cleanup: `setAnimationLoop(null)`, disconnect the observer, remove the listener, dispose geometry, material and texture, then `renderer.dispose()`, `forceContextLoss()`, and `domElement.remove()`.

- [ ] **Step 5: Run tests to verify they pass**

Run: `pnpm exec vitest run src/components/__tests__/GoldField.test.tsx`
Expected: PASS.

- [ ] **Step 6: Mount in `src/App.tsx` and make sections transparent**

Use the block from the spec: `lazy`, `Suspense fallback={null}`, `MotionConfig reducedMotion="user"`, `useReducedMotion`, and `<Box as="main" position="relative" zIndex={1}>`.

`ChakraProvider` stays outermost, and `theme` keeps its body background. Remove `bg` from each listed section. Change the `Card.tsx` background to `rgba(13,12,10,0.72)`.

- [ ] **Step 7: Run the full suite and build**

Run: `pnpm run test:ci && pnpm run build`
Expected: all tests pass. Build output lists a separate chunk containing Three.js.

- [ ] **Step 8: Commit**

```bash
git add src
git commit -m "feat: add scroll-driven gold field behind the page"
```

### Task 4: Hero intro

**Files:**
- Modify: `src/components/LandingSection.tsx`
- Test: `src/components/__tests__/LandingSection.test.tsx`, create `src/__tests__/reducedMotion.test.tsx`

**Interfaces:**
- Consumes: `createScope`, `createTimeline`, `stagger`, `utils` from `animejs`; `useReducedMotion` from `framer-motion`.
- Produces: `data-intro` attributes with values `hairline`, `eyebrow`, `line`, `fade`, `photo`.

- [ ] **Step 1: Write the failing tests**

In `LandingSection.test.tsx`:

```tsx
test("keeps each headline line in one text node", () => {
  render(<LandingSection />);
  for (const line of ["Crafting digital", "products with", "precision", "and care."]) {
    expect(screen.getByText(line)).toBeInTheDocument();
  }
});
```

New `src/__tests__/reducedMotion.test.tsx`, mocking `useReducedMotion` to `true` via `vi.mock("framer-motion", async (importOriginal) => ({ ...(await importOriginal<typeof import("framer-motion")>()), useReducedMotion: () => true }))`, and mocking `useProjects` as `integration.test.tsx` does. A module mock is needed because `useReducedMotion` caches its value at first use:

```tsx
test("reduced motion shows everything with no field", () => {
  const { container } = render(<App />);
  expect(screen.queryByTestId("gold-field")).toBeNull();
  container.querySelectorAll<HTMLElement>("[data-intro]").forEach((el) => {
    expect(el.style.opacity).toBe("");
    expect(el.style.transform).toBe("");
    expect(el.style.clipPath).toBe("");
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `pnpm exec vitest run src/components/__tests__/LandingSection.test.tsx src/__tests__/reducedMotion.test.tsx`
Expected: the headline test FAILS. The reduced-motion test passes without proving much until `data-intro` exists, which is acceptable: it pins the behaviour against this task's code.

- [ ] **Step 3: Restructure the headline**

Remove the `<br />`s. Each of the four lines becomes:

```tsx
<Box as="span" display="block" overflow="hidden" pb="0.12em" mb="-0.12em">
  <Box as="span" display="block" data-intro="line">Crafting digital</Box>
</Box>
```

The "precision" line keeps `color={GOLD} fontStyle="italic"`. Add `data-intro` to the eyebrow hairline (`hairline`), eyebrow text (`eyebrow`), bio and CTA row (`fade`), and the photo wrapper (`photo`).

- [ ] **Step 4: Implement the intro timeline**

`useLayoutEffect` with `[reduced]` deps, returning early when `reduced`. Inside `createScope({ root }).add(...)`, where `root` is a `useRef` on the section:

1. `utils.set` hides targets: hairline `scaleX: 0` with `transformOrigin: "left"`, eyebrow and `fade` `opacity: 0`, lines `translateY: "110%"`, photo `clipPath: "inset(100% 0% 0% 0%)"`.
2. `createTimeline({ defaults: { ease: "outExpo" } })` adds hairline (400ms), eyebrow (300ms), lines (`stagger(120)`, 700ms each), `fade` targets, and photo (900ms to `inset(0% 0% 0% 0%)`, overlapping the lines). Total at most 2000ms.

Return `() => scope.revert()`.

- [ ] **Step 5: Stop the marquee under reduced motion**

Add `sx={{ "@media (prefers-reduced-motion: reduce)": { animation: "none" } }}` to the marquee `Box` at line 204.

- [ ] **Step 6: Run tests to verify they pass**

Run: `pnpm exec vitest run src/components/__tests__/LandingSection.test.tsx src/__tests__/reducedMotion.test.tsx`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src
git commit -m "feat: add anime.js hero intro"
```

### Task 5: Project count-up and section hairlines

**Files:**
- Create: `src/components/Hairline.tsx`
- Modify: `src/components/ProjectsSection.tsx:79,103-111`, `src/components/AboutSection.tsx:16`
- Test: `src/components/__tests__/ProjectsSection.test.tsx`

**Interfaces:**
- Consumes: `animate` from `animejs`; `useInView`, `useReducedMotion` from `framer-motion`.
- Produces: `Hairline({ w }: { w: string })`, `ProjectCount({ count }: { count: number })` (local to `ProjectsSection.tsx`).

- [ ] **Step 1: Write the failing test**

```tsx
test("project count label is one text node", () => {
  vi.mocked(useProjects).mockReturnValue({
    projects: [mockProjects[0]],
    loading: false,
    error: null,
    refetch: vi.fn(),
  });
  render(<ProjectsSection />);
  expect(screen.getByText("1 project").childNodes).toHaveLength(1);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm exec vitest run src/components/__tests__/ProjectsSection.test.tsx`
Expected: FAIL, received length 2, because React renders the number and the word as separate text nodes today.

- [ ] **Step 3: Implement `ProjectCount` in `ProjectsSection.tsx`**

It must be its own component: `useInView` binds only once, at mount, so a ref on an element that appears after `loading` ends would never fire. Render one template string, `` `${count} project${count !== 1 ? "s" : ""}` ``, in the existing `Text` props.

An effect on `[inView, count, reduced]` runs `animate({ n: 0 }, { n: count, duration: 900, ease: "outExpo", onUpdate })`, where `onUpdate` writes the rounded label to `ref.current.textContent`. Skip when `reduced` or not in view. Cancel on cleanup.

- [ ] **Step 4: Implement `src/components/Hairline.tsx`**

`Box` with `h="1px"`, `w={w}`, `bg="#C9A843"`, `flexShrink={0}`, `transformOrigin="left"`, and `transform="scaleX(0)"` unless `reduced`. On first `useInView` (once), `animate(ref.current, { scaleX: [0, 1], duration: 700, ease: "outExpo" })`. Replace the label hairlines at `ProjectsSection.tsx:79` and `AboutSection.tsx:16` with `<Hairline w="16px" />`.

- [ ] **Step 5: Run tests to verify they pass**

Run: `pnpm exec vitest run src/components/__tests__/ProjectsSection.test.tsx`
Expected: PASS, including `/4 projects/` at line 174.

- [ ] **Step 6: Commit**

```bash
git add src
git commit -m "feat: add project count-up and hairline draws"
```

### Task 6: Scroll progress and nav marker

**Files:**
- Create: `src/hooks/useActiveSection.ts`
- Modify: `src/components/Header.tsx`
- Test: `src/hooks/__tests__/useActiveSection.test.tsx`

**Interfaces:**
- Produces: `useActiveSection(ids: string[]): string | null`

- [ ] **Step 1: Write the failing tests**

Replace `global.IntersectionObserver` with a class that stores its callback, append elements with ids `about` and `work` to the document, then:

```tsx
const { result } = renderHook(() => useActiveSection(IDS));
fire([{ target: about, isIntersecting: true }]);
expect(result.current).toBe("about");

fire([
  { target: work, isIntersecting: true },
  { target: about, isIntersecting: false },
]);
expect(result.current).toBe("work");

fire([{ target: work, isIntersecting: false }]);
expect(result.current).toBeNull();
```

Wrap each `fire` in `act`. Also assert the observer's options contain `rootMargin: "-50% 0px -50% 0px"`, and that it disconnects on unmount.

- [ ] **Step 2: Run tests to verify they fail**

Run: `pnpm exec vitest run src/hooks/__tests__/useActiveSection.test.tsx`
Expected: FAIL, module not found.

- [ ] **Step 3: Implement the hook**

For each entry: `setActive((cur) => (entry.isIntersecting ? id : cur === id ? null : cur))`. This order-independent update also clears the marker when scrolling back up to the hero, which is not observed.

- [ ] **Step 4: Run tests to verify they pass**

Run: `pnpm exec vitest run src/hooks/__tests__/useActiveSection.test.tsx`
Expected: PASS.

- [ ] **Step 5: Add both to `Header.tsx`**

- Module constant `sectionIds = navLinks.map((l) => l.id)`, so the hook's input stays stable.
- Desktop nav button gets `position="relative"`. When `active === id`, render `<MotionBox as="span" layoutId="nav-active" position="absolute" bottom="-6px" left={0} right={0} h="1px" bg={GOLD} transition={{ duration: 0.35, ease: "easeOut" }} />`.
- Progress bar: `scaleX = useSpring(useScroll().scrollYProgress, { stiffness: 120, damping: 30 })`. Render a `MotionBox` as the last child of the header, `position="absolute" bottom="-1px" left={0} right={0} h="2px" bg={GOLD}` with `style={{ scaleX, transformOrigin: "0%" }}`.

- [ ] **Step 6: Run the full suite**

Run: `pnpm run test:ci`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src
git commit -m "feat: add scroll progress bar and active nav marker"
```

### Task 7: Card tilt and Contact reveal

**Files:**
- Modify: `src/components/Card.tsx`, `src/components/ContactMeSection.tsx`
- Test: `src/components/__tests__/Card.test.tsx`

**Interfaces:**
- Produces: named export `tiltFrom(clientX: number, clientY: number, rect: Pick<DOMRect, "left" | "top" | "width" | "height">): { rotateX: number; rotateY: number }` from `Card.tsx`.

- [ ] **Step 1: Write the failing tests**

```tsx
const RECT = { left: 100, top: 200, width: 400, height: 200 };

test("tilt is flat at the centre", () => {
  const { rotateX, rotateY } = tiltFrom(300, 300, RECT);
  expect(rotateX).toBeCloseTo(0);
  expect(rotateY).toBeCloseTo(0);
});

test("tilt peaks at 3 degrees in the corners", () => {
  expect(tiltFrom(500, 200, RECT)).toEqual({ rotateX: 3, rotateY: 3 });
  expect(tiltFrom(100, 400, RECT)).toEqual({ rotateX: -3, rotateY: -3 });
});

test("tilt stays flat for a zero-size rect", () => {
  expect(tiltFrom(10, 10, { left: 0, top: 0, width: 0, height: 0 })).toEqual({
    rotateX: 0,
    rotateY: 0,
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `pnpm exec vitest run src/components/__tests__/Card.test.tsx`
Expected: FAIL, `tiltFrom` is not exported.

- [ ] **Step 3: Implement the tilt**

Implement `tiltFrom`. Use `const MotionAnchor = motion.create(chakra.a)` for the outer element, because `motion.create(Box)` loses the `href` type. Springs are `useSpring(0, { stiffness: 150, damping: 26 })`, which do not overshoot. `onPointerMove` handles `pointerType === "mouse"` only; `onPointerLeave` resets to 0; omit both handlers under reduced motion. Set `style={{ rotateX, rotateY, transformPerspective: 900 }}`.

Motion consumes the `transition` prop, so replace it with `sx={{ transition: "border-color 0.3s ease, background 0.3s ease" }}`.

- [ ] **Step 4: Wrap the Contact card in `ContactMeSection.tsx`**

Add `const MotionBox = motion.create(Box);`, and use the bordered card's props plus the reveal props from `AboutSection.tsx:32-35`.

- [ ] **Step 5: Run the full suite**

Run: `pnpm run test:ci`
Expected: PASS, including the unchanged `getByRole("link")` assertions.

- [ ] **Step 6: Commit**

```bash
git add src
git commit -m "feat: add card tilt and Contact reveal"
```

### Task 8: Browser tuning and full verification

**Files:**
- Modify: `src/components/GoldField.tsx` (composition and size values), any section where tuning shows a problem.

**Interfaces:**
- Consumes: the finished page. Values change; signatures do not. If a tested opacity changes, update the Task 2 test with it.

- [ ] **Step 1: Start the dev server**

Run in the background: `pnpm exec vite --open false`
Expected: serving on port 3000. If there is no `.env`, Firestore fails and Work shows its error state: say so, because project cards then need checking another way.

- [ ] **Step 2: Drive it with Playwright at 1440x900 and 390x844**

Screenshot the top of the page, each section, and a mid-morph scroll point.
Pass: the page opens on a whole sphere, body copy is readable at every stage on both sizes, console has no errors, and the morph follows scroll both ways with no snap. If legibility is in doubt, dim the field.

- [ ] **Step 3: Check card tilt, nav marker, progress bar and intro timing**

Pass: tilt has no overshoot; marker moves between sections and clears at the hero; intro ends within 2s; the "p" descender in "precision" is not clipped.

- [ ] **Step 4: Emulate `prefers-reduced-motion: reduce` and reload**

Pass: no canvas, no intro, marquee static, all text visible.

- [ ] **Step 5: Force the no-WebGL path**

Launch with WebGL disabled, or stub `getContext` before load.
Pass: the page renders normally with no canvas.

- [ ] **Step 6: Run the full checks**

Run: `pnpm run format:check && pnpm run test:ci && pnpm run build`
Expected: all pass. Record the main chunk and Three.js chunk sizes for the report. Baseline main chunk: 1,046,966 bytes.

- [ ] **Step 7: Update the graph**

Run: `graphify update .`
Expected: completes without error.

- [ ] **Step 8: Commit**

```bash
git add src
git commit -m "style: tune gold field after browser review"
```
