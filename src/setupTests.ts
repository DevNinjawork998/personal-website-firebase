// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";

// Mock window.matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  readonly root: Element | null = null;
  readonly rootMargin: string = "";
  readonly thresholds: ReadonlyArray<number> = [];
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
  unobserve() {}
} as any;

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};

// Mock console methods to reduce noise in tests
const originalError = console.error;
const originalWarn = console.warn;

beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === "string" &&
      (args[0].includes("Warning: ReactDOM.render is no longer supported") ||
       args[0].includes("Warning: `ReactDOMTestUtils.act` is deprecated") ||
       args[0].includes("ReactDOMTestUtils.act") ||
       args[0].includes("The current testing environment is not configured to support act") ||
       args[0].includes("not wrapped in act(...)"))
    ) {
      return;
    }
    originalError.call(console, ...args);
  };

  console.warn = (...args) => {
    if (
      typeof args[0] === "string" &&
      (args[0].includes("componentWillReceiveProps") || 
       args[0].includes("componentWillMount") ||
       args[0].includes("ReactDOMTestUtils.act"))
    ) {
      return;
    }
    originalWarn.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
  console.warn = originalWarn;
});

// Mock Chakra UI icons as simple functional components
jest.mock("@chakra-ui/icons", () => {
  const React = require("react");
  const makeIcon = (testId: string) => (props: any) =>
    React.createElement("span", { ...props, "data-testid": testId });
  return {
    StarIcon: makeIcon("StarIcon"),
    ExternalLinkIcon: makeIcon("ExternalLinkIcon"),
    HamburgerIcon: makeIcon("HamburgerIcon"),
    ChevronDownIcon: makeIcon("ChevronDownIcon"),
    CheckIcon: makeIcon("CheckIcon"),
    EmailIcon: makeIcon("EmailIcon"),
  };
});

