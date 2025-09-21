const React = require("react");
const { render, screen } = require("@testing-library/react");
const App = require("./src/App.tsx").default;

// Simple test to debug form structure
test("debug form structure", () => {
  render(<App />);

  // Find the contact form section
  const contactSection = screen.getByText("Contact Me");
  console.log("Contact section found:", contactSection);

  // Look for form elements
  const labels = screen.getAllByRole("label");
  console.log("Labels found:", labels.length);
  labels.forEach((label, index) => {
    console.log(
      `Label ${index}:`,
      label.textContent,
      "htmlFor:",
      label.getAttribute("htmlFor")
    );
  });

  const inputs = screen.getAllByRole("textbox");
  console.log("Inputs found:", inputs.length);
  inputs.forEach((input, index) => {
    console.log(`Input ${index}:`, input.id, input.name, input.placeholder);
  });

  const selects = screen.getAllByRole("combobox");
  console.log("Selects found:", selects.length);
  selects.forEach((select, index) => {
    console.log(`Select ${index}:`, select.id, select.name);
  });
});
