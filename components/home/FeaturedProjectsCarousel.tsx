'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, ExternalLink, GitPullRequestDraft } from 'lucide-react';
import { Project } from '@/lib/types';

interface FeaturedProjectsCarouselProps {
    projects: Project[];
}

export default function FeaturedProjectsCarousel({ projects }: FeaturedProjectsCarouselProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);
    const router = useRouter();

    const checkScroll = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
        }
    };

    useEffect(() => {
        checkScroll();
        window.addEventListener('resize', checkScroll);
        return () => window.removeEventListener('resize', checkScroll);
    }, []);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const scrollAmount = scrollRef.current.clientWidth * 0.8;
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    if (projects.length === 0) return null;

    return (
        <div className='relative'>
            {/* Carousel Container */}
            <div className='relative group'>
                    {/* Navigation Arrows - Desktop Only */}
                    {canScrollLeft && (
                        <button
                            onClick={() => scroll('left')}
                            className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 items-center justify-center rounded-full bg-black/80 border-2 opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                            style={{ borderColor: 'var(--color-primary-cyan)' }}
                            aria-label='Scroll Left'
                        >
                            <ChevronLeft size={24} color='var(--color-primary-cyan)' />
                        </button>
                    )}

                    {canScrollRight && (
                        <button
                            onClick={() => scroll('right')}
                            className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 items-center justify-center rounded-full bg-black/80 border-2 opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                            style={{ borderColor: 'var(--color-primary-cyan)' }}
                            aria-label='Scroll Right'
                        >
                            <ChevronRight size={24} color='var(--color-primary-cyan)' />
                        </button>
                    )}

                    {/* Scrollable Container */}
                    <div
                        ref={scrollRef}
                        onScroll={checkScroll}
                        className="flex gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {projects.map((project) => (
                            <div
                                key={project.id}
                                className="flex-none w-[64vw] sm:w-[52vw] md:w-[34vw] lg:w-[22vw] xl:w-[17vw] snap-start"
                            >
                                <div
                                    onClick={() => router.push(`/projects/${project.id}`)}
                                    className="block group/card cursor-pointer"
                                >
                                    <div className="rounded-lg overflow-hidden border transition-all duration-300 hover:scale-[1.02] hover:shadow-lg h-full"
                                        style={{ background: 'var(--color-card-bg)', borderColor: 'var(--color-border)'}}
                                    >
                                        {/* Project Image */}
                                        <div className='relative w-full aspect-video overflow-hidden'>
                                            <Image
                                                src={project.imageUrl}
                                                alt={project.title}
                                                fill
                                                className="object-cover transition-transform duration-500 group-hover/card:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover/card:opacity-80 transition-opacity" />

                                            {/* Featured Badge */}
                                            <div className="absolute top-3 left-3 px-3 py-1 rounded text-xs font-bold uppercase tracking-wider"
                                                style={{
                                                    backgroundColor: 'var(--color-primary-pink)',
                                                    color: 'var(--color-text-primary)',
                                                    boxShadow: '0 0 10px var(--color-primary-pink)'
                                                }}
                                            >
                                                Featured
                                            </div>

                                            {/* Quick Actions */}
                                            <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover/card:opacity-100 transition-opacity">
                                                {project.githubUrl && (
                                                    <a
                                                        href={project.githubUrl}
                                                        target='_blank'
                                                        rel='noopener noreferrer'
                                                        onClick={(e) => e.stopPropagation()}
                                                        className='p-2 rounded-full bg-black/70 hover:bg-black/90 transition-colors'
                                                        aria-label='View on GitHub'
                                                    >
                                                        <GitPullRequestDraft size={16} color='var(--color-primary-cyan)' />
                                                    </a>
                                                )}
                                                {project.liveUrl && (
                                                    <a
                                                        href={project.liveUrl}
                                                        target='_blank'
                                                        rel='noopener noreferrer'
                                                        onClick={(e) => e.stopPropagation()}
                                                        className='p-2 rounded-full bg-black/70 hover:bg-black/90 transition-colors'
                                                        aria-label='View Live Demo'
                                                    >
                                                        <ExternalLink size={16} color='var(--color-primary-green)' />
                                                    </a>
                                                )}
                                            </div>
                                        </div>

                                        {/* Project Info */}
                                        <div className='p-4 md:p-5'>
                                            <h3 className="font-['Orbitron'] text-lg md:text-xl font-bold mb-2 line-clamp-1"
                                                style={{ color: 'var(--color-primary-cyan)' }}
                                            >
                                                {project.title}
                                            </h3>
                                            <p className='text-sm md:text-base mb-4 line-clamp-2 leading-relaxed'
                                                style={{ color: 'var(--color-text-secondary)' }}
                                            >
                                                {project.description}
                                            </p>
                                            <div className='flex flex-wrap gap-2'>
                                                {project.technologies.slice(0, 3).map((tech, index) => (
                                                    <span
                                                        key={index}
                                                        className='px-2 py-1 text-xs rounded border'
                                                        style={{
                                                            borderColor: 'var(--color-border)',
                                                            color: 'var(--color-primary-green)',
                                                        }}
                                                    >
                                                        {tech}
                                                    </span>
                                                ))}
                                                {project.technologies.length > 3 && (
                                                    <span
                                                        className='px-2 py-1 text-xs rounded'
                                                        style={{ color: 'var(--color-text-secondary)' }}
                                                    >
                                                        +{project.technologies.length - 3}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                {/* Scroll Indicator - Mobile Only */}
                <div className='flex md:hidden justify-center gap-2 mt-6'>
                    {projects.map((_, index) => (
                        <div
                            key={index}
                            className='w-2 h-2 rounded-full transition-all'
                            style={{
                                backgroundColor: index === 0
                                    ? 'var(--color-primary-cyan)'
                                    : 'var(--color-border)'
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* View All Button - Mobile Only */}
            <div className='flex justify-center mt-8 md:hidden'>
                <Link href='/projects' className='cyber-btn secondary'>
                    View All Projects
                </Link>
            </div>
        </div>
    );
}