// Lightweight mock for '@chakra-ui/react' to avoid deep internal imports
jest.mock("@chakra-ui/react", () => {
  const React = require("react");

  // Filter out Chakra UI specific props that shouldn't be passed to DOM elements
  const filterChakraProps = (props: any) => {
    if (!props) return props;

    // List of Chakra UI specific props that cause React warnings
    const chakraProps = new Set([
      // Layout props
      "p",
      "px",
      "py",
      "pt",
      "pb",
      "pl",
      "pr",
      "m",
      "mx",
      "my",
      "mt",
      "mb",
      "ml",
      "mr",
      "w",
      "h",
      "minW",
      "minH",
      "maxW",
      "maxH",
      // Flexbox props
      "flex",
      "flexDir",
      "flexWrap",
      "flexGrow",
      "flexShrink",
      "flexBasis",
      "justify",
      "justifyItems",
      "justifyContent",
      "justifySelf",
      "align",
      "alignItems",
      "alignContent",
      "alignSelf",
      // Grid props
      "grid",
      "gridArea",
      "gridAutoColumns",
      "gridAutoFlow",
      "gridAutoRows",
      "gridColumn",
      "gridColumnEnd",
      "gridColumnGap",
      "gridColumnStart",
      "gridGap",
      "gridRow",
      "gridRowEnd",
      "gridRowGap",
      "gridRowStart",
      "gridTemplate",
      "gridTemplateAreas",
      "gridTemplateColumns",
      "gridTemplateRows",
      // Position props
      "pos",
      "top",
      "right",
      "bottom",
      "left",
      "zIndex",
      // Display props
      "d",
      "display",
      "overflow",
      "overflowX",
      "overflowY",
      // Visual props
      "bg",
      "bgColor",
      "background",
      "backgroundImage",
      "backgroundSize",
      "backgroundPosition",
      "backgroundRepeat",
      "backgroundAttachment",
      "backgroundColor",
      "bgGradient",
      "bgClip",
      "color",
      "opacity",
      "boxShadow",
      "textShadow",
      "borderRadius",
      "border",
      "borderWidth",
      "borderStyle",
      "borderColor",
      "borderTop",
      "borderRight",
      "borderBottom",
      "borderLeft",
      // Typography props
      "fontFamily",
      "fontSize",
      "fontWeight",
      "lineHeight",
      "letterSpacing",
      "textAlign",
      "textDecoration",
      "textTransform",
      "textOverflow",
      "whiteSpace",
      "wordBreak",
      "noOfLines",
      // Other Chakra props
      "isInvalid",
      "isDisabled",
      "isReadOnly",
      "isRequired",
      "variant",
      "size",
      "colorScheme",
      "_hover",
      "_focus",
      "_active",
      "_before",
      "_after",
      "_placeholder",
      "_selection",
      "_groupHover",
      "_groupFocus",
      "_groupActive",
      // Box props
      "boxSize",
      "minHeight",
      "minWidth",
      "maxHeight",
      "maxWidth",
      // Motion props
      "animate",
      "initial",
      "exit",
      "transition",
      "whileHover",
      "whileTap",
      "whileInView",
      "variants",
      "viewport",
      // Other problematic props
      "backdropFilter",
      "isOpen",
      "transformOrigin",
      "objectFit",
      "objectPosition",
      "paddingLeft",
      "paddingRight",
      "isLoading",
      "loadingText",
      "leastDestructiveRef",
      "fallback",
      "spacing",
      "columns",
      "placement",
      "icon",
    ]);

    // Filter out Chakra UI props but keep all standard HTML attributes
    const filteredProps: any = {};
    for (const [key, value] of Object.entries(props)) {
      if (!chakraProps.has(key)) {
        filteredProps[key] = value;
      }
    }

    return filteredProps;
  };

  const el = (tag: string) => (props: any) =>
    React.createElement(tag, filterChakraProps(props), props.children);

  // Helper function to find the next form element (input, select, textarea) after a FormLabel
  const findNextFormElement = (children: any, labelIndex: number): any => {
    const childrenArray = React.Children.toArray(children);
    for (let i = labelIndex + 1; i < childrenArray.length; i++) {
      const child = childrenArray[i];
      if (child && typeof child === "object" && "type" in child && child.type) {
        const componentName = child.type.name || child.type.displayName;
        if (
          componentName === "Input" ||
          componentName === "Select" ||
          componentName === "Textarea"
        ) {
          return child;
        }
      }
    }
    return null;
  };

  // Special Box component that handles the 'as' prop
  const Box = (props: any) => {
    const { as, ...filteredProps } = filterChakraProps(props);
    const tag = as || "div";
    return React.createElement(tag, filteredProps, props.children);
  };

  return {
    // components
    ChakraProvider: ({ children }: any) => children,
    Heading: el("h1"),
    Text: el("p"),
    VStack: el("div"),
    HStack: el("div"),
    Flex: el("div"),
    Box,
    Image: (props: any) => React.createElement("img", filterChakraProps(props)),
    SimpleGrid: el("div"),
    Button: el("button"),
    FormControl: ({ children, ...props }: any) => {
      const filteredProps = filterChakraProps(props);

      // Process children to ensure FormLabel has proper htmlFor attribute
      const processedChildren = React.Children.map(children, (child: any, index: number) => {
        if (child && typeof child === "object" && child.type && child.type.name === "FormLabel") {
          // Look for the next input/select/textarea element
          const nextInput = findNextFormElement(children, index);
          if (nextInput && nextInput.props && nextInput.props.id) {
            return React.cloneElement(child, { htmlFor: nextInput.props.id });
          }
        }
        return child;
      });

      return React.createElement("div", filteredProps, processedChildren);
    },
    FormLabel: (props: any) => {
      const { children, ...restProps } = filterChakraProps(props);
      // Try to find the associated input id from the parent FormControl
      // This is a simplified approach - in real Chakra UI, this is handled by FormControl
      const htmlFor = props.htmlFor || props.for;
      return React.createElement("label", { ...restProps, htmlFor }, children);
    },
    FormErrorMessage: el("div"),
    Input: (props: any) => {
      const { children, ...restProps } = filterChakraProps(props);
      // Ensure the input element is properly controlled
      const inputProps = {
        ...restProps,
        value: props.value || "",
        onChange: props.onChange || (() => {}),
      };
      return React.createElement("input", inputProps, children);
    },
    Select: (props: any) => {
      const { children, ...restProps } = filterChakraProps(props);
      // Create a controlled select element that properly handles value changes
      const selectProps = {
        ...restProps,
        role: "combobox",
        value: props.value || "",
        onChange: props.onChange || (() => {}),
        // Ensure the select is properly controlled
        "data-testid": props["data-testid"] || "select",
      };
      return React.createElement("select", selectProps, children);
    },
    Textarea: (props: any) => {
      const { children, ...restProps } = filterChakraProps(props);
      // Ensure the textarea element is properly controlled
      const textareaProps = {
        ...restProps,
        role: "textbox",
        value: props.value || "",
        onChange: props.onChange || (() => {}),
      };
      return React.createElement("textarea", textareaProps, children);
    },
    IconButton: el("button"),
    Icon: (props: any) => {
      const { as, ...restProps } = filterChakraProps(props);
      const tag = as || "span";
      return React.createElement(tag, restProps, props.children);
    },
    Link: el("a"),
    Divider: (props: any) => React.createElement("hr", filterChakraProps(props)),
    Alert: el("div"),
    AlertIcon: el("span"),
    AlertDialog: el("div"),
    AlertDialogOverlay: el("div"),
    AlertDialogContent: el("div"),
    AlertDialogHeader: el("div"),
    AlertDialogBody: el("div"),
    Menu: el("div"),
    MenuButton: el("button"),
    MenuList: el("div"),
    MenuItem: el("div"),
    Drawer: el("div"),
    DrawerOverlay: el("div"),
    DrawerContent: el("div"),
    DrawerCloseButton: el("button"),
    DrawerHeader: el("div"),
    DrawerBody: el("div"),
    DrawerFooter: el("div"),
    Badge: el("span"),
    Center: el("div"),
    Container: el("div"),
    Spinner: el("div"),
    Wrap: el("div"),
    WrapItem: el("div"),
    // transition components
    ScaleFade: ({ children, in: isIn, ...props }: any) => (isIn ? children : null),
    Fade: ({ children, in: isIn, ...props }: any) => (isIn ? children : null),
    Slide: ({ children, in: isIn, ...props }: any) => (isIn ? children : null),
    SlideFade: ({ children, in: isIn, ...props }: any) => (isIn ? children : null),
    Collapse: ({ children, in: isIn, ...props }: any) => (isIn ? children : null),
    // hooks
    useToast: () => jest.fn(),
    useDisclosure: () => ({ isOpen: false, onOpen: jest.fn(), onClose: jest.fn() }),
    useBreakpointValue: (values: any) =>
      (values && (values.base ?? values.sm ?? values.md ?? values.lg)) ?? undefined,
    useColorModeValue: (light: any, dark: any) => light,
  };
});

