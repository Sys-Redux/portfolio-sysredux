'use client';
import { useState, useCallback } from 'react';
import { ChatMessage, ChatResponse } from '../types/chat';

const generateId = () => `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

export function useChat() {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const sendMessage = useCallback(async (content: string) => {
        if (!content.trim() || isLoading) return;
        setError(null);

        // Add user message immediately
        const userMessage: ChatMessage = {
            id: generateId(),
            role: 'user',
            content: content.trim(),
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: content.trim(),
                    history: [...messages, userMessage].slice(-10),
                }),
            });

            const data: ChatResponse = await response.json();

            if (!response.ok || data.error) {
                throw new Error(data.error || 'Failed to get repsonse');
            }

            // Add AI message
            const assistantMessage: ChatMessage = {
                id: generateId(),
                role: 'assistant',
                content: data.message,
                timestamp: new Date(),
            };

            setMessages(prev => [...prev, assistantMessage]);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
            setError(errorMessage);

            // Add error Message
            const errorResponse: ChatMessage = {
                id: generateId(),
                role: 'assistant',
                content: 'Apologies, I encountered a system error.',
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, errorResponse]);
        } finally {
            setIsLoading(false);
        }
    }, [messages, isLoading]);

    const clearMessages = useCallback(() => {
        setMessages([]);
        setError(null);
    }, []);

    return {
        messages,
        isLoading,
        error,
        sendMessage,
        clearMessages,
    };
}