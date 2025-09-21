import React, { ReactElement } from "react";
import { render, RenderOptions } from "@testing-library/react";
import { AlertProvider } from "./context/alertContext";

// Mock Firebase to prevent initialization errors in tests
jest.mock("firebase/app", () => ({
  initializeApp: jest.fn(),
}));

jest.mock("firebase/analytics", () => ({
  getAnalytics: jest.fn(),
}));

// Mock FontAwesome components
jest.mock("@fortawesome/react-fontawesome", () => ({
  FontAwesomeIcon: ({ icon, size, ...props }: any) => (
    <span data-testid="font-awesome-icon" {...props}>
      {icon.iconName || "icon"}
    </span>
  ),
}));

jest.mock("@fortawesome/free-solid-svg-icons", () => ({
  faEnvelope: { iconName: "envelope" },
}));

jest.mock("@fortawesome/free-brands-svg-icons", () => ({
  faGithub: { iconName: "github" },
  faLinkedin: { iconName: "linkedin" },
  faStackOverflow: { iconName: "stack-overflow" },
}));

// Use real Chakra UI; component-level mocks can hide hooks and cause failures

// Custom render function that includes AlertProvider
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return <AlertProvider>{children}</AlertProvider>;
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) => render(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything
export * from "@testing-library/react";
export { customRender as render };
