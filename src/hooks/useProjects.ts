import { useState, useEffect, useCallback } from 'react';
import { fetchProjects, Project } from '../services/projectsService';

interface UseProjectsReturn {
    projects: Project[];
    loading: boolean;
    error: string | null;
    refetch: () => void;
}

export const useProjects = (): UseProjectsReturn => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadProjects = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const fetchedProjects = await fetchProjects();
            setProjects(fetchedProjects);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to load projects';
            setError(errorMessage);
            console.error('Error loading projects:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadProjects();
    }, [loadProjects]);

    return {
        projects,
        loading,
        error,
        refetch: loadProjects,
    };
};
