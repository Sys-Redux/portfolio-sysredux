'use client';
import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Trash2 } from 'lucide-react';
import { useChat } from '../../lib/hooks/useChat';

export default function ChatWidget() {
    const [isOpen, setIsOpen] = useState(true);
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
                    <div
                        className='flex-1 overflow-y-auto p-4 space-y-4'
                        style={{ scrollbarWidth: 'thin', scrollbarColor: 'var(--color-border) transparent' }}
                    >
                        {/* Welcome Message */}
                        {messages.length === 0 && (
                            <div className='text-center py-8'>
                                <div
                                    className='w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center'
                                    style={{
                                        background: 'linear-gradient(135deg, var(--color-primary-cyan), var(--color-primary-green))',
                                        boxShadow: '0 0 30px rgba(0, 255, 255, 0.3)',
                                    }}
                                >
                                    <Bot size={32} color='#0a0a0a' strokeWidth={2} />
                                </div>
                                <h4
                                    className='font-["Orbitron"] text-lg font-bold mb-2'
                                    style={{ color: 'var(--color-primary-cyan)' }}
                                >
                                    Welcome, Human
                                </h4>
                                <p
                                    className='text-sm font-["Rajdhani"] max-w-[280px] mx-auto'
                                    style={{ color: 'var(--color-text-secondary)' }}
                                >
                                    I&apos;m SyS-aI, I have the some sway around here, if you have any questions about all of the
                                    cool stuff here, just ask!
                                </p>
                                {/* Quick Actions */}
                                <div className='mt-6 flex flex-wrap justify-center gap-2'>
                                    {['Tell me about SysRedux', 'View projects', 'Contact info'].map((action) => (
                                        <button
                                            key={action}
                                            onClick={() => {
                                                setInputValue(action);
                                                sendMessage(action);
                                            }}
                                            className='px-3 py-1.5 text-xs font-["Rajdhani"] font-medium rounded-full
                                                transition-all hover:scale-105'
                                            style={{
                                                background: 'transparent',
                                                border: '1px solid var(--color-border)',
                                                color: 'var(--color-text-secondary)',
                                            }}
                                        >
                                            {action}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                        {/* Chat Messages */}
                        {messages.map((message, index) => (
                            <div
                                key={message.id}
                                className={`flex items-end gap-2 animate-in fade-in slide-in-from-bottom-2 duration-300 ${
                                    message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                                }`}
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                {/* Avatar */}
                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                                        message.role === 'user' ? '' : ''
                                    }`}
                                    style={{
                                        background: message.role === 'user'
                                            ? 'linear-gradient(135deg, var(--color-primary-purple), var(--color-primary-pink))'
                                            : 'linear-gradient(135deg, var(--color-primary-cyan), var(--color-primary-green))',
                                        boxShadow: message.role === 'user'
                                            ? '0 0 10px rgba(131, 56, 236, 0.4)'
                                            : '0 0 10px rgba(0, 255, 255, 0.4)',
                                    }}
                                >
                                    {message.role === 'user' ? (
                                        <User size={14} color='#fff' strokeWidth={2.5} />
                                    ) : (
                                        <Bot size={14} color='#0a0a0a' strokeWidth={2.5} />
                                    )}
                                </div>
                                {/* Message Bubble */}
                                <div
                                    className={`max-w-[75%] px-4 py-2.5 rounded-2xl ${
                                        message.role === 'user'
                                            ? 'rounded-br-md'
                                            : 'rounded-bl-md'
                                    }`}
                                    style={{
                                        background: message.role === 'user'
                                            ? 'linear-gradient(135deg, rgba(131, 56, 236, 0.3), rgba(255, 0, 110, 0.2))'
                                            : 'rgba(0, 255, 255, 0.08)',
                                        border: `1px solid ${
                                            message.role === 'user'
                                                ? 'rgba(131, 56, 236, 0.4)'
                                                : 'rgba(0, 255, 255, 0.2)'
                                        }`,
                                    }}
                                >
                                    <p
                                        className='text-sm font-["Rajdhani"] leading-relaxed whitespace-pre-wrap'
                                        style={{ color: 'var(--color-text-primary)' }}
                                    >
                                        {message.content}
                                    </p>
                                </div>
                            </div>
                        ))}
                        {/* Typing Indicator */}
                        {isLoading && (
                            <div className='flex items-end gap-2'>
                                <div
                                    className='w-8 h-8 rounded-full flex items-center justify-center'
                                    style={{
                                        background: 'linear-gradient(135deg, var(--color-primary-cyan), var(--color-primary-green))',
                                        boxShadow: '0 0 10px rgba(0, 255, 255, 0.4)',
                                    }}
                                >
                                    <Bot size={14} color='#0a0a0a' strokeWidth={2.5} />
                                </div>
                                <div
                                    className='px-4 py-3 rounded-2xl rounded-bl-md'
                                    style={{
                                        background: 'rgba(0, 255, 255, 0.08)',
                                        border: '1px solid rgba(0, 255, 255, 0.2)',
                                    }}
                                >
                                    <div className='flex gap-1.5'>
                                        {[0, 1, 2].map((i) => (
                                            <span
                                                key={i}
                                                className='w-2 h-2 rounded-full animate-bounce'
                                                style={{
                                                    background: 'var(--color-primary-cyan)',
                                                    boxShadow: '0 0 8px var(--color-primary-cyan)',
                                                    animationDelay: `${i * 150}ms`,
                                                    animationDuration: '1s',
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                    {/* Input Area */}
                    <form
                        onSubmit={handleSubmit}
                        className='p-4 shrink-0'
                        style={{
                            background: 'var(--color-darker-bg)',
                            borderTop: '1px solid var(--color-border)',
                        }}
                    >
                        <div
                            className='flex items-center gap-2 rounded-xl px-4 py-2'
                            style={{
                                background: 'var(--color-card-bg)',
                                border: '1px solid var(--color-border)',
                            }}
                        >
                            <input
                                ref={inputRef}
                                type='text'
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder='Type your message...'
                                disabled={isLoading}
                                className='flex-1 bg-transparent text-sm font-["Rajdhani"] outline-none placeholder:text-(--color-secondary)'
                                style={{ color: 'var(--color-text-primary)' }}
                            />
                            <button
                                type='submit'
                                disabled={!inputValue.trim() || isLoading}
                                className='p-2 rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:scale-110 active:scale-95'
                                style={{
                                    background: inputValue.trim()
                                        ? 'linear-gradient(135deg, var(--color-primary-cyan), var(--color-primary-green))'
                                        : 'transparent',
                                    color: inputValue.trim() ? '#0a0a0a' : 'var(--color-text-secondary)',
                                }}
                                aria-label='Send message'
                            >
                                <Send size={18} strokeWidth={2.5} />
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}