// Mock Firebase
jest.mock("firebase/app", () => ({
  initializeApp: jest.fn(),
}));

jest.mock("firebase/firestore", () => ({
  getFirestore: jest.fn(),
  collection: jest.fn(),
  getDocs: jest.fn(),
  orderBy: jest.fn(),
  query: jest.fn(),
}));

jest.mock("firebase/analytics", () => ({
  getAnalytics: jest.fn(),
}));

// Mock framer-motion to support both motion(Component) and motion.div/span/a/img usage
jest.mock("framer-motion", () => {
  const React = require("react");

  // Filter out framer-motion specific props that shouldn't be passed to DOM elements
  const filterMotionProps = (props: any) => {
    if (!props) return props;

    // List of Framer Motion specific props that cause React warnings
    const motionProps = new Set([
      "animate",
      "initial",
      "exit",
      "transition",
      "whileHover",
      "whileTap",
      "whileInView",
      "whileFocus",
      "whileDrag",
      "whileDragStart",
      "whileDragEnd",
      "drag",
      "dragConstraints",
      "dragElastic",
      "dragMomentum",
      "layout",
      "layoutId",
      "layoutDependency",
    ]);

    // Filter out Framer Motion props but keep all standard HTML attributes
    const filteredProps: any = {};
    for (const [key, value] of Object.entries(props)) {
      if (!motionProps.has(key)) {
        filteredProps[key] = value;
      }
    }

    return filteredProps;
  };

  const motion: any = (Component: any) => Component;
  ["div", "span", "a", "img", "h1", "h2", "h3", "p", "button"].forEach((tag) => {
    motion[tag] = (props: any) =>
      React.createElement(tag, filterMotionProps(props), props.children);
  });
  const dummyMotionValue = () => ({
    get: () => 0,
    set: () => {},
    onChange: () => () => {},
  });
  const useScroll = () => ({ scrollYProgress: dummyMotionValue() });
  const useTransform = () => dummyMotionValue();
  const useSpring = (v: any) => v;
  return {
    motion,
    AnimatePresence: ({ children }: any) => children,
    useScroll,
    useTransform,
    useSpring,
  };
});

