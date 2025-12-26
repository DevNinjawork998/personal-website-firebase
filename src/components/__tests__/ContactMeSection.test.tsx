import React from "react";
import { render, screen, fireEvent } from "../../test-utils";
import { vi, describe, test, expect, beforeEach } from "vitest";
import ContactMeSection from "../ContactMeSection";
import { emailService } from "../../services/emailService";

// Mock the email service
vi.mock("../../services/emailService", () => ({
  emailService: {
    sendContactEmail: vi.fn().mockResolvedValue({
      success: true,
      message: "Message sent successfully!",
    }),
  },
}));

describe("ContactMeSection Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders section heading", () => {
    render(<ContactMeSection />);
    expect(screen.getByText("Get In Touch")).toBeInTheDocument();
  });

  test("renders section description", () => {
    render(<ContactMeSection />);
    expect(
      screen.getByText(/Have a project in mind or want to collaborate/)
    ).toBeInTheDocument();
  });

  test("renders all form fields by placeholder", () => {
    render(<ContactMeSection />);

    // Use placeholder text to find form fields (more reliable than labels)
    expect(screen.getByPlaceholderText("Your first name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Your last name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("your.email@example.com")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("+1 (555) 123-4567")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Your company name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Tell me about your project/)).toBeInTheDocument();
  });

  test("renders select with inquiry options", () => {
    render(<ContactMeSection />);

    // Find the select element
    const select = screen.getByRole("combobox");
    expect(select).toBeInTheDocument();

    // Check options are present
    expect(screen.getByText("Select an option")).toBeInTheDocument();
    expect(screen.getByText("Freelance Project Proposal")).toBeInTheDocument();
    expect(screen.getByText("Collaboration Opportunity")).toBeInTheDocument();
    expect(screen.getByText("Technical Consultation")).toBeInTheDocument();
    expect(screen.getByText("Job Opportunity")).toBeInTheDocument();
    expect(screen.getByText("Other")).toBeInTheDocument();
  });

  test("renders submit button", () => {
    render(<ContactMeSection />);
    expect(screen.getByRole("button", { name: /Send Message/i })).toBeInTheDocument();
  });

  test("allows user input in form fields", () => {
    render(<ContactMeSection />);

    const nameInput = screen.getByPlaceholderText("Your first name");
    const emailInput = screen.getByPlaceholderText("your.email@example.com");
    const messageTextarea = screen.getByPlaceholderText(/Tell me about your project/);

    fireEvent.change(nameInput, { target: { value: "John Doe" } });
    expect(nameInput).toHaveValue("John Doe");

    fireEvent.change(emailInput, { target: { value: "john@example.com" } });
    expect(emailInput).toHaveValue("john@example.com");

    fireEvent.change(messageTextarea, {
      target: { value: "This is a test message" },
    });
    expect(messageTextarea).toHaveValue("This is a test message");
  });

  test("allows selection of inquiry type", () => {
    render(<ContactMeSection />);

    const select = screen.getByRole("combobox");

    fireEvent.change(select, { target: { value: "hireMe" } });
    expect(select).toHaveValue("hireMe");

    fireEvent.change(select, { target: { value: "collaboration" } });
    expect(select).toHaveValue("collaboration");
  });

  test("email input has correct type attribute", () => {
    render(<ContactMeSection />);

    const emailInput = screen.getByPlaceholderText("your.email@example.com");
    expect(emailInput).toHaveAttribute("type", "email");
  });

  test("has proper heading structure", () => {
    render(<ContactMeSection />);
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent("Get In Touch");
  });
});
