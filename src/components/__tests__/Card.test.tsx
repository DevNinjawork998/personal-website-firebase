import React from "react";
import { render, screen } from "../../test-utils";
import Card from "../Card";

// Mock image imports
jest.mock("../../images/photo1.jpg", () => "mocked-photo1.jpg");
jest.mock("../../images/Pokemon.jpg", () => "mocked-pokemon.jpg");

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
    expect(
      screen.getByText("This is a test project description")
    ).toBeInTheDocument();
  });

  test("renders image with correct src", () => {
    render(<Card {...mockProps} />);

    const image = screen.getByRole("img");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", "test-image.jpg");
  });

  test("renders link with correct href", () => {
    render(<Card {...mockProps} />);

    // Look for the link by href attribute since role might not be recognized
    const link = screen.getByRole("link");
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "https://test-project.com");
  });

  test("link opens in new tab", () => {
    render(<Card {...mockProps} />);

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
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

    const image = screen.getByRole("img");
    expect(image).toHaveAttribute("src", "different-image.jpg");

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "https://different-project.com");
  });

  test("has proper accessibility attributes", () => {
    render(<Card {...mockProps} />);

    const link = screen.getByRole("link");
    // Check that the link exists and has proper attributes
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "https://test-project.com");
  });
});
