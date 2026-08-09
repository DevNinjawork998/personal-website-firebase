// Vitest setup file
// @vitest-environment jsdom
import "@testing-library/jest-dom";
import { vi } from "vitest";

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
    PROD: false,
    DEV: true,
    MODE: "test",
  },
}));
