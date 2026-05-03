import React from "react";
import { render, screen } from "../test-utils";
import { vi, describe, test, expect, beforeEach, afterEach } from "vitest";
import App from "../App";
import { useProjects } from "../hooks/useProjects";

vi.mock("../hooks/useProjects", () => ({
  useProjects: vi.fn(),
}));

const mockProjects = [
  {
    id: "1",
    title: "Simple Calculator",
    description: "A calculator built with HTML, CSS, and JavaScript",
    imageSrc: "photo1.jpg",
    url: "https://github.com/DevNinjawork998/Simple-Calculator",
    tech: ["HTML", "CSS", "JavaScript"],
    category: "FRONTEND",
    year: 2022,
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
    category: "REACT · API",
    year: 2023,
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
    category: "BACKEND",
    year: 2023,
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
    category: "FULLSTACK",
    year: 2024,
    order: 4,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

describe("Integration Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useProjects).mockReturnValue({
      projects: mockProjects,
      loading: false,
      error: null,
      refetch: vi.fn(),
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test("all main sections are rendered", () => {
    render(<App />);
    expect(screen.getByText(/Things I've built/)).toBeInTheDocument();
    expect(screen.getByText(/Have a project in mind/)).toBeInTheDocument();
    expect(screen.getByText(/I turn ideas into interfaces/)).toBeInTheDocument();
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
    const linksWithHref = links.filter((link) => link.hasAttribute("href"));
    expect(linksWithHref.length).toBeGreaterThan(0);
  });

  test("profile image loads correctly", () => {
    render(<App />);
    const profileImage = screen.getByAltText("Jack Ooi");
    expect(profileImage).toBeInTheDocument();
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

  test("marquee contains tech skill names", () => {
    render(<App />);
    const typescript = screen.getAllByText("TYPESCRIPT");
    expect(typescript.length).toBeGreaterThan(0);
  });

  test("contact section has email link", () => {
    render(<App />);
    const links = screen.getAllByRole("link");
    const mailtoLink = links.find((l) => l.getAttribute("href")?.startsWith("mailto:"));
    expect(mailtoLink).toBeDefined();
  });
});
