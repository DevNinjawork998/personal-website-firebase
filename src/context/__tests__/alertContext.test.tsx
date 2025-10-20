import React from "react";
import { render, screen, fireEvent } from "../../test-utils";
import { AlertProvider, useAlertContext } from "../alertContext";

// Test component to access context
const TestComponent = () => {
  const { isOpen, type, message, onOpen, onClose } = useAlertContext();

  return (
    <div>
      <div data-testid="alert-state">
        {isOpen ? "open" : "closed"} - {type} - {message}
      </div>
      <button onClick={() => onOpen("success", "Test success message")}>Open Success Alert</button>
      <button onClick={() => onOpen("error", "Test error message")}>Open Error Alert</button>
      <button onClick={onClose}>Close Alert</button>
    </div>
  );
};

describe("AlertContext", () => {
  test("provides initial state", () => {
    render(
      <AlertProvider>
        <TestComponent />
      </AlertProvider>
    );

    const alertState = screen.getByTestId("alert-state");
    expect(alertState).toHaveTextContent("closed - success - Thank for submitting your query");
  });

  test("onOpen updates state correctly", () => {
    render(
      <AlertProvider>
        <TestComponent />
      </AlertProvider>
    );

    const openSuccessButton = screen.getByText("Open Success Alert");
    const alertState = screen.getByTestId("alert-state");

    fireEvent.click(openSuccessButton);

    expect(alertState).toHaveTextContent("open - success - Test success message");
  });

  test("onOpen with error type updates state correctly", () => {
    render(
      <AlertProvider>
        <TestComponent />
      </AlertProvider>
    );

    const openErrorButton = screen.getByText("Open Error Alert");
    const alertState = screen.getByTestId("alert-state");

    fireEvent.click(openErrorButton);

    expect(alertState).toHaveTextContent("open - error - Test error message");
  });

  test("onClose updates state correctly", () => {
    render(
      <AlertProvider>
        <TestComponent />
      </AlertProvider>
    );

    const openSuccessButton = screen.getByText("Open Success Alert");
    const closeButton = screen.getByText("Close Alert");
    const alertState = screen.getByTestId("alert-state");

    // First open the alert
    fireEvent.click(openSuccessButton);
    expect(alertState).toHaveTextContent("open - success - Test success message");

    // Then close it
    fireEvent.click(closeButton);
    expect(alertState).toHaveTextContent("closed - end - Goodbye I will speak to you very soon");
  });

  test("context functions are available", () => {
    render(
      <AlertProvider>
        <TestComponent />
      </AlertProvider>
    );

    // Check that all buttons are rendered (indicating functions are available)
    expect(screen.getByText("Open Success Alert")).toBeInTheDocument();
    expect(screen.getByText("Open Error Alert")).toBeInTheDocument();
    expect(screen.getByText("Close Alert")).toBeInTheDocument();
  });

  test("multiple state updates work correctly", () => {
    render(
      <AlertProvider>
        <TestComponent />
      </AlertProvider>
    );

    const openSuccessButton = screen.getByText("Open Success Alert");
    const openErrorButton = screen.getByText("Open Error Alert");
    const closeButton = screen.getByText("Close Alert");
    const alertState = screen.getByTestId("alert-state");

    // Open success alert
    fireEvent.click(openSuccessButton);
    expect(alertState).toHaveTextContent("open - success - Test success message");

    // Switch to error alert
    fireEvent.click(openErrorButton);
    expect(alertState).toHaveTextContent("open - error - Test error message");

    // Close alert
    fireEvent.click(closeButton);
    expect(alertState).toHaveTextContent("closed - end - Goodbye I will speak to you very soon");
  });
});
