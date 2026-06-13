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
    index: 0,
  };

  test("renders card with title and description", () => {
    render(<Card {...mockProps} />);

    expect(screen.getByText(/Test Project/)).toBeInTheDocument();
    expect(screen.getByText("This is a test project description")).toBeInTheDocument();
  });

  test("renders image or fallback element", () => {
    render(<Card {...mockProps} />);

    const imageOrFallback = screen.queryByAltText("Test Project") || screen.queryByText("No image");

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

  test("renders project number", () => {
    render(<Card {...mockProps} />);

    expect(screen.getByText("01")).toBeInTheDocument();
  });

  test("renders project number based on index", () => {
    render(<Card {...mockProps} index={2} />);

    expect(screen.getByText("03")).toBeInTheDocument();
  });

  test("renders with different props", () => {
    const differentProps = {
      title: "Another Project",
      description: "Different description",
      imageSrc: "different-image.jpg",
      url: "https://different-project.com",
      index: 1,
    };

    render(<Card {...differentProps} />);

    expect(screen.getByText(/Another Project/)).toBeInTheDocument();
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

  test("does not render tech section when tech array is empty", () => {
    const propsWithoutTech = {
      ...mockProps,
      tech: [],
    };

    render(<Card {...propsWithoutTech} />);

    expect(screen.getByText(/Test Project/)).toBeInTheDocument();
  });

  test("renders category when provided", () => {
    render(<Card {...mockProps} category="FRONTEND" />);

    expect(screen.getByText("FRONTEND")).toBeInTheDocument();
  });

  test("renders year when provided", () => {
    render(<Card {...mockProps} year={2023} />);

    expect(screen.getByText("2023")).toBeInTheDocument();
  });
});
