'use client';
import { useState } from 'react';
import { useProjectGen } from '@/lib/hooks/useProjectGen';
import ProjectIdeaCard from '@/components/projectgen/ProjectIdeaCard';
import ProjectIdeaModal from '@/components/projectgen/ProjectIdeaModal';
import { Sparkles, RefreshCw } from 'lucide-react';

const DIFFICULTY_OPTIONS = [
    { value: 'any', label: 'Any Difficulty' },
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
];

const CATEGORY_OPTIONS = [
    { value: '', label: 'All Categories' },
    { value: 'web development', label: 'Web Development' },
    { value: 'Mobile App', label: 'Mobile App' },
    { value: 'CLI Tool', label: 'CLI Tool' },
    { value: 'API/Backend', label: 'API/Backend' },
    { value: 'Full Stack', label: 'Full Stack' },
    { value: 'DevOps/Automation', label: 'DevOps/Automation' },
    { value: 'AI/ML Project', label: 'AI/ML Project' },
    { value: 'Game Development', label: 'Game Development' },
    { value: 'Browser Extension', label: 'Browser Extension' },
];

export default function ProjectGenPage() {
    const {
        ideas,
        isLoading,
        error,
        selectedIdea,
        generateIdeas,
        selectIdea,
    } = useProjectGen();
    const [difficulty, setDifficulty] = useState('any');
    const [category, setCategory] = useState('');

    const handleGenerate = () => {
        generateIdeas({
            difficulty: difficulty as 'beginner' | 'intermediate' | 'advanced' | 'any',
            category: category || undefined,
            count: 6,
        });
    };


    return (
        <div className='min-h-screen py-24 px-8'>
            <div className='max-w-[1200px] mx-auto'>
                {/* Header */}
                <h1
                    className='font-["Orbitron"] text-4xl md:text-5xl font-black text-center mb-4 glitch'
                    data-text='PROJECT IDEA GENERATOR'
                    style={{ color: 'var(--color-primary-cyan)' }}
                >
                    PROJECT IDEA GENERATOR
                </h1>

                <p
                    className='text-center mb-8 text-lg max-w-2xl mx-auto'
                    style={{ color: 'var(--color-text-secondary)' }}
                >
                    Get AI-powered inspiration for your next software engineering project.
                    Perfect for building your portfolio or learning new technologies.
                </p>

                {/* Controls */}
                <div className='flex flex-col md:flex-row gap-4 justify-center items-center mb-12'>
                    {/* Difficulty Select */}
                    <select
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value)}
                        className='px-4 py-3 rounded-lg font-["Rajdhani"] text-base min-w-[180px]'
                        style={{
                            backgroundColor: 'var(--color-card-bg)',
                            border: '1px solid var(--color-border)',
                            color: 'var(--color-text-primary)',
                        }}
                    >
                        {DIFFICULTY_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>

                    {/* Category Select */}
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className='px-4 py-3 rounded-lg font-["Rajdhani"] text-base min-w-[180px]'
                        style={{
                            backgroundColor: 'var(--color-card-bg)',
                            border: '1px solid var(--color-border)',
                            color: 'var(--color-text-primary)',
                        }}
                    >
                        {CATEGORY_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>

                    {/* Generate Button */}
                    <button
                        onClick={handleGenerate}
                        disabled={isLoading}
                        className='cyber-btn flex items-center gap-2'
                    >
                        {isLoading ? (
                            <>
                                <RefreshCw className='animate-spin' size={18} />
                                GNERATING...
                            </>
                        ) : (
                            <>
                                <Sparkles size={18} />
                                GENERATE IDEAS
                            </>
                        )}
                    </button>
                </div>

                {/* Error State */}
                {error && (
                    <div
                        className='text-center py-8 mb-8 rounded-lg'
                        style={{
                            backgroundColor: 'rgba(255, 0, 110, 0.1)',
                            border: '1px solid var(--color-primary-pink)',
                        }}
                    >
                        <p style={{ color: 'var(--color-primary-pink)' }}>{error}</p>
                        <button
                            onClick={handleGenerate}
                            className='mt-4 underline'
                            style={{ color: 'var(--color-primary-cyan)' }}
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {/* Loading Skeleton */}
                {isLoading && ideas.length === 0 && (
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                        {[...Array(6)].map((_, i) => (
                            <div
                                key={i}
                                className='cyber-card animate-pulse'
                                style={{ minHeight: '250px' }}
                            >
                                <div
                                    className='h-4 w-24 rounded mb-4'
                                    style={{ backgroundColor: 'var(--color-border)' }}
                                />
                                <div
                                    className='h-6 w-3/4 rounded mb-3'
                                    style={{ backgroundColor: 'var(--color-border)' }}
                                />
                                <div
                                    className='h-4 w-full rounded mb-2'
                                    style={{ backgroundColor: 'var(--color-border)' }}
                                />
                                <div
                                    className='h-4 w-2/3 rounded mb-4'
                                    style={{ backgroundColor: 'var(--color-border)' }}
                                />
                                <div className='flex gap-2'>
                                    {[...Array(3)].map((_, j) => (
                                        <div
                                            key={j}
                                            className='h-6 w-16 rounded'
                                            style={{ backgroundColor: 'var(--color-border)' }}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {!isLoading && ideas.length === 0 && !error && (
                    <div className='text-center py-20'>
                        <Sparkles
                            size={48}
                            className='mx-auto mb-4'
                            style={{ color: 'var(--color-primary-cyan)', opacity: 0.5 }}
                        />
                        <p style={{ color: 'var(--color-text-secondary)' }}>
                            Click &quot;Generate Ideas&quot; to get started!
                        </p>
                    </div>
                )}

                {/* Ideas Grid */}
                {ideas.length > 0 && (
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                        {ideas.map((idea) => (
                            <ProjectIdeaCard
                                key={idea.id}
                                idea={idea}
                                onClick={() => selectIdea(idea)}
                            />
                        ))}
                    </div>
                )}

                {/* Modal */}
                {selectedIdea && (
                    <ProjectIdeaModal
                        idea={selectedIdea}
                        onClose={() => selectIdea(null)}
                    />
                )}
            </div>
        </div>
    );
}