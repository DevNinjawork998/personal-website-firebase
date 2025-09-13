import React from "react";
import { render, screen } from "../../test-utils";
import LandingSection from "../LandingSection";

describe("LandingSection Component", () => {
  test("renders greeting message", () => {
    render(<LandingSection />);
    expect(screen.getByText("Hello, I am Jack!")).toBeInTheDocument();
  });

  test("renders bio information", () => {
    render(<LandingSection />);
    expect(
      screen.getByText(/Aspiring Software Engineer at bp Malaysia/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Core Specilisation in React.js, Next.js, TypeScript/)
    ).toBeInTheDocument();
  });

  test("renders location information", () => {
    render(<LandingSection />);
    expect(
      screen.getByText("Location: Kuala Lumpur, Malaysian")
    ).toBeInTheDocument();
  });

  test("renders age information", () => {
    render(<LandingSection />);
    const ageText = screen.getByText(/Age:/);
    expect(ageText).toBeInTheDocument();

    // Check that age is calculated correctly (current year - 1998)
    const currentYear = new Date().getFullYear();
    const expectedAge = currentYear - 1998;
    expect(screen.getByText(`Age: ${expectedAge}`)).toBeInTheDocument();
  });

  test("renders profile image with correct alt text", () => {
    render(<LandingSection />);
    const profileImage = screen.getByAltText("Jack's profile picture");
    expect(profileImage).toBeInTheDocument();
    expect(profileImage).toHaveAttribute("src");
  });

  test("has proper heading structure", () => {
    render(<LandingSection />);
    const mainHeading = screen.getByText("Hello, I am Jack!");
    expect(mainHeading.tagName).toBe("H1");
  });
});
