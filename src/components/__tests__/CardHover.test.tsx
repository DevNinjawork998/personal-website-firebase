import { render, screen } from "../../test-utils";
import { expect, test } from "vitest";
import Card from "../Card";

// Own file: computed styles read wrongly after earlier renders in the same file
test("keeps a dark backing on hover so dust stays out of the text", () => {
  render(
    <Card title="Test" description="Text" imageSrc="test.jpg" url="https://x.test" index={0} />
  );
  const link = screen.getByRole("link");
  link.setAttribute("data-hover", "");

  const channels = getComputedStyle(link)
    .background.match(/[\d.]+/g)!
    .map(Number);
  expect(Math.max(...channels.slice(0, 3))).toBeLessThan(40);
  expect(channels[3]).toBeGreaterThanOrEqual(0.7);
});