// Mock FullScreenSection to avoid complex framer-motion integration issues
jest.mock("./components/FullScreenSection", () => {
  const React = require("react");
  return ({ children, isDarkBackground, backgroundColor, alignItems, justifyContent, minHeight, padding, margin, position, spacing, py, ...props }: any) => {
    // Explicitly destructure and exclude custom props that shouldn't be passed to DOM elements
    // Only keep valid HTML attributes
    const filteredProps = Object.keys(props).reduce((acc: any, key: string) => {
      // Filter out any Chakra UI or custom props
      if (!key.startsWith('_') && !['sx', 'css', 'as'].includes(key)) {
        acc[key] = props[key];
      }
      return acc;
    }, {});
    
    return React.createElement("div", filteredProps, children);
  };
});

jest.mock("./components/ProjectsSection", () => {
  const React = require("react");
  return () => {
    return React.createElement(
      "div",
      {
        style: {
          backgroundColor: "rgba(0,0,0,0.8)",
          padding: "2rem",
          position: "relative",
        },
      },
      [
        React.createElement(
          "h1",
          {
            key: "heading",
            style: {
              fontSize: "2rem",
              fontWeight: "bold",
              color: "white",
              marginBottom: "2rem",
            },
          },
          "Featured Projects"
        ),
        React.createElement(
          "div",
          {
            key: "projects-grid",
            style: {
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "1.5rem",
            },
          },
          [
            React.createElement(
              "a",
              {
                key: "project-1",
                href: "https://github.com/DevNinjawork998/Simple-Calculator",
                target: "_blank",
                rel: "noopener noreferrer",
                style: {
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  padding: "1rem",
                  backgroundColor: "rgba(255,255,255,0.1)",
                  textDecoration: "none",
                  color: "inherit",
                  display: "block",
                },
              },
              [
                React.createElement("img", {
                  key: "img-1",
                  src: "/photo1.jpg",
                  alt: "Simple Calculator",
                  style: { width: "100%", height: "200px", objectFit: "cover" },
                }),
                React.createElement(
                  "h3",
                  {
                    key: "title-1",
                    style: { color: "white", marginTop: "1rem" },
                  },
                  "Simple Calculator"
                ),
                React.createElement(
                  "p",
                  {
                    key: "desc-1",
                    style: { color: "white", marginTop: "0.5rem" },
                  },
                  "This was first ever Front-End Development project"
                ),
              ]
            ),
            React.createElement(
              "a",
              {
                key: "project-2",
                href: "https://github.com/DevNinjawork998/Pokemon-Database",
                target: "_blank",
                rel: "noopener noreferrer",
                style: {
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  padding: "1rem",
                  backgroundColor: "rgba(255,255,255,0.1)",
                  textDecoration: "none",
                  color: "inherit",
                  display: "block",
                },
              },
              [
                React.createElement("img", {
                  key: "img-2",
                  src: "/Pokemon.jpg",
                  alt: "Pokemon DataBase",
                  style: { width: "100%", height: "200px", objectFit: "cover" },
                }),
                React.createElement(
                  "h3",
                  {
                    key: "title-2",
                    style: { color: "white", marginTop: "1rem" },
                  },
                  "Pokemon DataBase"
                ),
                React.createElement(
                  "p",
                  {
                    key: "desc-2",
                    style: { color: "white", marginTop: "0.5rem" },
                  },
                  "Using React.js Framework to create a Pokemon Database"
                ),
              ]
            ),
            React.createElement(
              "a",
              {
                key: "project-3",
                href: "https://github.com/DevNinjawork998/BuberBreakfast",
                target: "_blank",
                rel: "noopener noreferrer",
                style: {
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  padding: "1rem",
                  backgroundColor: "rgba(255,255,255,0.1)",
                  textDecoration: "none",
                  color: "inherit",
                  display: "block",
                },
              },
              [
                React.createElement("img", {
                  key: "img-3",
                  src: "/BreakfastImage.jpg",
                  alt: "BuberBreakfast",
                  style: { width: "100%", height: "200px", objectFit: "cover" },
                }),
                React.createElement(
                  "h3",
                  {
                    key: "title-3",
                    style: { color: "white", marginTop: "1rem" },
                  },
                  "BuberBreakfast"
                ),
                React.createElement(
                  "p",
                  {
                    key: "desc-3",
                    style: { color: "white", marginTop: "0.5rem" },
                  },
                  "This was a projet base on C#"
                ),
              ]
            ),
            React.createElement(
              "a",
              {
                key: "project-4",
                href: "https://github.com/DevNinjawork998/Cocktail-Ecommerce-App",
                target: "_blank",
                rel: "noopener noreferrer",
                style: {
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  padding: "1rem",
                  backgroundColor: "rgba(255,255,255,0.1)",
                  textDecoration: "none",
                  color: "inherit",
                  display: "block",
                },
              },
              [
                React.createElement("img", {
                  key: "img-4",
                  src: "/Cocktail.png",
                  alt: "Cocktail Ecommerce App",
                  style: { width: "100%", height: "200px", objectFit: "cover" },
                }),
                React.createElement(
                  "h3",
                  {
                    key: "title-4",
                    style: { color: "white", marginTop: "1rem" },
                  },
                  "Cocktail Ecommerce App"
                ),
                React.createElement(
                  "p",
                  {
                    key: "desc-4",
                    style: { color: "white", marginTop: "0.5rem" },
                  },
                  "A Cocktail Ecommerce App, using Next.js Framework"
                ),
              ]
            ),
          ]
        ),
      ]
    );
  };
});

