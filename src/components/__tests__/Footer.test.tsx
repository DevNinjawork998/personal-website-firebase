import { render, screen } from "../../test-utils";
import { expect, test } from "vitest";
import Footer from "../Footer";

test("is opaque so the code background never runs through its text", () => {
  render(<Footer />);
  expect(screen.getByRole("contentinfo")).toHaveStyle("background: #0D0C0A");
});
