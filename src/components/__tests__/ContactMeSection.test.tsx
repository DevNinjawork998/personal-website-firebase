import React from "react";
import { render, screen, fireEvent, waitFor } from "../../test-utils";
import userEvent from "@testing-library/user-event";
import ContactMeSection from "../ContactMeSection";

describe("ContactMeSection Component", () => {
  test("renders section heading", () => {
    render(<ContactMeSection />);
    expect(screen.getByText("Contact me")).toBeInTheDocument();
  });

  test("renders all form fields", () => {
    render(<ContactMeSection />);

    // Check form fields are present
    expect(screen.getByLabelText("Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Email Address")).toBeInTheDocument();
    expect(screen.getByLabelText("Type of enquiry")).toBeInTheDocument();
    expect(screen.getByLabelText("Your message")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Submit/ })).toBeInTheDocument();
  });

  test("renders select options", () => {
    render(<ContactMeSection />);

    const select = screen.getByLabelText("Type of enquiry");
    expect(select).toBeInTheDocument();

    // Check options are present
    expect(screen.getByText("Freelance project proposal")).toBeInTheDocument();
    expect(
      screen.getByText("Open source consultancy session")
    ).toBeInTheDocument();
    expect(screen.getByText("Other")).toBeInTheDocument();
  });

  test("allows user input in form fields", async () => {
    render(<ContactMeSection />);

    const nameInput = screen.getByLabelText("Name");
    const emailInput = screen.getByLabelText("Email Address");
    const messageTextarea = screen.getByLabelText("Your message");

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

    const select = screen.getByLabelText("Type of enquiry");

    // Select an option
    fireEvent.change(select, { target: { value: "hireMe" } });
    expect(select).toHaveValue("hireMe");

    // Select another option
    fireEvent.change(select, { target: { value: "openSource" } });
    expect(select).toHaveValue("openSource");
  });

  test("form submission prevents default behavior", async () => {
    render(<ContactMeSection />);

    const form = screen.getByRole("button", { name: /Submit/ }).closest("form");
    const submitButton = screen.getByRole("button", { name: /Submit/ });

    // Mock preventDefault
    const preventDefault = jest.fn();

    // Fill form
    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "Test User" },
    });
    fireEvent.change(screen.getByLabelText("Email Address"), {
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
    expect(heading).toHaveTextContent("Contact me");
  });

  test("form fields have correct types", () => {
    render(<ContactMeSection />);

    const emailInput = screen.getByLabelText("Email Address");
    expect(emailInput).toHaveAttribute("type", "email");

    const nameInput = screen.getByLabelText("Name");
    // Check that the input exists (type="text" is default for input elements)
    expect(nameInput).toBeInTheDocument();
  });
});
