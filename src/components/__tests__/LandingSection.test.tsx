import React from "react";
import { render, screen } from "../../test-utils";
import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import LandingSection from "../LandingSection";
import { act } from "react";

describe("LandingSection Component", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test("renders heading element that will display greeting", () => {
    render(<LandingSection />);
    
    // The component renders a heading where the greeting will appear
    // The typing animation is handled by useState/useEffect
    const headings = screen.getAllByRole("heading");
    expect(headings.length).toBeGreaterThan(0);
  });

  test("renders skills section immediately", () => {
    render(<LandingSection />);
    
    // Skills are rendered immediately (not animated)
    expect(screen.getByText("Core Specialisation in:")).toBeInTheDocument();
    expect(screen.getByText("React.js")).toBeInTheDocument();
    expect(screen.getByText("Next.js")).toBeInTheDocument();
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
    expect(screen.getByText("ASP.Net")).toBeInTheDocument();
    expect(screen.getByText("Azure Cloud")).toBeInTheDocument();
    expect(screen.getByText("GraphQL")).toBeInTheDocument();
  });

  test("renders location information", () => {
    render(<LandingSection />);
    
    // Location is static, not animated - use regex for emoji
    expect(screen.getByText(/Kuala Lumpur, Malaysian/)).toBeInTheDocument();
  });

  test("renders age information dynamically", () => {
    render(<LandingSection />);
    
    // Check that age is calculated correctly (current year - 1998)
    const currentYear = new Date().getFullYear();
    const expectedAge = currentYear - 1998;
    expect(screen.getByText(new RegExp(`Age: ${expectedAge}`))).toBeInTheDocument();
  });

  test("renders profile image with correct alt text", () => {
    render(<LandingSection />);
    
    const profileImage = screen.getByAltText("Jack's profile picture");
    expect(profileImage).toBeInTheDocument();
  });

  test("renders scroll indicator", () => {
    render(<LandingSection />);
    
    expect(screen.getByText("Scroll to explore")).toBeInTheDocument();
  });
});
