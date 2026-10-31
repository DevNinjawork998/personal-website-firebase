import { render, screen } from "../test-utils";
import { describe, test, expect, vi } from "vitest";
import App from "../App";

// useReducedMotion caches its first read, so it cannot be driven through matchMedia
vi.mock("framer-motion", async (importOriginal) => ({
  ...(await importOriginal<typeof import("framer-motion")>()),
  useReducedMotion: () => true,
}));

vi.mock("../hooks/useProjects", () => ({
  useProjects: () => ({ projects: [], loading: false, error: null, refetch: vi.fn() }),
}));

describe("reduced motion", () => {
  test("renders no gold field", () => {
    render(<App />);
    expect(screen.queryByTestId("gold-field")).toBeNull();
  });

  test("leaves the hero fully visible", () => {
    const { container } = render(<App />);
    const animated = container.querySelectorAll<HTMLElement>("[data-intro]");
    expect(animated.length).toBeGreaterThan(0);
    animated.forEach((element) => {
      expect(element.style.opacity).toBe("");
      expect(element.style.transform).toBe("");
      expect(element.style.clipPath).toBe("");
    });
  });
});
