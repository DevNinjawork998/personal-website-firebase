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

// Helper function to filter out Chakra UI specific props
const filterChakraProps = (props: any) => {
  const {
    colorScheme,
    isInvalid,
    maxW,
    lineHeight,
    textAlign,
    justifyItems,
    spacing,
    px,
    py,
    mb,
    h,
    w,
    minHeight,
    minWidth,
    maxWidth,
    backgroundColor,
    backgroundImage,
    color,
    fontSize,
    fontWeight,
    borderRadius,
    border,
    boxShadow,
    overflow,
    objectFit,
    objectPosition,
    cursor,
    transition,
    _hover,
    as,
    justifyContent,
    alignItems,
    translateY,
    transitionProperty,
    transitionDuration,
    transitionTimingFunction,
    paddingLeft,
    paddingRight,
    firstName,
    querType,
    email,
    ...rest
  } = props;
  return rest;
};

// Mock Chakra UI components to avoid dependency issues
jest.mock("@chakra-ui/react", () => ({
  ChakraProvider: ({ children }: { children: React.ReactNode }) => children,
  Heading: ({ children, ...props }: any) => (
    <h1 {...filterChakraProps(props)}>{children}</h1>
  ),
  Text: ({ children, ...props }: any) => (
    <p {...filterChakraProps(props)}>{children}</p>
  ),
  VStack: ({ children, ...props }: any) => (
    <div {...filterChakraProps(props)}>{children}</div>
  ),
  HStack: ({ children, ...props }: any) => (
    <div {...filterChakraProps(props)}>{children}</div>
  ),
  Flex: ({ children, ...props }: any) => (
    <div {...filterChakraProps(props)}>{children}</div>
  ),
  Image: ({ src, alt, ...props }: any) => (
    <img src={src} alt={alt} {...filterChakraProps(props)} />
  ),
  Box: ({ children, as, ...props }: any) => {
    const Component = as || "div";
    return <Component {...filterChakraProps(props)}>{children}</Component>;
  },
  SimpleGrid: ({ children, ...props }: any) => (
    <div {...filterChakraProps(props)}>{children}</div>
  ),
  Button: ({ children, ...props }: any) => (
    <button {...filterChakraProps(props)}>{children}</button>
  ),
  FormControl: ({ children, ...props }: any) => (
    <div {...filterChakraProps(props)}>{children}</div>
  ),
  FormLabel: ({ children, ...props }: any) => (
    <label {...filterChakraProps(props)}>{children}</label>
  ),
  FormErrorMessage: ({ children, ...props }: any) => (
    <div {...filterChakraProps(props)}>{children}</div>
  ),
  Input: (props: any) => <input {...filterChakraProps(props)} />,
  Select: ({ children, ...props }: any) => (
    <select {...filterChakraProps(props)}>{children}</select>
  ),
  Textarea: (props: any) => <textarea {...filterChakraProps(props)} />,
  // Alert Dialog components
  AlertDialog: ({ children, isOpen, ...props }: any) =>
    isOpen ? (
      <div data-testid="alert-dialog" {...filterChakraProps(props)}>
        {children}
      </div>
    ) : null,
  AlertDialogBody: ({ children, ...props }: any) => (
    <div {...filterChakraProps(props)}>{children}</div>
  ),
  AlertDialogContent: ({ children, ...props }: any) => (
    <div {...filterChakraProps(props)}>{children}</div>
  ),
  AlertDialogHeader: ({ children, ...props }: any) => (
    <div {...filterChakraProps(props)}>{children}</div>
  ),
  AlertDialogOverlay: ({ children, ...props }: any) => (
    <div {...filterChakraProps(props)}>{children}</div>
  ),
}));

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
