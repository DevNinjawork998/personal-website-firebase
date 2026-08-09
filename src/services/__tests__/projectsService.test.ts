import { getDocs } from "firebase/firestore";
import { vi, describe, test, expect, beforeEach, afterEach } from "vitest";
import { fetchProjects } from "../projectsService";

const mockGetDocs = vi.mocked(getDocs);

const doc = (id: string, data: Record<string, unknown>) => ({ id, data: () => data });

describe("fetchProjects", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("maps Firestore docs to Project objects", async () => {
    const created = new Date("2024-01-01");
    mockGetDocs.mockResolvedValue({
      docs: [
        doc("abc", {
          title: "Pokemon DataBase",
          description: "Pokemon database",
          imageSrc: "Pokemon.jpg",
          url: "https://example.com",
          tech: ["React"],
          category: "REACT",
          year: 2023,
          order: 2,
          createdAt: { toDate: () => created },
          updatedAt: { toDate: () => created },
        }),
      ],
    } as never);

    const projects = await fetchProjects();

    expect(projects).toHaveLength(1);
    expect(projects[0]).toMatchObject({
      id: "abc",
      title: "Pokemon DataBase",
      imageSrc: "Pokemon.jpg",
      url: "https://example.com",
      tech: ["React"],
      category: "REACT",
      year: 2023,
      order: 2,
    });
    expect(projects[0].createdAt).toEqual(created);
    expect(projects[0].updatedAt).toEqual(created);
  });

  test("defaults missing tech, order and timestamps", async () => {
    mockGetDocs.mockResolvedValue({
      docs: [doc("bare", { title: "Bare", description: "", imageSrc: "", url: "" })],
    } as never);

    const [project] = await fetchProjects();

    expect(project.tech).toEqual([]);
    expect(project.order).toBe(0);
    expect(project.createdAt).toBeInstanceOf(Date);
    expect(project.updatedAt).toBeInstanceOf(Date);
  });

  test("returns an empty array when Firestore throws", async () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    mockGetDocs.mockRejectedValue(new Error("permission-denied"));

    await expect(fetchProjects()).resolves.toEqual([]);

    consoleError.mockRestore();
  });

  afterEach(() => {
    mockGetDocs.mockReset();
  });
});
