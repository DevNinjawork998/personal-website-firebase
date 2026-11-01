import { fireEvent, render, screen } from "../../test-utils";
import { describe, expect, test } from "vitest";
import ProjectDeck, { swipeDirection } from "../ProjectDeck";

const cards = ["One", "Two", "Three"].map((title) => (
  <a key={title} href={`https://${title}.test`}>
    {title}
  </a>
));

const next = () => fireEvent.click(screen.getByRole("button", { name: "Next project" }));
const previous = () => fireEvent.click(screen.getByRole("button", { name: "Previous project" }));

describe("swipeDirection", () => {
  test("stays put for a small slow drag", () => {
    expect(swipeDirection(60, 100)).toBe(0);
    expect(swipeDirection(-60, -100)).toBe(0);
  });

  test("goes once dragged far enough", () => {
    expect(swipeDirection(120, 0)).toBe(1);
    expect(swipeDirection(-120, 0)).toBe(-1);
  });

  test("goes on a fast flick", () => {
    expect(swipeDirection(20, 800)).toBe(1);
    expect(swipeDirection(-20, -800)).toBe(-1);
  });
});

describe("ProjectDeck", () => {
  test("starts on the first card with a counter", () => {
    render(<ProjectDeck cards={cards} />);
    expect(screen.getByText("1 / 3")).toHaveAttribute("aria-live", "polite");
  });

  test("keeps every project in the page but only the top one interactive", () => {
    render(<ProjectDeck cards={cards} />);
    expect(screen.getAllByRole("link")).toHaveLength(1);
    expect(screen.getByRole("link", { name: "One" })).toBeVisible();
    expect(screen.getByText("Two").closest("[inert]")).not.toBeNull();
    expect(screen.getByText("Three").closest("[inert]")).not.toBeNull();
  });

  test("backs each card so cards behind never show through its text", () => {
    render(<ProjectDeck cards={cards} />);
    expect(screen.getByTestId("deck-top")).toHaveStyle("background: #0D0C0A");
  });

  test("lets the top card be dragged sideways without blocking page scroll", () => {
    render(<ProjectDeck cards={cards} />);
    expect(screen.getByTestId("deck-top").style.touchAction).toBe("pan-y");
  });

  test("next moves to the following project", async () => {
    render(<ProjectDeck cards={cards} />);
    next();
    expect(await screen.findByText("2 / 3")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Two" })).toBeInTheDocument();
  });

  test("next loops from the last project to the first", async () => {
    render(<ProjectDeck cards={cards} />);
    previous();
    expect(await screen.findByText("3 / 3")).toBeInTheDocument();
    next();
    expect(await screen.findByText("1 / 3")).toBeInTheDocument();
  });

  test("hides the controls for a single project", () => {
    render(<ProjectDeck cards={cards.slice(0, 1)} />);
    expect(screen.getByRole("link", { name: "One" })).toBeInTheDocument();
    expect(screen.queryByRole("button")).toBeNull();
  });

  test("renders nothing without projects", () => {
    const { container } = render(<ProjectDeck cards={[]} />);
    expect(container.querySelector("[data-testid=deck-top]")).toBeNull();
    expect(screen.queryByRole("button")).toBeNull();
  });
});
