'use client';
import { useState, useCallback } from 'react';
import { ProjectIdea, ProjectGenRequest, ProjectGenResponse } from '@/lib/types/projectIdea';

export function useProjectGen() {
    const [ideas, setIdeas] = useState<ProjectIdea[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedIdea, setSelectedIdea] = useState<ProjectIdea | null>(null);

    const generateIdeas = useCallback(async (options?: ProjectGenRequest) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/projectgen', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify(options || {}),
            });

            const data: ProjectGenResponse = await response.json();

            if (!response.ok || data.error) {
                throw new Error(data.error || 'Failed to generate project ideas');
            }

            setIdeas(data.ideas);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const clearIdeas = useCallback(() => {
        setIdeas([]);
        setError(null);
        setSelectedIdea(null);
    }, []);

    const selectIdea = useCallback((idea: ProjectIdea | null) => {
        setSelectedIdea(idea);
    }, []);


    return {
        ideas,
        isLoading,
        error,
        selectedIdea,
        generateIdeas,
        clearIdeas,
        selectIdea,
    };
}