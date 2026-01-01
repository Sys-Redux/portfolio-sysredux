'use client';
import { useEffect, useCallback } from 'react';
import { ProjectIdea } from '@/lib/types/projectIdea';
import { X, Clock, Zap, Code, BookOpen, CheckCircle } from 'lucide-react';

interface ProjectIdeaModalProps {
    idea: ProjectIdea;
    onClose: () => void;
}

const difficultyColors = {
    beginner: 'var(--color-primary-green)',
    intermediate: 'var(--color-primary-cyan)',
    advanced: 'var(--color-primary-pink)',
};

export default function ProjectIdeaModal({ idea, onClose }: ProjectIdeaModalProps) {
    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        },
        [onClose]
    );

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'hidden'; // Prevent background scrolling

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [handleKeyDown]);


    return (
        <div
            className='fixed inset-0 z-50 flex items-center justify-center p-4'
            onClick={onClose}
        >
            {/* Backdrop */}
            <div className='absolute inset-0 bg-black/80 backdrop-blur-sm' />

            {/* Modal Content */}
            <div
                className='relative w-full max-w-2xl max-h-[90vh] overflow-y-auto
                    rounded-lg p-6 animate-in fade-in zoom-in-95 duration-200'
                style={{
                    backgroundColor: 'var(--color-card-bg)',
                    border: '1px solid var(--color-border)',
                    boxShadow: 'var(--shadow-glow)',
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className='absolute top-4 right-4 p-2 rounded-full transition-colors
                        hover:bg-white/10'
                    style={{ color: 'var(--color-text-secondary)' }}
                    aria-label='Close Modal'
                >
                    <X size={20} />
                </button>

                {/* Header */}
                <div className='mb-6'>
                    <div className='flex items-center gap-3 mb-2'>
                        <span
                            className='px-2 py-1 rounded text-xs font-bold uppercase'
                            style={{
                                backgroundColor: 'var(--color-primary-purple)',
                                color: 'white',
                            }}
                        >
                            {idea.category}
                        </span>
                        <span
                            className='flex items-center gap-1 text-sm capitalize'
                            style={{ color: difficultyColors[idea.difficulty] }}
                        >
                            <Zap size={14} />
                            {idea.difficulty}
                        </span>
                        <span
                            className='flex items-center gap-1 text-sm'
                            style={{ color: 'var(--color-text-secondary)' }}
                        >
                            <Clock size={14} />
                            {idea.estimatedTime}
                        </span>
                    </div>

                    <h2
                        className='font-["Orbitron"] text-2xl md:text-3xl font-bold'
                        style={{ color: 'var(--color-primary-cyan)' }}
                    >
                        {idea.title}
                    </h2>
                </div>

                {/* Description */}
                <div className='mb-6'>
                    <h3
                        className='flex items-center gap-2 font-["Orbitron"] text-lg font-bold mb-3'
                        style={{ color: 'var(--color-text-primary)' }}
                    >
                        <BookOpen size={18} style={{ color: 'var(--color-primary-cyan)' }} />
                        Description
                    </h3>
                    <p
                        className='whitespace-pre-line leading-relaxed'
                        style={{ color: 'var(--color-text-secondary)' }}
                    >
                        {idea.description}
                    </p>
                </div>

                {/* Features */}
                <div className='mb-6'>
                    <h3
                        className='flex items-center gap-2 font-["Orbitron"] text-lg font-bold mb-3'
                        style={{ color: 'var(--color-text-primary)' }}
                    >
                        <CheckCircle size={18} style={{ color: 'var(--color-primary-green)' }} />
                        Key Features
                    </h3>
                    <ul className='space-y-2'>
                        {idea.features.map((feature, index) => (
                            <li
                                key={index}
                                className='flex items-start gap-2'
                                style={{ color: 'var(--color-text-secondary)' }}
                            >
                                <span style={{ color: 'var(--color-primary-green)' }}>▸</span>
                                {feature}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Tech Stack */}
                <div className='mb-6'>
                    <h3
                        className='flex items-center gap-2 font-["Orbitron"] text-lg font-bold mb-3'
                        style={{ color: 'var(--color-text-primary)' }}
                    >
                        <Code size={18} style={{ color: 'var(--color-primary-pink)' }} />
                        Tech Stack
                    </h3>
                    <div className='flex flex-wrap gap-2'>
                        {idea.technologies.map((tech, index) => (
                            <span
                                key={index}
                                className='px-3 py-1 rounded text-sm'
                                style={{
                                    border: '1px solid var(--color-primary-green)',
                                    color: 'var(--color-primary-green)',
                                }}
                            >
                                {tech}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Learning Outcomes */}
                <div>
                    <h3
                        className='flex items-center gap-2 font-["Orbitron"] text-lg font-bold mb-3'
                        style={{ color: 'var(--color-text-primary)' }}
                    >
                        <BookOpen size={18} style={{ color: 'var(--color-primary-purple)' }} />
                        What You&apos;ll Learn
                    </h3>
                    <ul className='space-y-2'>
                        {idea.learningOutcomes.map((outcome, index) => (
                            <li
                                key={index}
                                className='flex items-start gap-2'
                                style={{ color: 'var(--color-text-secondary)' }}
                            >
                                <span style={{ color: 'var(--color-primary-purple)' }}>▸</span>
                                {outcome}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}