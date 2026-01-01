export interface ProjectIdea {
    id: string;
    title: string;
    summary: string;
    description: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    estimatedTime: string;
    technologies: string[];
    features: string[];
    learningOutcomes: string[];
    category: string;
}

export interface ProjectGenRequest {
    prompt?: string;
    difficulty?: 'beginner' | 'intermediate' | 'advanced' | 'any';
    category?: string;
    count?: number;
}

export interface ProjectGenResponse {
    ideas: ProjectIdea[];
    error?: string;
}