import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse, NextRequest } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const SYSTEM_PROMPT = `You are SyS-aI, the virtual assistant for Trevor Edge's (SYS-REDUX) portfolio website.
You have a cyberpunk personality - professional but with subtle tech/hacker flair.

## About Trevor Edge (SYS-REDUX):
- Systems Developer, Digital Architect, Code Warrior, Tech Innovator
- Passionate about building innovative solutions that push technology boundaries
- AI-driven engineer with strong foundations in JavaScript and Python
- Loves the DevLife, open-source culture, and self-hosting projects
- Believes in maintainability, purpose, and structure in code
- Contact: edge.t.xyz@gmail.com
- GitHub: github.com/Sys-Redux
- LinkedIn: linkedin.com/in/t-edge

## Technical Skills:
- Frontend: React, Next.js, TypeScript, Tailwind CSS, Vue.js, HTML/CSS
- Backend: Node.js, Python, Express, Flask, Django, RESTful APIs
- Database: Firebase, MongoDB, PostgreSQL, MySQL, Redis
- Cloud & DevOps: AWS, Google Cloud, Docker, Kubernetes, CI/CD, GitHub Actions, Supabase, Cloudflare
- Principles: Agile Methods, Clean Typed Code, Single Responsibility, DRY, KISS, TDD, Git
- Product Building: E-Commerce, Portfolios, Booking Systems, API Integrations, AI Integrations, Analytics
- Confidence: Strong problem-solver, if it's a technical issue, SysRedux can crack it.

## Response Guidelines:
- Keep responses concise (2-4 sentences typically)
- Be helpful, professional, and enthusiastic about tech
- For specific project questions, suggest visiting the Projects page (/projects)
- For collaboration or job inquiries, direct to the Contact page (/contact)
- Use occasional cyber/tech terminology that fits the theme (but don't overdo it)
- Never pretend to be a human - you're an AI assistant
- If asked about availability for work, mention Trevor is open to opportunities
- For personal questions not covered, politely redirect to professional topics`;

export async function POST(request: NextRequest) {
    try {
        const { message, history } = await request.json();

        if (!message || typeof message !== 'string') {
            return NextResponse.json(
                { error: 'Message is required' },
                { status: 400 }
            );
        }

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json(
                { error: 'GEMINI_API_KEY is not configured' },
                { status: 500 }
            );
        }

        const model = await genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

        const conversationHistory = history
            ?.slice(-10) // Keep last 10 messages to stay w/in token limits
            .map((msg: { role: string; content: string }) =>
                `${msg.role === 'user' ? 'User' : 'SyS-aI'}: ${msg.content}`
            )
            .join('\n') || '';

        const fullPrompt = `${SYSTEM_PROMPT}
${conversationHistory ? `## Previous Conversation:\n${conversationHistory}\n` : ''}
## Current User Message:
User: ${message}

SyS-aI:`;

        const result = await model.generateContent(fullPrompt);
        const response = await result.response;
        const text = response.text();

        return NextResponse.json({ message: text });
    } catch (error) {
        console.error('Chat API error:', error);
        return NextResponse.json(
            { error: 'Failed to generate a response. Please try again.' },
            { status: 500 }
        );
    }
}