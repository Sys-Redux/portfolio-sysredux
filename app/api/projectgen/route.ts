import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse, NextRequest } from 'next/server';
import { ProjectIdea, ProjectGenRequest } from '@/lib/types/projectIdea';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const CATEGORIES = [
    'Web Application',
    'Mobile App',
    'CLI Tool',
    'API/Backend',
    'Full Stack',
    'DevOps/Automation',
    'AI/ML Project',
    'Game Development',
    'Browser Extension',
];

function buildPrompt(options: ProjectGenRequest): string {
    const count = options.count || 6;
    const difficulty = options.difficulty || 'any';
    const category = options.category || '';


    return `You are an expert software engineering mentor creating portfolio-worthy project ideas.

Generate ${count} unique project ideas that are:
- Practical and implementable
- Good for building a developer portfolio
- Clear in scop and requirements
${difficulty !== 'any' ? `- Suitable for ${difficulty} level developers` : ''}
${category ? `- In the ${category} category` : ''}

For each project, provide a JSON object with these exact fields:
- id: A unique kebab-case identifier (e.g., "task-tracker-pro")
- title: Creative, memorable project name
- summary: 1-2 sentence elevator pitch
- description: 2-3 paragraphs explaining the project, its purpose, and potential users
- difficulty: Exactly one of "beginner", "intermediate", or "advanced"
- estimatedTime: Realistic completion estimate (e.g., "2-3 weeks)
- technologies: Array of 4-6 recommended technologies
- features: Array of 4-6 specific features to implement
- learningOutcomes: Array of 3-5 skills/concepts the developer will learn
- category: One of: ${CATEGORIES.join(', ')}

IMPORTANT: Respond with only a valid JSON array. No markdown, no code blocks, no additional text.
Example: [{"id": "project-1", "title": "...", ...}]`;
}

export async function POST(request: NextRequest) {
    try {
        const body: ProjectGenRequest = await request.json();

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json(
                { error: 'GEMINI_API_KEY not configured', ideas: [] },
                { status: 500 }
            );
        }

        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
        const prompt = buildPrompt(body);

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Clean the response - remove markdown code blocks if any
        let cleanedText = text.trim();
        if (cleanedText.startsWith('```json')) {
            cleanedText = cleanedText.slice(7);
        } else if (cleanedText.startsWith('```')) {
            cleanedText = cleanedText.slice(3);
        }
        if (cleanedText.endsWith('```')) {
            cleanedText = cleanedText.slice(0, -3);
        }
        cleanedText = cleanedText.trim();

        // Parse JSON
        const ideas: ProjectIdea[] = JSON.parse(cleanedText);
        // Validate structure
        if (!Array.isArray(ideas)) {
            throw new Error('Response is not an array');
        }

        return NextResponse.json({ ideas });
    } catch (error) {
        console.log('ProjectGen API error:', error);
        return NextResponse.json(
            {
                error: 'Failed to generate project ideas. Please try again.',
                ideas: []
            },
            { status: 500 }
        );
    }
}