'use client';

import { useInfiniteProjects } from '@/lib/hooks/useProjects';
import ProjectCard from '@/components/projects/ProjectCard';

export default function ProjectsPage() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteProjects(9);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-400">Error loading projects: {error.message}</p>
      </div>
    );
  }

  const allProjects = data?.pages.flatMap((page) => page.projects) || [];

  return (
    <div className="min-h-screen py-24 px-8">
      <div className="max-w-[1200px] mx-auto">
        <h1
          className="font-['Orbitron'] text-5xl font-black text-center mb-4 glitch text-primary-cyan"
          data-text="MY PROJECTS"
        >
          MY PROJECTS
        </h1>

        <p className="text-center mb-12 text-lg" style={{ color: 'var(--color-text-secondary)' }}>
          A showcase of my recent work and experiments
        </p>

        {allProjects.length === 0 ? (
          <div className="text-center py-20">
            <p style={{ color: 'var(--color-text-secondary)' }}>
              No projects yet. Check back soon!
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>

            {hasNextPage && (
              <div className="text-center mt-12">
                <button
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  className="cyber-btn"
                >
                  {isFetchingNextPage ? 'LOADING...' : 'LOAD MORE'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}