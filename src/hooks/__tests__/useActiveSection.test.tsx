import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { useActiveSection } from "../useActiveSection";

const IDS = ["about", "work"];

type Entry = { target: Element; isIntersecting: boolean };

describe("useActiveSection", () => {
  const RealObserver = global.IntersectionObserver;
  const observed: Element[] = [];
  const disconnect = vi.fn();
  let notify: (entries: Entry[]) => void;
  let observerOptions: IntersectionObserverInit | undefined;
  let about: HTMLElement;
  let work: HTMLElement;

  beforeEach(() => {
    observed.length = 0;
    disconnect.mockClear();
    global.IntersectionObserver = class {
      constructor(callback: (entries: Entry[]) => void, options?: IntersectionObserverInit) {
        notify = callback;
        observerOptions = options;
      }
      observe = (element: Element) => observed.push(element);
      disconnect = disconnect;
    } as unknown as typeof IntersectionObserver;

    about = document.body.appendChild(document.createElement("section"));
    about.id = "about";
    work = document.body.appendChild(document.createElement("section"));
    work.id = "work";
  });

  afterEach(() => {
    global.IntersectionObserver = RealObserver;
    about.remove();
    work.remove();
  });

  const fire = (entries: Entry[]) => act(() => notify(entries));

  test("watches each section at the middle of the viewport", () => {
    renderHook(() => useActiveSection(IDS));
    expect(observed).toEqual([about, work]);
    expect(observerOptions?.rootMargin).toBe("-50% 0px -50% 0px");
  });

  test("starts with no active section", () => {
    const { result } = renderHook(() => useActiveSection(IDS));
    expect(result.current).toBeNull();
  });

  test("follows the section crossing the middle", () => {
    const { result } = renderHook(() => useActiveSection(IDS));
    fire([{ target: about, isIntersecting: true }]);
    expect(result.current).toBe("about");
  });

  test("hands over when one entering and one leaving arrive together", () => {
    const { result } = renderHook(() => useActiveSection(IDS));
    fire([{ target: about, isIntersecting: true }]);
    fire([
      { target: work, isIntersecting: true },
      { target: about, isIntersecting: false },
    ]);
    expect(result.current).toBe("work");
  });

  test("clears when scrolling back above every section", () => {
    const { result } = renderHook(() => useActiveSection(IDS));
    fire([{ target: about, isIntersecting: true }]);
    fire([{ target: about, isIntersecting: false }]);
    expect(result.current).toBeNull();
  });

  test("stops observing on unmount", () => {
    const { unmount } = renderHook(() => useActiveSection(IDS));
    unmount();
    expect(disconnect).toHaveBeenCalled();
  });
});
