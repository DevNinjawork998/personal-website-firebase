import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../config/firebase";

export interface Project {
    id: string;
    title: string;
    description: string;
    imageSrc: string;
    url: string;
    tech: string[];
    order: number;
    createdAt: Date;
    updatedAt: Date;
}

export const fetchProjects = async (): Promise<Project[]> => {
    try {
        const projectsRef = collection(db, "projects");
        const q = query(projectsRef, orderBy("order", "asc"));
        const querySnapshot = await getDocs(q);

        const projects: Project[] = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            projects.push({
                id: doc.id,
                title: data.title,
                description: data.description,
                imageSrc: data.imageSrc,
                url: data.url,
                tech: data.tech || [],
                order: data.order || 0,
                createdAt: data.createdAt?.toDate() || new Date(),
                updatedAt: data.updatedAt?.toDate() || new Date(),
            });
        });

        return projects;
    } catch (error) {
        console.error("Error fetching projects:", error);
        throw new Error("Failed to fetch projects");
    }
};
