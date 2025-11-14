'use client';

import { useState } from 'react';
import { useInfiniteProjects, useCreateProject } from '@/lib/hooks/useProjects';
import { useAuth } from '@/lib/context/AuthContext';
import { useUserData } from '@/lib/hooks/useUserData';
import { useRouter } from 'next/navigation';
import ProjectCard from '@/components/projects/ProjectCard';
import ProjectForm from '@/components/projects/ProjectForm';
import { Plus, Shield } from 'lucide-react';
import type { Project } from '@/lib/types';

export default function AdminProjectsPage() {
  const { user, loading: authLoading } = useAuth();
  const { data: userData, isLoading: userDataLoading } = useUserData();
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteProjects(9);

  const createMutation = useCreateProject((progress) => setUploadProgress(progress));

  // Redirect if not authenticated
  if (!authLoading && !user) {
    router.push('/login');
    return null;
  }

  // Block access if user is not an admin
  if (!authLoading && !userDataLoading && user && userData && !userData.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center py-24 px-8">
        <div className="cyber-card max-w-md text-center">
          <Shield size={64} className="mx-auto mb-4 text-red-400" />
          <h1 className="font-['Orbitron'] text-2xl font-bold mb-4 text-red-400">
            ACCESS DENIED
          </h1>
          <p className="mb-6" style={{ color: 'var(--color-text-secondary)' }}>
            You do not have administrator privileges to access this page.
          </p>
          <button
            onClick={() => router.push('/')}
            className="cyber-btn"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  const handleCreate = async (
    projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>,
    imageFiles?: File[]
  ) => {
    try {
      setUploadProgress(0);
      await createMutation.mutateAsync({ projectData, imageFiles });
      setShowForm(false);
      setUploadProgress(0);
    } catch (error) {
      console.error('Failed to create project:', error);
      alert('Failed to create project. Please try again.');
      setUploadProgress(0);
    }
  };

  if (authLoading || userDataLoading || isLoading) {
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
        <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
          <h1 className="font-['Orbitron'] text-4xl font-bold glitch text-primary-cyan"
            data-text="MANAGE PROJECTS"
          >
            MANAGE PROJECTS
          </h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="cyber-btn success flex items-center gap-2"
          >
            <Plus size={20} />
            {showForm ? 'CANCEL' : 'NEW PROJECT'}
          </button>
        </div>

        {showForm && (
          <div className="mb-8">
            <ProjectForm
              onSubmit={handleCreate}
              onCancel={() => setShowForm(false)}
              isLoading={createMutation.isPending}
              uploadProgress={uploadProgress}
            />
          </div>
        )}

        {allProjects.length === 0 ? (
          <div className="text-center py-20 cyber-card">
            <p className="mb-4" style={{ color: 'var(--color-text-secondary)' }}>
              No projects yet. Create your first project!
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="cyber-btn success"
            >
              CREATE PROJECT
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                />
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