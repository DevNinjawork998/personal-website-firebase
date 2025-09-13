import React from "react";
import { render, screen } from "./test-utils";
import App from "./App";

describe("App Component", () => {
  test("renders all main sections", () => {
    render(<App />);

    // Check if all main sections are present
    expect(screen.getByText(/Hello, I am Jack/)).toBeInTheDocument();
    expect(screen.getByText(/Featured Projects/)).toBeInTheDocument();
    expect(screen.getByText(/Contact me/)).toBeInTheDocument();
  });

  test("renders landing section with correct content", () => {
    render(<App />);

    // Check landing section specific content
    expect(
      screen.getByText(/Aspiring Software Engineer at bp Malaysia/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Location: Kuala Lumpur, Malaysian/)
    ).toBeInTheDocument();
    expect(screen.getByText(/Age:/)).toBeInTheDocument();
  });

  test("renders all project cards", () => {
    render(<App />);

    // Check all project titles are present
    expect(screen.getByText(/Simple Calculator/)).toBeInTheDocument();
    expect(screen.getByText(/Pokemon DataBase/)).toBeInTheDocument();
    expect(screen.getByText(/BuberBreakfast/)).toBeInTheDocument();
    expect(screen.getAllByText(/Cocktail Ecommerce App/)).toHaveLength(2); // Title and alt text
  });

  test("renders contact form", () => {
    render(<App />);

    // Check contact form elements
    expect(screen.getByLabelText(/Name/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email Address/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Type of enquiry/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Your message/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Submit/ })).toBeInTheDocument();
  });

  test("renders profile image", () => {
    render(<App />);

    const profileImage = screen.getByAltText("Jack's profile picture");
    expect(profileImage).toBeInTheDocument();
    expect(profileImage).toHaveAttribute("src");
  });
});
