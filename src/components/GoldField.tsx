import { useEffect, useRef } from "react";
import { Box } from "@chakra-ui/react";
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  PerspectiveCamera,
  Points,
  PointsMaterial,
  Scene,
  WebGLRenderer,
} from "three";

const GOLD = "#C9A843";
const SECTION_IDS = ["about", "work", "contact"];
const TAU = Math.PI * 2;
const INTRO_MS = 1800;
const MAX_TILT = 0.15;
const WAVE_STAGE = 1;

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

const lerp = (from: number, to: number, t: number) => from + (to - from) * t;

const easeOut = (t: number) => 1 - (1 - t) ** 3;

const sectionTop = (id: string) =>
  (document.getElementById(id)?.getBoundingClientRect().top ?? Infinity) + window.scrollY;

const softDot = () => {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 32;
  const context = canvas.getContext("2d");
  if (!context) return null;

  const glow = context.createRadialGradient(16, 16, 0, 16, 16, 16);
  glow.addColorStop(0, "rgba(255,255,255,1)");
  glow.addColorStop(1, "rgba(255,255,255,0)");
  context.fillStyle = glow;
  context.fillRect(0, 0, 32, 32);
  return new CanvasTexture(canvas);
};

const GoldField = () => {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let renderer: WebGLRenderer;
    try {
      renderer = new WebGLRenderer({ alpha: true });
    } catch {
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    host.appendChild(renderer.domElement);

    const count = window.innerWidth < PHONE_WIDTH ? 2500 : 6000;
    const shapes = [sphereShape, waveShape, driftShape, ringShape].map((shape) => shape(count));
    const scatter = scatterShape(count);
    const positions = scatter.slice();

    const attribute = new BufferAttribute(positions, 3);
    const geometry = new BufferGeometry().setAttribute("position", attribute);
    const dot = softDot();
    const material = new PointsMaterial({
      color: GOLD,
      map: dot,
      size: 0.03,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      blending: AdditiveBlending,
    });
    const points = new Points(geometry, material);
    const scene = new Scene().add(points);
    const camera = new PerspectiveCamera(50, 1, 0.1, 100);
    camera.position.z = 6;

    let composition = compositionFor(host.clientWidth);
    const resize = () => {
      renderer.setSize(host.clientWidth, host.clientHeight);
      camera.aspect = host.clientWidth / host.clientHeight;
      camera.updateProjectionMatrix();
      composition = compositionFor(host.clientWidth);
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(host);

    const tiltTarget = { x: 0, y: 0 };
    const tilt = { x: 0, y: 0 };
    const onPointerMove = (event: PointerEvent) => {
      tiltTarget.x = (event.clientY / window.innerHeight - 0.5) * 2 * MAX_TILT;
      tiltTarget.y = (event.clientX / window.innerWidth - 0.5) * 2 * MAX_TILT;
    };
    window.addEventListener("pointermove", onPointerMove);

    let started: number | undefined;
    let previous = 0;
    let yaw = 0;

    renderer.setAnimationLoop((time) => {
      started ??= time;
      const dt = Math.min((time - previous) / 1000, 0.05);
      previous = time;
      const assembled = easeOut(Math.min((time - started) / INTRO_MS, 1));

      const { from, to, t } = stageAt(
        window.scrollY,
        SECTION_IDS.map(sectionTop),
        window.innerHeight,
        document.documentElement.scrollHeight - window.innerHeight
      );

      for (let i = 0; i < positions.length; i++) {
        positions[i] = lerp(scatter[i], lerp(shapes[from][i], shapes[to][i], t), assembled);
      }

      const ripple = (from === WAVE_STAGE ? 1 - t : 0) + (to === WAVE_STAGE ? t : 0);
      if (ripple > 0) {
        for (let i = 1; i < positions.length; i += 3) {
          positions[i] += ripple * 0.12 * Math.sin(positions[i - 1] * 1.4 + time / 1600);
        }
      }
      attribute.needsUpdate = true;

      const start = composition[from];
      const end = composition[to];
      points.position.set(lerp(start.x, end.x, t), lerp(start.y, end.y, t), 0);
      points.scale.setScalar(lerp(start.scale, end.scale, t));
      material.opacity += (lerp(start.opacity, end.opacity, t) - material.opacity) * 0.08;

      // Flat forms have no spin, so they settle back to face the camera
      const spin = lerp(start.spin, end.spin, t);
      yaw += spin * dt;
      if (spin === 0) yaw += (Math.round(yaw / TAU) * TAU - yaw) * 0.06;

      tilt.x += (tiltTarget.x - tilt.x) * 0.05;
      tilt.y += (tiltTarget.y - tilt.y) * 0.05;
      points.rotation.set(tilt.x, yaw + tilt.y, 0);

      renderer.render(scene, camera);
    });

    return () => {
      renderer.setAnimationLoop(null);
      observer.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      geometry.dispose();
      material.dispose();
      dot?.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <Box
      ref={hostRef}
      data-testid="gold-field"
      aria-hidden
      position="fixed"
      top={0}
      left={0}
      w="100%"
      h="100lvh"
      zIndex={0}
      pointerEvents="none"
    />
  );
};

export default GoldField;
