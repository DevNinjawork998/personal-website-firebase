import { render } from "../../test-utils";
import { describe, test, expect } from "vitest";
import Hairline from "../Hairline";

describe("Hairline Component", () => {
  test("stays collapsed until it scrolls into view", () => {
    const { container } = render(<Hairline w="16px" />);
    expect(container.firstChild).toHaveStyle("transform: scaleX(0)");
  });
});
