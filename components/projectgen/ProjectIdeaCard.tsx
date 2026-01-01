'use client';
import { ProjectIdea } from '@/lib/types/projectIdea';
import { Clock, Zap } from 'lucide-react';

interface ProjectIdeaCardProps {
    idea: ProjectIdea;
    onClick: () => void;
}

const difficultyColors = {
    beginner: 'var(--color-primary-green)',
    intermediate: 'var(--color-primary-cyan)',
    advanced: 'var(--color-primary-pink)',
};

export default function ProjectIdeaCard({ idea, onClick }: ProjectIdeaCardProps) {
    return (
        <div
            className='cyber-card group relative cursor-pointer transition-transform
                duration-300 hover:scale-105'
            onClick={onClick}
            role='button'
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && onClick()}
        >
            {/* Category Badge */}
            <div
                className='absolute top-3 left-3 px-2 py-1 rounded text-xs font-bold uppercase'
                style={{
                    backgroundColor: 'var(--color-primary-purple)',
                    color: 'white',
                }}
            >
                {idea.category}
            </div>

            {/* Time Estimate Badge */}
            <div
                className='absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded text-xs'
                style={{
                    backgroundColor: 'var(--color-card-bg)',
                    border: '1px solid var(--color-border)',
                    color: 'var(--color-text-secondary)',
                }}
            >
                <Clock size={12} />
                {idea.estimatedTime}
            </div>

            {/* Content */}
            <div className='pt-10'>
                <h3
                    className='font-["Orbitron"] text-xl font-bold mb-2'
                    style={{ color: 'var(--color-primary-cyan)' }}
                >
                    {idea.title}
                </h3>
                <p
                    className='mb-4 line-clamp-3 text-sm'
                    style={{ color: 'var(--color-text-secondary)' }}
                >
                    {idea.summary}
                </p>

                {/* Technologies */}
                <div className='flex flex-wrap gap-2 mb-4'>
                    {idea.technologies.slice(0, 4).map((tech, index) => (
                        <span
                            key={index}
                            className='px-2 py-1 text-xs rounded'
                            style={{
                                border: '1px solid var(--color-border)',
                                color: 'var(--color-primary-green)',
                            }}
                        >
                            {tech}
                        </span>
                    ))}
                    {idea.technologies.length > 4 && (
                        <span
                            className='px-2 py-1 text-xs rounded'
                            style={{ color: 'var(--color-text-secondary)' }}
                        >
                            +{idea.technologies.length - 4}
                        </span>
                    )}
                </div>

                {/* Difficulty */}
                <div className='flex items-center gap-2'>
                    <Zap size={14} style={{ color: difficultyColors[idea.difficulty] }} />
                    <span
                        className='text-sm font-medium capitalize'
                        style={{ color: difficultyColors[idea.difficulty] }}
                    >
                        {idea.difficulty}
                    </span>
                </div>
            </div>

            {/* Hover Gradient Overlay */}
            <div
                className='absolute inset-0 opacity-0 rounded-lg group-hoveropacity-10
                    transition-opacity duration-300 pointer-events-none'
                style={{
                    background: 'linear-gradient(135deg, var(--color-primary-cyan), var(--color-primary-pink))',
                }}
            />
        </div>
    );
}