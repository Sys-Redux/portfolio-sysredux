export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

export interface ChatRequest {
    message: string;
    history?: ChatMessage[];
}

export interface ChatResponse {
    message: string;
    error?: string;
}