'use client';
import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Trash2 } from 'lucide-react';
import { useChat } from '../../lib/hooks/useChat';

export default function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const { messages, isLoading, sendMessage, clearMessages } = useChat();

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    // Focus input when chat opens
    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputValue.trim() && !isLoading) {
            sendMessage(inputValue);
            setInputValue('');
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
            setIsOpen(false);
        }
    };


    return (
        <>
            {/* Chat Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center
                    transition-all duration-300 ease-out hover:scale-110 active:scale-95
                    ${isOpen ? 'rotate-0' : 'animate-pulse'}
                `}
                style={{
                    background: 'linear-gradient(135deg, var(--color-primary-cyan), var(--color-primary-purple))',
                    boxShadow: isOpen
                        ? '0 0 20px rgba(0, 255, 255, 0.5)'
                        : '0 0 30px rgba(0, 255, 255, 0.4), 0 0 60px rgba(0, 255, 255, 0.2)',
                }}
                aria-label={isOpen ? 'Close chat' : 'Open chat'}
            >
                {isOpen ? (
                    <X size={24} color='#0a0a0a' strokeWidth={2.5} />
                ) : (
                    <MessageSquare size={24} color='#0a0a0a' strokeWidth={2.5} />
                )}
            </button>

            {/* Chat Window */}
            <div
                className={`
                    fixed bottom-24 right-6 z-40 w-[380px] max-w-[calc(100vw-3rem)] transition-all duration-300 ease-out
                    ${isOpen
                        ? 'opacity-100 translate-y-0 pointer-events-auto'
                        : 'opacity-0 translate-y-4 pointer-events-none'}
                    `}
                onKeyDown={handleKeyDown}
            >
                <div
                    className='rounded-2xl overflow-hidden flex flex-col'
                    style={{
                        background: 'var(--color-card-bg)',
                        border: '1px solid var(--color-border)',
                        boxShadow: '0 0 40px rgba(0, 255, 255, 0.15), 0 25px 50px rgba(0, 0, 0, 0.5)',
                        height: 'min(500px, calc(100vh - 160px))',
                    }}
                >
                    {/* Header */}
                    <div
                        className='px-4 py-3 flex items-center justify-between shrink-0'
                        style={{
                            background: 'var(--color-darker-bg)',
                            borderBottom: '1px solid var(--color-border)',
                        }}
                    >
                        <div className='flex items-center gap-3'>
                            <div
                                className='w-10 h-10 rounded-full flex items-center justify-center'
                                style={{
                                    background: 'linear-gradient(135deg, var(--color-primary-cyan), var(--color-primary-purple))',
                                    boxShadow: '0 0 15px rgba(0, 255, 255, 0.4)',
                                }}
                            >
                                <Bot size={20} color='#0a0a0a' strokeWidth={2.5} />
                            </div>
                            <div>
                                <h3
                                    className='font-["Orbitron"] text-sm font-bold leading-tight'
                                    style={{ color: 'var(--color-primary-cyan)' }}
                                >
                                    SyS-aI aUt0maT3d AsSiStanT
                                </h3>
                                <div className='flex items-center gap-1.5'>
                                    <span
                                        className='w-2 h-2 rounded-full animate-pulse'
                                        style={{
                                            background: 'var(--color-primary-green)',
                                            boxShadow: '0 0 8px var(--color-primary-green)',
                                        }}
                                    />
                                    <span
                                        className='text-xs font-["Rajdhani"]'
                                        style={{ color: 'var(--color-text-secondary)' }}
                                    >
                                        0Nline
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className='flex items-center gap-2'>
                            {messages.length > 0 && (
                                <button
                                    onClick={clearMessages}
                                    className='p-2 rounded-lg transition-all hover:bg-white/5'
                                    style={{ color: 'var(--color-text-secondary)' }}
                                    aria-label='Clear conversation'
                                    title='Clear conversation'
                                >
                                    <Trash2 size={16} />
                                </button>
                            )}
                            <button
                                onClick={() => setIsOpen(false)}
                                className='p-2 rounded-lg transition-all hover:bg-white/5'
                                style={{ color: 'var(--color-text-secondary)' }}
                                aria-label='Close chat'
                            >
                                <X size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Messages Area */}
                </div>
            </div>
        </>
    )
}