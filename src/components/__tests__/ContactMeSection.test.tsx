import React from "react";
import { render, screen } from "../../test-utils";
import { describe, test, expect } from "vitest";
import ContactMeSection from "../ContactMeSection";

describe("ContactMeSection Component", () => {
  test("renders section label", () => {
    render(<ContactMeSection />);
    expect(screen.getByText(/Let's Talk/i)).toBeInTheDocument();
  });

  test("renders main headline", () => {
    render(<ContactMeSection />);
    expect(screen.getByText(/Have a project in mind/)).toBeInTheDocument();
  });

  test("renders italic tagline", () => {
    render(<ContactMeSection />);
    expect(screen.getByText(/Let's make it real/)).toBeInTheDocument();
  });

  test("renders email CTA link", () => {
    render(<ContactMeSection />);
    const emailLink = screen.getByRole("link", { name: /thooi998@gmail\.com/i });
    expect(emailLink).toBeInTheDocument();
    expect(emailLink).toHaveAttribute("href", "mailto:thooi998@gmail.com");
  });

  test("renders social icon links", () => {
    render(<ContactMeSection />);
    const links = screen.getAllByRole("link");
    // Email CTA + 3 social icon links = at least 4
    expect(links.length).toBeGreaterThanOrEqual(4);
  });

  test("email CTA opens in mailto", () => {
    render(<ContactMeSection />);
    const emailLink = screen.getByRole("link", { name: /thooi998@gmail\.com/i });
    expect(emailLink).toHaveAttribute("href", expect.stringContaining("mailto:"));
  });

  test("has proper heading structure", () => {
    render(<ContactMeSection />);
    const headings = screen.getAllByRole("heading");
    expect(headings.length).toBeGreaterThan(0);
  });
});
