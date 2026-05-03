import React from "react";
import { render, screen } from "../../test-utils";
import { describe, test, expect } from "vitest";
import LandingSection from "../LandingSection";

describe("LandingSection Component", () => {
  test("renders heading element that will display greeting", () => {
    render(<LandingSection />);
    const headings = screen.getAllByRole("heading");
    expect(headings.length).toBeGreaterThan(0);
  });

  test("renders hero headline text", () => {
    render(<LandingSection />);
    expect(screen.getByText(/Crafting digital/)).toBeInTheDocument();
    expect(screen.getByText(/precision/)).toBeInTheDocument();
    expect(screen.getByText(/and care/)).toBeInTheDocument();
  });

  test("renders bio with name and company", () => {
    render(<LandingSection />);
    expect(screen.getByText(/Jack Ooi/)).toBeInTheDocument();
    expect(screen.getByText(/bp Malaysia/)).toBeInTheDocument();
  });

  test("renders eyebrow label with location", () => {
    render(<LandingSection />);
    expect(screen.getByText(/Software Engineer/)).toBeInTheDocument();
    expect(screen.getByText(/Kuala Lumpur/)).toBeInTheDocument();
  });

  test("renders profile image with correct alt text", () => {
    render(<LandingSection />);
    const profileImage = screen.getByAltText("Jack Ooi");
    expect(profileImage).toBeInTheDocument();
  });

  test("renders est. and location metadata", () => {
    render(<LandingSection />);
    expect(screen.getByText(/Est. 1997/i)).toBeInTheDocument();
    expect(screen.getByText(/KL, MY/)).toBeInTheDocument();
  });

  test("renders skills marquee items", () => {
    render(<LandingSection />);
    const typescript = screen.getAllByText("TYPESCRIPT");
    expect(typescript.length).toBeGreaterThan(0);
    const graphql = screen.getAllByText("GRAPHQL");
    expect(graphql.length).toBeGreaterThan(0);
  });

  test("renders CTA button", () => {
    render(<LandingSection />);
    expect(screen.getByRole("button", { name: /View selected work/i })).toBeInTheDocument();
  });
});
