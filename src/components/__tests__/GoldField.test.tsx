import { render, screen } from "../../test-utils";
import { describe, test, expect, vi } from "vitest";
import { WebGLRenderer } from "three";
import GoldField, {
  RING_RADIUS,
  VIEW_HEIGHT,
  compositionFor,
  dotSize,
  driftShape,
  ringShape,
  scatterShape,
  sphereShape,
  stageAt,
  waveShape,
} from "../GoldField";

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

const stubRenderer = (renderer: ReturnType<typeof fakeRenderer>) => {
  vi.mocked(WebGLRenderer).mockImplementation(function () {
    return renderer;
  } as any);
};

describe("GoldField", () => {
  test("leaves no canvas when WebGL is unavailable", () => {
    vi.mocked(WebGLRenderer).mockImplementation(function () {
      throw new Error("no WebGL");
    } as any);
    const { container } = render(<GoldField />);
    expect(container.querySelector("canvas")).toBeNull();
  });

  test("mounts a canvas hidden from assistive tech", () => {
    const renderer = fakeRenderer();
    stubRenderer(renderer);
    render(<GoldField />);
    const field = screen.getByTestId("gold-field");
    expect(field).toHaveAttribute("aria-hidden", "true");
    expect(field).toContainElement(renderer.domElement);
  });

  test("releases the WebGL context on unmount", () => {
    const renderer = fakeRenderer();
    stubRenderer(renderer);
    const { unmount } = render(<GoldField />);
    unmount();
    expect(renderer.setAnimationLoop).toHaveBeenLastCalledWith(null);
    expect(renderer.dispose).toHaveBeenCalled();
    expect(renderer.forceContextLoss).toHaveBeenCalled();
    expect(renderer.domElement.isConnected).toBe(false);
  });

  test("leans toward a finger dragging across the screen", () => {
    const renderer = fakeRenderer();
    stubRenderer(renderer);
    render(<GoldField />);

    window.dispatchEvent(
      Object.assign(new Event("touchmove"), { touches: [{ clientX: 100, clientY: 0 }] })
    );
    renderer.setAnimationLoop.mock.calls[0][0](16);

    const [scene] = renderer.render.mock.lastCall!;
    expect(scene.children[0].rotation.x).toBeLessThan(0);
  });
});

// Anchors become 0, 500, 1050, 3050
const TOPS = [950, 1500, 3500];
const at = (scrollY: number) => stageAt(scrollY, TOPS, 900, 3900);

describe("stageAt", () => {
  test("opens on a whole sphere", () => {
    expect(at(0)).toEqual({ from: 0, to: 1, t: 0 });
  });

  test("holds for the first 20% of a gap", () => {
    expect(at(100).t).toBe(0);
  });

  test("is halfway at the middle of a gap", () => {
    expect(at(250).t).toBeCloseTo(0.5);
  });

  test("holds for the last 20% of a gap", () => {
    expect(at(400).t).toBe(1);
  });

  test("does not jump across an anchor", () => {
    expect(at(499)).toEqual({ from: 0, to: 1, t: 1 });
    expect(at(500)).toEqual({ from: 1, to: 2, t: 0 });
  });

  test("clamps the last anchor to maxScroll", () => {
    const clamped = (scrollY: number) => stageAt(scrollY, [950, 1500, 5000], 900, 3900);
    expect(clamped(3899)).toEqual({ from: 2, to: 3, t: 1 });
    expect(clamped(3900)).toEqual({ from: 3, to: 3, t: 0 });
  });

  test("skips zero-length gaps on a short page", () => {
    const short = (scrollY: number) => stageAt(scrollY, [950, 1500, 1600], 900, 900);
    expect(short(700)).toEqual({ from: 1, to: 3, t: 0.5 });
    expect(short(900)).toEqual({ from: 3, to: 3, t: 0 });
  });

  test("survives overscroll", () => {
    expect(at(-20).t).toBe(0);
    expect(at(5000)).toEqual({ from: 3, to: 3, t: 0 });
  });
});

describe("compositionFor", () => {
  const PORTRAIT = { left: 460, top: 340, width: 300, height: 400 };
  const PHONE = compositionFor(390, 844);
  const TABLET = compositionFor(820, 1180, PORTRAIT);
  const DESKTOP = compositionFor(1440, 900);

  test("keeps desktop brightness on every screen", () => {
    const opacities = DESKTOP.map((stage) => stage.opacity);
    expect(PHONE.map((stage) => stage.opacity)).toEqual(opacities);
    expect(TABLET.map((stage) => stage.opacity)).toEqual(opacities);
  });

  test("switches layout at 768px, where the hero stacks", () => {
    expect(compositionFor(767, 1024, PORTRAIT)[0].x).toBe(0);
    expect(compositionFor(768, 1024, PORTRAIT)[0].x).toBeGreaterThan(0);
  });

  test("centres the sphere on the portrait once perspective pushes it outward", () => {
    const { x, y, scale } = TABLET[0];
    const pushedOut = 1 / (1 - ((1.7 * scale) / 6) ** 2);
    const unitsPerPixel = VIEW_HEIGHT / 1180;
    expect(x * pushedOut).toBeCloseTo((610 - 410) * unitsPerPixel);
    expect(y * pushedOut).toBeCloseTo((590 - 540) * unitsPerPixel);
  });

  test("grows the sphere with the portrait", () => {
    const larger = { ...PORTRAIT, width: 600, height: 800 };
    expect(compositionFor(820, 1180, larger)[0].scale).toBeCloseTo(TABLET[0].scale * 2);
  });

  test("shrinks the ring to stay on a narrow tablet", () => {
    const halfWidth = ((VIEW_HEIGHT / 2) * 820) / 1180;
    expect(TABLET[3].scale * RING_RADIUS).toBeLessThan(halfWidth);
  });

  test("keeps the ring full size on desktop", () => {
    expect(DESKTOP[3].scale).toBe(1);
  });
});

describe("dotSize", () => {
  test("keeps dots the same size on screen at any viewport height", () => {
    expect(dotSize(1180) * 1180).toBeCloseTo(dotSize(844) * 844);
    expect(dotSize(900)).toBeCloseTo(0.035, 3);
  });
});

describe("shapes", () => {
  test.each([
    ["sphere", sphereShape],
    ["wave", waveShape],
    ["drift", driftShape],
    ["ring", ringShape],
    ["scatter", scatterShape],
  ])("%s returns count * 3 finite values", (_name, shape) => {
    const points = shape(100);
    expect(points).toHaveLength(300);
    expect(points.every(Number.isFinite)).toBe(true);
  });

  test("ring leaves a hole for the Contact text", () => {
    const points = ringShape(200);
    for (let i = 0; i < points.length; i += 3) {
      expect(Math.hypot(points[i], points[i + 1])).toBeGreaterThanOrEqual(RING_RADIUS - 0.2);
    }
  });
});
