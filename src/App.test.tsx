import React from "react";
import { render, screen } from "./test-utils";
import { vi, describe, test, expect, beforeEach, afterEach } from "vitest";
import App from "./App";
import { useProjects } from "./hooks/useProjects";
import { act } from "react";

// Mock the useProjects hook
vi.mock("./hooks/useProjects", () => ({
  useProjects: vi.fn(),
}));

// Mock email service
vi.mock("./services/emailService", () => ({
  emailService: {
    sendContactEmail: vi.fn().mockResolvedValue({
      success: true,
      message: "Message sent!",
    }),
  },
}));

const mockProjects = [
  {
    id: "1",
    title: "Simple Calculator",
    description: "A calculator app built with HTML, CSS, and JavaScript",
    imageSrc: "photo1.jpg",
    url: "https://github.com/DevNinjawork998/Simple-Calculator",
    tech: ["HTML", "CSS", "JavaScript"],
    order: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    title: "Pokemon DataBase",
    description: "Pokemon database using React and PokeAPI",
    imageSrc: "Pokemon.jpg",
    url: "https://github.com/DevNinjawork998/Pokemon-Database",
    tech: ["React", "PokeAPI"],
    order: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "3",
    title: "BuberBreakfast",
    description: "REST API built with C# ASP.NET",
    imageSrc: "BreakfastImage.jpg",
    url: "https://github.com/DevNinjawork998/BuberBreakfast",
    tech: ["C#", "ASP.NET"],
    order: 3,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "4",
    title: "Cocktail Ecommerce App",
    description: "E-commerce app built with Next.js",
    imageSrc: "Cocktail.png",
    url: "https://github.com/DevNinjawork998/Cocktail-App",
    tech: ["Next.js", "React"],
    order: 4,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

describe("App Component", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.mocked(useProjects).mockReturnValue({
      projects: mockProjects,
      loading: false,
      error: null,
      refetch: vi.fn(),
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  test("renders landing section with static content", () => {
    render(<App />);

    // Test static content that doesn't require animation
    expect(screen.getByText(/Kuala Lumpur, Malaysian/)).toBeInTheDocument();
    expect(screen.getByText(/Age:/)).toBeInTheDocument();
    expect(screen.getByText("Core Specialisation in:")).toBeInTheDocument();
  });

  test("renders Featured Projects section", () => {
    render(<App />);

    expect(screen.getByText("Featured Projects")).toBeInTheDocument();
  });

  test("renders all project cards", () => {
    render(<App />);

    expect(screen.getByText("Simple Calculator")).toBeInTheDocument();
    expect(screen.getByText("Pokemon DataBase")).toBeInTheDocument();
    expect(screen.getByText("BuberBreakfast")).toBeInTheDocument();
    expect(screen.getByText("Cocktail Ecommerce App")).toBeInTheDocument();
  });

  test("renders Get In Touch section", () => {
    render(<App />);

    expect(screen.getByText("Get In Touch")).toBeInTheDocument();
  });

  test("renders contact form section", () => {
    render(<App />);

    // Check that the contact section heading is rendered
    expect(screen.getByText("Get In Touch")).toBeInTheDocument();
    
    // Check that the submit button is present (basic form validation)
    const buttons = screen.getAllByRole("button");
    const sendButton = buttons.find(btn => btn.textContent?.includes("Send"));
    expect(sendButton).toBeDefined();
  });

  test("renders profile image", () => {
    render(<App />);

    const profileImage = screen.getByAltText("Jack's profile picture");
    expect(profileImage).toBeInTheDocument();
  });

  test("renders skills badges", () => {
    render(<App />);

    expect(screen.getByText("React.js")).toBeInTheDocument();
    // Next.js appears multiple times (in skills and projects), use getAllByText
    expect(screen.getAllByText("Next.js").length).toBeGreaterThan(0);
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
  });

  test("renders multiple headings for sections", () => {
    render(<App />);
    
    // App contains multiple sections with headings
    const headings = screen.getAllByRole("heading");
    expect(headings.length).toBeGreaterThan(0);
  });
});
