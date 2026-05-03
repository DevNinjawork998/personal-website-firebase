import React from "react";
import { render, screen } from "../../test-utils";
import { vi, describe, test, expect, beforeEach } from "vitest";
import ProjectsSection from "../ProjectsSection";
import { useProjects } from "../../hooks/useProjects";

vi.mock("../../hooks/useProjects", () => ({
  useProjects: vi.fn(),
}));

const mockProjects = [
  {
    id: "1",
    title: "Simple Calculator",
    description: "This was first ever Front-End Development project using HTML, CSS and JavaScript",
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
    description: "Using React.js Framework to create a Pokemon Database fetching data from PokeAPI",
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
    description: "This was a projet base on C# ASP.NET for building REST APIs",
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
    description: "A Cocktail Ecommerce App, using Next.js Framework with modern UI",
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

describe("ProjectsSection Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders loading state", () => {
    vi.mocked(useProjects).mockReturnValue({
      projects: [],
      loading: true,
      error: null,
      refetch: vi.fn(),
    });

    render(<ProjectsSection />);
    expect(screen.getByText("Loading projects...")).toBeInTheDocument();
  });

  test("renders error state with error message", () => {
    vi.mocked(useProjects).mockReturnValue({
      projects: [],
      loading: false,
      error: "Failed to load projects",
      refetch: vi.fn(),
    });

    render(<ProjectsSection />);
    expect(screen.getByText("Failed to load projects")).toBeInTheDocument();
    expect(screen.getByText("Try again")).toBeInTheDocument();
  });

  test("renders section heading when projects loaded", () => {
    vi.mocked(useProjects).mockReturnValue({
      projects: mockProjects,
      loading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<ProjectsSection />);
    expect(screen.getByText(/Things I've built/)).toBeInTheDocument();
  });

  test("renders selected work label", () => {
    vi.mocked(useProjects).mockReturnValue({
      projects: mockProjects,
      loading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<ProjectsSection />);
    expect(screen.getByText(/Selected Work/i)).toBeInTheDocument();
  });

  test("renders all project cards", () => {
    vi.mocked(useProjects).mockReturnValue({
      projects: mockProjects,
      loading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<ProjectsSection />);
    expect(screen.getByText("Simple Calculator")).toBeInTheDocument();
    expect(screen.getByText("Pokemon DataBase")).toBeInTheDocument();
    expect(screen.getByText("BuberBreakfast")).toBeInTheDocument();
    expect(screen.getByText("Cocktail Ecommerce App")).toBeInTheDocument();
  });

  test("renders project descriptions", () => {
    vi.mocked(useProjects).mockReturnValue({
      projects: mockProjects,
      loading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<ProjectsSection />);
    expect(
      screen.getByText(/This was first ever Front-End Development project/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Using React.js Framework to create a Pokemon Database/)
    ).toBeInTheDocument();
  });

  test("has proper heading structure", () => {
    vi.mocked(useProjects).mockReturnValue({
      projects: mockProjects,
      loading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<ProjectsSection />);
    const heading = screen.getByText(/Things I've built/);
    expect(heading.tagName).toBe("H2");
  });

  test("renders project count", () => {
    vi.mocked(useProjects).mockReturnValue({
      projects: mockProjects,
      loading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<ProjectsSection />);
    expect(screen.getByText(/4 projects/)).toBeInTheDocument();
  });

  test("renders project links", () => {
    vi.mocked(useProjects).mockReturnValue({
      projects: mockProjects,
      loading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<ProjectsSection />);

    const links = screen.getAllByRole("link");
    expect(links.length).toBe(4);
  });
});
