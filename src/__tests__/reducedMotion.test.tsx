import { render, screen } from "../test-utils";
import { describe, test, expect, vi } from "vitest";
import App from "../App";
import Hairline from "../components/Hairline";
import { SNIPPETS } from "../components/CodeRail";

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

  test("draws hairlines at full length", () => {
    const { container } = render(<Hairline w="16px" />);
    expect(container.firstChild).not.toHaveStyle("transform: scaleX(0)");
  });

  test("shows the code fully typed with the rail fully lit", () => {
    render(<App />);
    expect(screen.getByTestId("typed-code").textContent).toBe(SNIPPETS.landing);
    expect(screen.getByTestId("rail-lit").style.clipPath).toBe("");
    expect(screen.queryByTestId("rail-head")).toBeNull();
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
