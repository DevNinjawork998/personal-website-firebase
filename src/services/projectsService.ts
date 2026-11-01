import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../config/firebase";

export interface Project {
  id: string;
  title: string;
  description: string;
  imageSrc: string;
  url: string;
  tech: string[];
  category?: string;
  year?: number;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

// Firestore values reach an href, so anything but a web link is dropped
const safeUrl = (url: unknown) => {
  try {
    return ["http:", "https:"].includes(new URL(String(url)).protocol) ? String(url) : "";
  } catch {
    return "";
  }
};

export const fetchProjects = async (): Promise<Project[]> => {
  try {
    const projectsRef = collection(db, "projects");
    const q = query(projectsRef, orderBy("order", "asc"));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        ...data,
        id: doc.id,
        url: safeUrl(data.url),
        tech: Array.isArray(data.tech) ? data.tech : [],
        order: data.order || 0,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as Project;
    });
  } catch (error) {
    console.error("Error fetching projects from Firestore:", error);
    // Return empty array instead of throwing to prevent app crash
    return [];
  }
};
