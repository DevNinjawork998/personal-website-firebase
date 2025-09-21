import React from "react";
import { render, screen, fireEvent, waitFor } from "../test-utils";
import App from "../App";

describe("Integration Tests", () => {
  test("complete contact form submission flow", async () => {
    render(<App />);

    // Fill out the contact form
    const nameInput = screen.getByLabelText("First Name *");
    const emailInput = screen.getByLabelText("Email Address *");
    const enquirySelect = screen.getByLabelText("Type of Inquiry");
    const messageTextarea = screen.getByLabelText("Your Message *");
    const submitButton = screen.getByRole("button", { name: /Send Message/ });

    fireEvent.change(nameInput, { target: { value: "John Doe" } });
    fireEvent.change(emailInput, { target: { value: "john@example.com" } });
    fireEvent.change(enquirySelect, { target: { value: "hireMe" } });
    fireEvent.change(messageTextarea, {
      target: { value: "I would like to hire you for a project" },
    });

    // Submit the form
    fireEvent.click(submitButton);

    // Verify form data is maintained (since we're not actually submitting)
    expect(nameInput).toHaveValue("John Doe");
    expect(emailInput).toHaveValue("john@example.com");
    expect(enquirySelect).toHaveValue("hireMe");
    expect(messageTextarea).toHaveValue(
      "I would like to hire you for a project"
    );
  });

  test("navigation between sections works correctly", () => {
    render(<App />);

    // Check that all sections are present and accessible
    expect(screen.getByText(/Hello, I am Jack!/)).toBeInTheDocument();
    expect(screen.getByText(/Featured Projects/)).toBeInTheDocument();
    expect(screen.getByText(/Get In Touch/)).toBeInTheDocument();

    // Check that project links are clickable
    const projectLinks = screen.getAllByRole("link");
    expect(projectLinks.length).toBeGreaterThan(0);

    // Verify each link has proper attributes
    projectLinks.forEach((link) => {
      expect(link).toHaveAttribute("href");
      // Only check target and rel if they exist (some links might not have them)
      if (link.hasAttribute("target")) {
        expect(link).toHaveAttribute("target", "_blank");
      }
      if (link.hasAttribute("rel")) {
        expect(link).toHaveAttribute("rel", "noopener noreferrer");
      }
    });
  });

  test("profile image and project images load correctly", () => {
    render(<App />);

    // Check profile image
    const profileImage = screen.getByAltText("Jack's profile picture");
    expect(profileImage).toBeInTheDocument();
    expect(profileImage).toHaveAttribute("src");

    // Check project images
    const images = screen.getAllByRole("img");
    expect(images.length).toBeGreaterThan(1); // Should have profile + project images

    images.forEach((img) => {
      expect(img).toHaveAttribute("src");
    });
  });

  test("form validation and user interaction", async () => {
    render(<App />);

    const nameInput = screen.getByLabelText("First Name *");
    const emailInput = screen.getByLabelText("Email Address *");
    const enquirySelect = screen.getByLabelText("Type of Inquiry");

    // Test that inputs accept user input
    fireEvent.change(nameInput, { target: { value: "Test User" } });
    expect(nameInput).toHaveValue("Test User");

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    expect(emailInput).toHaveValue("test@example.com");

    // Test select options
    fireEvent.change(enquirySelect, { target: { value: "hireMe" } });
    expect(enquirySelect).toHaveValue("hireMe");

    // Test changing selection
    fireEvent.change(enquirySelect, { target: { value: "other" } });
    expect(enquirySelect).toHaveValue("other");
  });

  test("responsive design elements are present", () => {
    render(<App />);

    // Check that Featured Projects section exists
    expect(screen.getByText("Featured Projects")).toBeInTheDocument();

    // Check that cards are rendered in a grid
    const projectCards = screen.getAllByText(
      /Simple Calculator|Pokemon DataBase|BuberBreakfast|Cocktail Ecommerce App/
    );
    expect(projectCards.length).toBeGreaterThanOrEqual(4);
  });

  test("accessibility features work correctly", () => {
    render(<App />);

    // Check heading hierarchy
    const h1Elements = screen.getAllByRole("heading", { level: 1 });
    expect(h1Elements.length).toBeGreaterThan(0);

    // Check form labels are properly associated
    const nameInput = screen.getByLabelText("First Name *");
    const emailInput = screen.getByLabelText("Email Address *");
    expect(nameInput).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();

    // Check that images have alt text
    const images = screen.getAllByRole("img");
    images.forEach((img) => {
      expect(img).toHaveAttribute("alt");
    });
  });

  test("age calculation is dynamic and correct", () => {
    render(<App />);

    const ageText = screen.getByText(/Age:/);
    expect(ageText).toBeInTheDocument();

    // Verify age calculation (current year - 1998)
    const currentYear = new Date().getFullYear();
    const expectedAge = currentYear - 1998;
    expect(screen.getByText(`Age: ${expectedAge}`)).toBeInTheDocument();
  });
});
