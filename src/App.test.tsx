import { render, screen } from "@testing-library/react";
import App from "./App";

test("Render Landing Section", () => {
  render(<App />);
  const linkElement = screen.getByText(/Hello, I am Jack/);
  expect(linkElement).toBeInTheDocument();
});

test("Renders Pokemon Database", () => {
  render(<App />);
  const linkElement = screen.getByText(/Pokemon Database/);
  expect(linkElement).toBeInTheDocument();
});

test("Renders Simple Calculator", () => {
  render(<App />);
  const linkElement = screen.getByText(/Simple Calculator/);
  expect(linkElement).toBeInTheDocument();
});
