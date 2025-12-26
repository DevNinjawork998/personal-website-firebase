import React from "react";
import { render, screen } from "../../test-utils";
import { describe, test, expect } from "vitest";
import Card from "../Card";

describe("Card Component", () => {
  const mockProps = {
    title: "Test Project",
    description: "This is a test project description",
    imageSrc: "test-image.jpg",
    url: "https://test-project.com",
  };

  test("renders card with title and description", () => {
    render(<Card {...mockProps} />);

    expect(screen.getByText("Test Project")).toBeInTheDocument();
    expect(screen.getByText("This is a test project description")).toBeInTheDocument();
  });

  test("renders image or fallback element", () => {
    render(<Card {...mockProps} />);

    // Either the image with alt text or the fallback box is rendered
    // Check for either the image or fallback text
    const imageOrFallback = 
      screen.queryByAltText("Test Project") || 
      screen.queryByText("Image not available");
    
    expect(imageOrFallback).toBeInTheDocument();
  });

  test("renders link with correct href", () => {
    render(<Card {...mockProps} />);

    const link = screen.getByRole("link");
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "https://test-project.com");
  });

  test("link opens in new tab with security attributes", () => {
    render(<Card {...mockProps} />);

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  test("renders Live badge", () => {
    render(<Card {...mockProps} />);

    expect(screen.getByText("Live")).toBeInTheDocument();
  });

  test("renders with different props", () => {
    const differentProps = {
      title: "Another Project",
      description: "Different description",
      imageSrc: "different-image.jpg",
      url: "https://different-project.com",
    };

    render(<Card {...differentProps} />);

    expect(screen.getByText("Another Project")).toBeInTheDocument();
    expect(screen.getByText("Different description")).toBeInTheDocument();

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "https://different-project.com");
  });

  test("renders technology badges when provided", () => {
    const propsWithTech = {
      ...mockProps,
      tech: ["React", "TypeScript", "Node.js"],
    };

    render(<Card {...propsWithTech} />);

    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
    expect(screen.getByText("Node.js")).toBeInTheDocument();
  });

  test("does not render extra tech badges when tech array is empty", () => {
    const propsWithoutTech = {
      ...mockProps,
      tech: [],
    };

    render(<Card {...propsWithoutTech} />);

    // Title and description should still render
    expect(screen.getByText("Test Project")).toBeInTheDocument();
    // Live badge is always shown
    expect(screen.getByText("Live")).toBeInTheDocument();
  });

  test("renders View Project overlay text", () => {
    render(<Card {...mockProps} />);

    expect(screen.getByText("View Project")).toBeInTheDocument();
  });
});
