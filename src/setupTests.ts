// Vitest setup file
// @vitest-environment jsdom
import "@testing-library/jest-dom";
import { vi } from "vitest";

// Suppress CSS parsing errors from jsdom/cssstyle with Chakra UI CSS variables
const originalError = console.error;
console.error = (...args) => {
  const message = args[0]?.toString?.() || "";
  // Suppress CSS property errors that occur with Chakra UI in jsdom
  if (
    message.includes("Cannot create property") ||
    message.includes("border-width") ||
    message.includes("var(--chakra")
  ) {
    return;
  }
  originalError.apply(console, args);
};

// Patch CSSStyleDeclaration to handle Chakra UI CSS variables
// This prevents errors when jsdom tries to parse CSS variable values
const originalSetProperty = CSSStyleDeclaration.prototype.setProperty;
CSSStyleDeclaration.prototype.setProperty = function(
  property: string,
  value: string | null,
  priority?: string
) {
  try {
    // Skip CSS variables that jsdom can't parse
    if (value && typeof value === 'string' && value.includes('var(--chakra')) {
      return;
    }
    return originalSetProperty.call(this, property, value, priority || '');
  } catch (error) {
    // Silently ignore CSS parsing errors for Chakra UI variables
    return;
  }
};

// Mock window.matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock IntersectionObserver
class MockIntersectionObserver {
  readonly root: Element | null = null;
  readonly rootMargin: string = "";
  readonly thresholds: ReadonlyArray<number> = [];
  disconnect() {}
  observe() {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
  unobserve() {}
}
global.IntersectionObserver = MockIntersectionObserver as any;

// Mock ResizeObserver
class MockResizeObserver {
  disconnect() {}
  observe() {}
  unobserve() {}
}
global.ResizeObserver = MockResizeObserver as any;

// Mock Firebase
vi.mock("firebase/app", () => ({
  initializeApp: vi.fn(() => ({})),
}));

vi.mock("firebase/firestore", () => ({
  getFirestore: vi.fn(() => ({})),
  collection: vi.fn(),
  getDocs: vi.fn(() => Promise.resolve({ docs: [] })),
  query: vi.fn(),
  orderBy: vi.fn(),
  limit: vi.fn(),
}));

vi.mock("firebase/analytics", () => ({
  getAnalytics: vi.fn(() => null),
}));

// Mock EmailJS
vi.mock("@emailjs/browser", () => ({
  default: {
    init: vi.fn(),
    send: vi.fn(() => Promise.resolve({ status: 200 })),
  },
}));

// Mock framer-motion - simplified mock that renders children properly
vi.mock("framer-motion", async () => {
  const React = await import("react");
  
  // Create simple wrapper components that render children
  const createMotionComponent = (tag: string) => {
    const Component = React.forwardRef(({ children, ...props }: any, ref: any) => {
      // Filter out framer-motion specific props
      const {
        initial, animate, exit, transition, whileHover, whileTap, 
        whileInView, variants, viewport, drag, dragConstraints,
        onDragStart, onDragEnd, layout, layoutId, ...rest
      } = props;
      return React.createElement(tag, { ...rest, ref }, children);
    });
    Component.displayName = `motion.${tag}`;
    return Component;
  };

  // Create a Proxy to handle any motion.* component
  const motionProxy = new Proxy(
    // The function makes motion callable: motion(Component)
    (Component: React.ComponentType<any>) => {
      const WrappedComponent = React.forwardRef(({ children, ...props }: any, ref: any) => {
        const {
          initial, animate, exit, transition, whileHover, whileTap,
          whileInView, variants, viewport, drag, dragConstraints,
          onDragStart, onDragEnd, layout, layoutId, ...rest
        } = props;
        return React.createElement(Component, { ...rest, ref }, children);
      });
      WrappedComponent.displayName = `motion(${Component.displayName || Component.name || 'Component'})`;
      return WrappedComponent;
    },
    {
      // Proxy handler for motion.div, motion.span, etc.
      get: (target, prop: string) => {
        if (typeof prop === 'string' && prop !== 'then') {
          return createMotionComponent(prop);
        }
        return (target as any)[prop];
      },
      apply: (target, thisArg, args) => {
        // Handle motion(Component) calls
        return (target as Function).apply(thisArg, args);
      },
    }
  );

  // Mock MotionValue
  const mockMotionValue = (initial: any = 0) => ({
    get: () => initial,
    set: vi.fn(),
    onChange: vi.fn(() => () => {}),
    on: vi.fn(() => () => {}),
  });

  return {
    motion: motionProxy,
    AnimatePresence: ({ children }: any) => children,
    useAnimation: () => ({ start: vi.fn(), stop: vi.fn() }),
    useInView: () => true,
    useScroll: () => ({
      scrollX: mockMotionValue(0),
      scrollY: mockMotionValue(0),
      scrollXProgress: mockMotionValue(0),
      scrollYProgress: mockMotionValue(0),
    }),
    useTransform: (value: any, inputRange: any, outputRange: any) => mockMotionValue(outputRange?.[0] ?? 0),
    useSpring: (value: any) => mockMotionValue(typeof value === "number" ? value : 0),
    useMotionValue: mockMotionValue,
  };
});

// Mock the env module for consistent test behavior
vi.mock("./config/env", () => ({
  env: {
    FIREBASE_API_KEY: "test-api-key",
    FIREBASE_AUTH_DOMAIN: "test.firebaseapp.com",
    FIREBASE_PROJECT_ID: "test-project",
    FIREBASE_STORAGE_BUCKET: "test.appspot.com",
    FIREBASE_MESSAGING_SENDER_ID: "123456789",
    FIREBASE_APP_ID: "1:123456789:web:abc123",
    FIREBASE_MEASUREMENT_ID: "G-XXXXXXXX",
    EMAILJS_SERVICE_ID: "",
    EMAILJS_TEMPLATE_ID: "",
    EMAILJS_PUBLIC_KEY: "",
    PROD: false,
    DEV: true,
    MODE: "test",
  },
}));
