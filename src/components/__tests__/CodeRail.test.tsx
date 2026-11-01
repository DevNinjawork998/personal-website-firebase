import { render, screen, waitFor } from "../../test-utils";
import { beforeEach, describe, expect, test, vi } from "vitest";
import CodeRail, { SNIPPETS } from "../CodeRail";
import { useActiveSection } from "../../hooks/useActiveSection";

vi.mock("../../hooks/useActiveSection", () => ({ useActiveSection: vi.fn() }));

const typed = () => screen.getByTestId("typed-code");
const typedToEnd = (snippet: string) =>
  waitFor(() => expect(typed().textContent).toBe(snippet), { timeout: 3000 });

beforeEach(() => {
  vi.mocked(useActiveSection).mockReturnValue("about");
});

describe("CodeRail", () => {
  test("stays out of assistive tech and pointer input", () => {
    render(<CodeRail />);
    const layer = screen.getByTestId("code-rail");
    expect(layer).toHaveAttribute("aria-hidden", "true");
    expect(layer).toHaveStyle("pointer-events: none");
  });

  test("types the active section's snippet from empty to the end", async () => {
    render(<CodeRail />);
    expect(typed().textContent).not.toBe(SNIPPETS.about);
    await typedToEnd(SNIPPETS.about);
  });

  test("types a new snippet when the section changes", async () => {
    const { rerender } = render(<CodeRail />);
    await typedToEnd(SNIPPETS.about);

    vi.mocked(useActiveSection).mockReturnValue("contact");
    rerender(<CodeRail />);
    await typedToEnd(SNIPPETS.contact);
  });

  test("keeps the last snippet when no section is active", async () => {
    const { rerender } = render(<CodeRail />);
    await typedToEnd(SNIPPETS.about);

    vi.mocked(useActiveSection).mockReturnValue(null);
    rerender(<CodeRail />);
    expect(typed().textContent).toBe(SNIPPETS.about);
  });

  test("lights the rail only as far as the scroll head", () => {
    render(<CodeRail />);
    expect(screen.getByTestId("rail-lit").style.clipPath).toBe("inset(0 -100vw 88% -100vw)");
    expect(screen.getByTestId("rail-head").style.top).toBe("12%");
  });
});
