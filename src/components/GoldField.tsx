export type StageMix = { from: number; to: number; t: number };

export type Composition = {
  opacity: number;
  x: number;
  y: number;
  scale: number;
  spin: number;
};

export const RING_RADIUS = 2.4;

const PHONE_WIDTH = 768;
const HOLD = 0.2;

// Stages in page order: sphere, wave, drift, ring
const DESKTOP: Composition[] = [
  { opacity: 0.75, x: 2.2, y: 0, scale: 1, spin: 0.12 },
  { opacity: 0.3, x: 0, y: 0, scale: 1, spin: 0 },
  { opacity: 0.18, x: 0, y: 0, scale: 1, spin: 0.03 },
  { opacity: 0.7, x: 0, y: 0, scale: 1, spin: 0 },
];

const PHONE: Composition[] = [
  { opacity: 0.25, x: 0, y: 0.6, scale: 0.8, spin: 0.12 },
  { opacity: 0.2, x: 0, y: 0, scale: 0.7, spin: 0 },
  { opacity: 0.12, x: 0, y: 0, scale: 0.8, spin: 0.03 },
  { opacity: 0.25, x: 0, y: 0, scale: 0.85, spin: 0 },
];

export const compositionFor = (width: number) => (width < PHONE_WIDTH ? PHONE : DESKTOP);

export const stageAt = (
  scrollY: number,
  sectionTops: number[],
  viewportHeight: number,
  maxScroll: number
): StageMix => {
  const anchors = [
    0,
    ...sectionTops.map((top) => Math.min(Math.max(top - viewportHeight / 2, 0), maxScroll)),
  ];
  const last = anchors.length - 1;

  for (let i = 0; i < last; i++) {
    const gap = anchors[i + 1] - anchors[i];
    if (gap <= 0 || scrollY >= anchors[i + 1]) continue;

    const progress = (scrollY - anchors[i]) / gap;
    const t = Math.min(Math.max((progress - HOLD) / (1 - 2 * HOLD), 0), 1);
    return { from: i, to: anchors.lastIndexOf(anchors[i + 1]), t };
  }

  return { from: last, to: last, t: 0 };
};

const spread = (width: number) => (Math.random() - 0.5) * width;

const buildShape = (count: number, point: (i: number) => [number, number, number]) => {
  const shape = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) shape.set(point(i), i * 3);
  return shape;
};

export const sphereShape = (count: number) =>
  buildShape(count, () => {
    const y = Math.random() * 2 - 1;
    const angle = Math.random() * Math.PI * 2;
    const radius = Math.sqrt(1 - y * y);
    return [1.7 * radius * Math.cos(angle), 1.7 * y, 1.7 * radius * Math.sin(angle)];
  });

export const waveShape = (count: number) => {
  const columns = Math.ceil(Math.sqrt(count * 2));
  const rows = Math.ceil(count / columns);
  return buildShape(count, (i) => {
    const x = ((i % columns) / columns - 0.5) * 10 + spread(0.03);
    const z = (Math.floor(i / columns) / rows - 0.5) * 5 + spread(0.03);
    return [x, 0.35 * Math.sin(x * 1.2) * Math.cos(z * 1.1), z];
  });
};

export const driftShape = (count: number) =>
  buildShape(count, () => [spread(9), spread(6), spread(4)]);

export const ringShape = (count: number) =>
  buildShape(count, () => {
    const angle = Math.random() * Math.PI * 2;
    const radius = RING_RADIUS + spread(0.36);
    return [radius * Math.cos(angle), radius * Math.sin(angle), spread(0.2)];
  });

export const scatterShape = (count: number) =>
  buildShape(count, () => [spread(14), spread(10), spread(8)]);
