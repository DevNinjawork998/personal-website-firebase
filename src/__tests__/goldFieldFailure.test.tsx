import { act, render, screen } from "../test-utils";
import { expect, test, vi } from "vitest";
import App from "../App";

vi.mock("../components/GoldField", () => {
  throw new Error("chunk failed to load");
});

vi.mock("../hooks/useProjects", () => ({
  useProjects: () => ({ projects: [], loading: false, error: null, refetch: vi.fn() }),
}));

test("keeps the page when the decorative gold field fails to load", async () => {
  render(<App />);
  await act(() => new Promise((resolve) => setTimeout(resolve, 50)));

  expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
});
