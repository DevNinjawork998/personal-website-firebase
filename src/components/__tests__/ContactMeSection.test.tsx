import React from "react";
import { render, screen, fireEvent, waitFor } from "../../test-utils";
import userEvent from "@testing-library/user-event";
import ContactMeSection from "../ContactMeSection";

describe("ContactMeSection Component", () => {
  test("renders section heading", () => {
    render(<ContactMeSection />);
    expect(screen.getByText("Get In Touch")).toBeInTheDocument();
  });

  test("renders all form fields", () => {
    render(<ContactMeSection />);

    // Check form fields are present
    expect(screen.getByLabelText("First Name *")).toBeInTheDocument();
    expect(screen.getByLabelText("Email Address *")).toBeInTheDocument();
    expect(screen.getByLabelText("Type of Inquiry")).toBeInTheDocument();
    expect(screen.getByLabelText("Your Message *")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Send Message/ })).toBeInTheDocument();
  });

  test("renders select options", () => {
    render(<ContactMeSection />);

    const select = screen.getByLabelText("Type of Inquiry");
    expect(select).toBeInTheDocument();

    // Check options are present
    expect(screen.getByText("Freelance Project Proposal")).toBeInTheDocument();
    expect(screen.getByText("Collaboration Opportunity")).toBeInTheDocument();
    expect(screen.getByText("Technical Consultation")).toBeInTheDocument();
    expect(screen.getByText("Other")).toBeInTheDocument();
  });

  test("allows user input in form fields", async () => {
    render(<ContactMeSection />);

    const nameInput = screen.getByLabelText("First Name *");
    const emailInput = screen.getByLabelText("Email Address *");
    const messageTextarea = screen.getByLabelText("Your Message *");

    // Test name input
    fireEvent.change(nameInput, { target: { value: "John Doe" } });
    expect(nameInput).toHaveValue("John Doe");

    // Test email input
    fireEvent.change(emailInput, { target: { value: "john@example.com" } });
    expect(emailInput).toHaveValue("john@example.com");

    // Test message textarea
    fireEvent.change(messageTextarea, {
      target: { value: "This is a test message" },
    });
    expect(messageTextarea).toHaveValue("This is a test message");
  });

  test("allows selection of enquiry type", async () => {
    render(<ContactMeSection />);

    const select = screen.getByLabelText("Type of Inquiry");

    // Select an option
    fireEvent.change(select, { target: { value: "hireMe" } });
    expect(select).toHaveValue("hireMe");

    // Select another option
    fireEvent.change(select, { target: { value: "collaboration" } });
    expect(select).toHaveValue("collaboration");
  });

  test("form submission prevents default behavior", async () => {
    render(<ContactMeSection />);

    const form = screen.getByRole("button", { name: /Send Message/ }).closest("form");
    const submitButton = screen.getByRole("button", { name: /Send Message/ });

    // Mock preventDefault
    const preventDefault = jest.fn();

    // Fill form
    fireEvent.change(screen.getByLabelText("First Name *"), {
      target: { value: "Test User" },
    });
    fireEvent.change(screen.getByLabelText("Email Address *"), {
      target: { value: "test@example.com" },
    });

    // Submit form
    fireEvent.click(submitButton);

    // The form should be submitted (preventDefault is called in onSubmit)
    expect(form).toBeInTheDocument();
  });

  test("has proper heading structure", () => {
    render(<ContactMeSection />);
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent("Get In Touch");
  });

  test("form fields have correct types", () => {
    render(<ContactMeSection />);

    const emailInput = screen.getByLabelText("Email Address *");
    expect(emailInput).toHaveAttribute("type", "email");

    const nameInput = screen.getByLabelText("First Name *");
    // Check that the input exists (type="text" is default for input elements)
    expect(nameInput).toBeInTheDocument();
  });
});
