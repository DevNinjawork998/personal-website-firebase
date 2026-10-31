import { describe, test, expect } from "vitest";
import {
  RING_RADIUS,
  compositionFor,
  driftShape,
  ringShape,
  scatterShape,
  sphereShape,
  stageAt,
  waveShape,
} from "../GoldField";

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
  test("uses the phone composition below 768px", () => {
    expect(compositionFor(767).map((c) => c.opacity)).toEqual([0.25, 0.2, 0.12, 0.25]);
    expect(compositionFor(768).map((c) => c.opacity)).toEqual([0.75, 0.3, 0.18, 0.7]);
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