// Mock the typing animation hook to return full text immediately
jest.mock("./components/LandingSection", () => {
  const React = require("react");

  const LandingSection = () => {
    const currentYear = new Date().getFullYear();
    const currentage = currentYear - 1998;

    return React.createElement(
      "div",
      {
        style: {
          alignItems: "center",
          backgroundColor: "rgba(0,0,0,0.7)",
          justifyContent: "center",
          overflow: "hidden",
          position: "relative",
        },
      },
      [
        React.createElement("div", {
          key: "background",
          style: {
            pointerEvents: "none",
            position: "absolute",
          },
        }),
        React.createElement(
          "div",
          {
            key: "content",
            style: {
              alignItems: "center",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              minHeight: "100vh",
              position: "relative",
              zIndex: 1,
            },
          },
          [
            React.createElement("img", {
              key: "profile-image",
              alt: "Jack's profile picture",
              src: "/profile.jpg",
              style: {
                width: "200px",
                height: "200px",
                borderRadius: "50%",
                marginBottom: "20px",
              },
            }),
            React.createElement(
              "div",
              {
                key: "text-content",
                style: {
                  alignItems: "center",
                  display: "flex",
                  flexDirection: "column",
                  textAlign: "center",
                },
              },
              [
                React.createElement(
                  "h1",
                  {
                    key: "greeting",
                    style: {
                      fontSize: "2rem",
                      fontWeight: "bold",
                      marginBottom: "1rem",
                      color: "white",
                    },
                  },
                  "Hello, I am Jack!"
                ),
                React.createElement(
                  "p",
                  {
                    key: "bio1",
                    style: {
                      fontSize: "1.25rem",
                      marginBottom: "0.5rem",
                      color: "white",
                    },
                  },
                  "Aspiring Software Engineer at bp Malaysia"
                ),
                React.createElement(
                  "p",
                  {
                    key: "bio2",
                    style: {
                      fontSize: "1.125rem",
                      marginBottom: "0.5rem",
                      color: "white",
                    },
                  },
                  "Core Specialisation in React.js, Next.js, TypeScript"
                ),
                React.createElement(
                  "p",
                  {
                    key: "location",
                    style: {
                      fontSize: "1.125rem",
                      marginBottom: "1rem",
                      color: "white",
                    },
                  },
                  "Location: Kuala Lumpur, Malaysian"
                ),
                React.createElement(
                  "div",
                  {
                    key: "age",
                    style: {
                      fontSize: "1.125rem",
                      color: "white",
                    },
                  },
                  `Age: ${currentage}`
                ),
              ]
            ),
          ]
        ),
      ]
    );
  };

  return LandingSection;
});

// Mock useProjects hook
jest.mock("./hooks/useProjects", () => ({
  useProjects: () => ({
    projects: [
      {
        id: "1",
        title: "Simple Calculator",
        description: "A simple calculator application",
        imageSrc: "test1.jpg",
        url: "https://test1.com",
        tech: ["React", "TypeScript"],
        order: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "2",
        title: "Pokemon DataBase",
        description: "A Pokemon database application",
        imageSrc: "test2.jpg",
        url: "https://test2.com",
        tech: ["React", "JavaScript"],
        order: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "3",
        title: "BuberBreakfast",
        description: "A breakfast delivery application",
        imageSrc: "test3.jpg",
        url: "https://test3.com",
        tech: ["React", "Node.js"],
        order: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "4",
        title: "Cocktail Ecommerce App",
        description: "An ecommerce application for cocktails",
        imageSrc: "test4.jpg",
        url: "https://test4.com",
        tech: ["React", "MongoDB"],
        order: 4,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    loading: false,
    error: null,
    refetch: jest.fn(),
  }),
}));

// Use jest file mocks via jest.config.js; avoid overriding global require
