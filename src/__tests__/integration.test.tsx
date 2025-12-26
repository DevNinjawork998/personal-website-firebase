import React from "react";
import { render, screen, fireEvent, waitFor } from "../test-utils";
import { vi, describe, test, expect, beforeEach, afterEach } from "vitest";
import App from "../App";
import { emailService } from "../services/emailService";
import { useProjects } from "../hooks/useProjects";
import { act } from "react";

// Mock the useProjects hook
vi.mock("../hooks/useProjects", () => ({
  useProjects: vi.fn(),
}));

// Mock the email service
vi.mock("../services/emailService", () => ({
  emailService: {
    sendContactEmail: vi.fn().mockResolvedValue({
      success: true,
      message: "Thank you! Your message has been sent successfully.",
    }),
  },
}));

const mockProjects = [
  {
    id: "1",
    title: "Simple Calculator",
    description: "A calculator built with HTML, CSS, and JavaScript",
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
    description: "Pokemon database built with React and PokeAPI",
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

describe("Integration Tests", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
    vi.mocked(useProjects).mockReturnValue({
      projects: mockProjects,
      loading: false,
      error: null,
      refetch: vi.fn(),
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test("all main sections are rendered", () => {
    render(<App />);

    // Static content that doesn't require animation
    expect(screen.getByText("Featured Projects")).toBeInTheDocument();
    expect(screen.getByText("Get In Touch")).toBeInTheDocument();
    expect(screen.getByText("Core Specialisation in:")).toBeInTheDocument();
  });

  test("project cards are rendered with correct data", () => {
    render(<App />);

    expect(screen.getByText("Simple Calculator")).toBeInTheDocument();
    expect(screen.getByText("Pokemon DataBase")).toBeInTheDocument();
    expect(screen.getByText("BuberBreakfast")).toBeInTheDocument();
    expect(screen.getByText("Cocktail Ecommerce App")).toBeInTheDocument();
  });

  test("project links exist and have href attributes", () => {
    render(<App />);

    const links = screen.getAllByRole("link");
    expect(links.length).toBeGreaterThan(0);

    // At least some links should have href attributes
    const linksWithHref = links.filter(link => link.hasAttribute("href"));
    expect(linksWithHref.length).toBeGreaterThan(0);
  });

  test("profile image loads correctly", () => {
    render(<App />);

    const profileImage = screen.getByAltText("Jack's profile picture");
    expect(profileImage).toBeInTheDocument();
  });

  test("form elements are interactive", async () => {
    render(<App />);

    // Find form inputs by placeholder
    const nameInput = screen.getByPlaceholderText("Your first name");
    
    // Test that input accepts user input
    await act(async () => {
      fireEvent.change(nameInput, { target: { value: "Test User" } });
    });
    expect(nameInput).toHaveValue("Test User");
  });

  test("age calculation is dynamic and correct", () => {
    render(<App />);

    const currentYear = new Date().getFullYear();
    const expectedAge = currentYear - 1998;
    expect(screen.getByText(new RegExp(`Age: ${expectedAge}`))).toBeInTheDocument();
  });

  test("accessibility: heading hierarchy exists", () => {
    render(<App />);

    const h1Elements = screen.getAllByRole("heading", { level: 1 });
    expect(h1Elements.length).toBeGreaterThan(0);
  });

  test("accessibility: images have alt text", () => {
    render(<App />);

    const images = screen.getAllByRole("img");
    images.forEach((img) => {
      expect(img).toHaveAttribute("alt");
    });
  });

  test("form submit button exists", () => {
    render(<App />);

    const buttons = screen.getAllByRole("button");
    const sendButton = buttons.find(btn => btn.textContent?.includes("Send"));
    expect(sendButton).toBeDefined();
  });

  test("skills section displays technologies", () => {
    render(<App />);

    expect(screen.getByText("React.js")).toBeInTheDocument();
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
    expect(screen.getByText("Python")).toBeInTheDocument();
    expect(screen.getByText("AWS")).toBeInTheDocument();
    expect(screen.getByText("SQL")).toBeInTheDocument();
    expect(screen.getByText("GraphQL")).toBeInTheDocument();
  });
});
