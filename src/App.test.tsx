import React from "react";
import { render, screen } from "./test-utils";
import { vi, describe, test, expect, beforeEach, afterEach } from "vitest";
import App from "./App";
import { useProjects } from "./hooks/useProjects";

vi.mock("./hooks/useProjects", () => ({
  useProjects: vi.fn(),
}));

const mockProjects = [
  {
    id: "1",
    title: "Simple Calculator",
    description: "A calculator app built with HTML, CSS, and JavaScript",
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
    description: "Pokemon database using React and PokeAPI",
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

describe("App Component", () => {
  beforeEach(() => {
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

  test("renders hero headline", () => {
    render(<App />);
    expect(screen.getByText(/Crafting digital/)).toBeInTheDocument();
    expect(screen.getAllByText(/Jack Ooi/).length).toBeGreaterThan(0);
  });

  test("renders selected work section", () => {
    render(<App />);
    expect(screen.getByText(/Things I've built/)).toBeInTheDocument();
  });

  test("renders all project cards", () => {
    render(<App />);
    expect(screen.getByText("Simple Calculator")).toBeInTheDocument();
    expect(screen.getByText("Pokemon DataBase")).toBeInTheDocument();
    expect(screen.getByText("BuberBreakfast")).toBeInTheDocument();
    expect(screen.getByText("Cocktail Ecommerce App")).toBeInTheDocument();
  });

  test("renders contact section", () => {
    render(<App />);
    expect(screen.getByText(/Have a project in mind/)).toBeInTheDocument();
    expect(screen.getByText(/Let's make it real/)).toBeInTheDocument();
  });

  test("renders email CTA link in contact section", () => {
    render(<App />);
    const emailLinks = screen.getAllByRole("link");
    const mailtoLink = emailLinks.find((l) => l.getAttribute("href")?.startsWith("mailto:"));
    expect(mailtoLink).toBeDefined();
  });

  test("renders profile image", () => {
    render(<App />);
    const profileImage = screen.getByAltText("Jack Ooi");
    expect(profileImage).toBeInTheDocument();
  });

  test("renders about section", () => {
    render(<App />);
    expect(screen.getByText(/I turn ideas into interfaces/)).toBeInTheDocument();
  });

  test("renders multiple headings for sections", () => {
    render(<App />);
    const headings = screen.getAllByRole("heading");
    expect(headings.length).toBeGreaterThan(0);
  });
});
