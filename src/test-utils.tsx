import { ReactElement } from "react";
import { render, RenderOptions } from "@testing-library/react";
import { vi } from "vitest";
import { ChakraProvider } from "@chakra-ui/react";

// Mock Firebase to prevent initialization errors in tests
vi.mock("firebase/app", () => ({
  initializeApp: vi.fn(),
}));

vi.mock("firebase/analytics", () => ({
  getAnalytics: vi.fn(),
}));

// Mock FontAwesome components
vi.mock("@fortawesome/react-fontawesome", () => ({
  FontAwesomeIcon: ({ icon, size, ...props }: any) => (
    <span data-testid="font-awesome-icon" {...props}>
      {icon.iconName || "icon"}
    </span>
  ),
}));

vi.mock("@fortawesome/free-solid-svg-icons", () => ({
  faEnvelope: { iconName: "envelope" },
}));

vi.mock("@fortawesome/free-brands-svg-icons", () => ({
  faGithub: { iconName: "github" },
  faLinkedin: { iconName: "linkedin" },
  faStackOverflow: { iconName: "stack-overflow" },
}));

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, "wrapper">) =>
  render(ui, { wrapper: ChakraProvider, ...options });

// Re-export everything
export * from "@testing-library/react";
export { customRender as render };
