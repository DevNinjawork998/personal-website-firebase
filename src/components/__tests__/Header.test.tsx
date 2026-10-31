import { fireEvent, render, screen } from "../../test-utils";
import { expect, test, vi } from "vitest";
import Header from "../Header";

vi.mock("../../hooks/useActiveSection", () => ({ useActiveSection: () => "work" }));

test("marks the current section in the phone menu", async () => {
  render(<Header />);
  fireEvent.click(screen.getByRole("button", { name: "Open menu" }));

  const work = await screen.findByText("Work");
  expect(work.querySelector("span")).toBeInTheDocument();
  expect(screen.getByText("About").querySelector("span")).toBeNull();
});
