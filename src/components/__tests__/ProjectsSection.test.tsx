import React from "react";
import { render, screen } from "../../test-utils";
import ProjectsSection from "../ProjectsSection";

describe("ProjectsSection Component", () => {
  test("renders section heading", () => {
    render(<ProjectsSection />);
    expect(screen.getByText("Featured Projects")).toBeInTheDocument();
  });

  test("renders all project cards", () => {
    render(<ProjectsSection />);

    // Check all project titles are present
    expect(screen.getByText("Simple Calculator")).toBeInTheDocument();
    expect(screen.getByText("Pokemon DataBase")).toBeInTheDocument();
    expect(screen.getByText("BuberBreakfast")).toBeInTheDocument();
    expect(screen.getByText("Cocktail Ecommerce App")).toBeInTheDocument();
  });

  test("renders project descriptions", () => {
    render(<ProjectsSection />);

    // Check some key descriptions
    expect(
      screen.getByText(/This was first ever Front-End Development project/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Using React.js Framework to create a Pokemon Database/)
    ).toBeInTheDocument();
    expect(screen.getByText(/This was a projet base on C#/)).toBeInTheDocument();
    expect(
      screen.getByText(/A Cocktail Ecommerce App, using Next.js Framework/)
    ).toBeInTheDocument();
  });

  test("renders project images", () => {
    render(<ProjectsSection />);

    // Check that images are rendered (they should have src attributes)
    const images = screen.getAllByRole("img");
    expect(images.length).toBeGreaterThan(0);

    // Check that each image has a src attribute
    images.forEach((img) => {
      expect(img).toHaveAttribute("src");
    });
  });

  test("has proper heading structure", () => {
    render(<ProjectsSection />);
    const heading = screen.getByText("Featured Projects");
    expect(heading.tagName).toBe("H1");
  });

  test("renders project links", () => {
    render(<ProjectsSection />);

    // Check that project links are present by looking for elements with href attributes
    const links = screen.getAllByRole("link");
    expect(links.length).toBe(4); // Should have 4 project links

    // Check specific URLs by looking for href attributes
    expect(screen.getByRole("link", { name: /Simple Calculator/ })).toHaveAttribute(
      "href",
      "https://github.com/DevNinjawork998/Simple-Calculator"
    );

    expect(screen.getByRole("link", { name: /Pokemon DataBase/ })).toHaveAttribute(
      "href",
      "https://github.com/DevNinjawork998/Pokemon-Database"
    );
  });
});
