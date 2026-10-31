import React from "react";
import { act, render, screen, waitFor } from "../../test-utils";
import { afterEach, beforeEach, describe, test, expect } from "vitest";
import LandingSection from "../LandingSection";

describe("LandingSection Component", () => {
  test("renders heading element that will display greeting", () => {
    render(<LandingSection />);
    const headings = screen.getAllByRole("heading");
    expect(headings.length).toBeGreaterThan(0);
  });

  test("renders hero headline text", () => {
    render(<LandingSection />);
    expect(screen.getByText(/Crafting digital/)).toBeInTheDocument();
    expect(screen.getByText(/precision/)).toBeInTheDocument();
    expect(screen.getByText(/and care/)).toBeInTheDocument();
  });

  test("keeps each headline line in one text node", () => {
    render(<LandingSection />);
    for (const line of ["Crafting digital", "products with", "precision", "and care."]) {
      expect(screen.getByText(line)).toBeInTheDocument();
    }
  });

  test("renders bio with name and company", () => {
    render(<LandingSection />);
    expect(screen.getByText(/Jack Ooi/)).toBeInTheDocument();
    expect(screen.getByText(/bp Malaysia/)).toBeInTheDocument();
  });

  test("bio keeps a space before owner", () => {
    const { container } = render(<LandingSection />);
    expect(container.textContent).toContain("and owner of JNS Nexion Enterprise");
  });

  test("renders eyebrow label with location", () => {
    render(<LandingSection />);
    expect(screen.getByText(/Software Engineer/)).toBeInTheDocument();
    expect(screen.getByText(/Kuala Lumpur/)).toBeInTheDocument();
  });

  test("renders profile image with correct alt text", () => {
    render(<LandingSection />);
    const profileImage = screen.getByAltText("Jack Ooi");
    expect(profileImage).toBeInTheDocument();
  });

  test("renders est. and location metadata", () => {
    render(<LandingSection />);
    expect(screen.getByText(/Est. 1998/i)).toBeInTheDocument();
    expect(screen.getByText(/KL, MY/)).toBeInTheDocument();
  });

  test("renders skills marquee items", () => {
    render(<LandingSection />);
    const typescript = screen.getAllByText("TYPESCRIPT");
    expect(typescript.length).toBeGreaterThan(0);
    const graphql = screen.getAllByText("GRAPHQL");
    expect(graphql.length).toBeGreaterThan(0);
  });

  test("renders CTA button", () => {
    render(<LandingSection />);
    expect(screen.getByRole("button", { name: /View selected work/i })).toBeInTheDocument();
  });
});

describe("portrait unveil", () => {
  const RealObserver = global.IntersectionObserver;
  let notify: (entries: { target: Element; isIntersecting: boolean }[]) => void;

  beforeEach(() => {
    global.IntersectionObserver = class {
      constructor(callback: typeof notify) {
        notify = callback;
      }
      observe() {}
      unobserve() {}
      disconnect() {}
    } as unknown as typeof IntersectionObserver;
  });

  afterEach(() => {
    global.IntersectionObserver = RealObserver;
  });

  // Phones stack the portrait below the fold, so the hero timeline would play it unseen
  test("waits until the portrait is on screen", async () => {
    const { container } = render(<LandingSection />);
    const photo = container.querySelector<HTMLElement>('[data-intro="photo"]')!;

    await act(() => new Promise((resolve) => setTimeout(resolve, 600)));
    expect(photo.style.clipPath).toContain("100%");

    act(() => notify([{ target: photo, isIntersecting: true }]));
    await waitFor(() => expect(photo.style.clipPath).not.toContain("100%"), { timeout: 2000 });
  });
});
