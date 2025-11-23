'use client';

import { useProject, useUpdateProject, useDeleteProject } from '@/lib/hooks/useProjects';
import { useAuth } from '@/lib/context/AuthContext';
import { useUserData } from '@/lib/hooks/useUserData';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useState } from 'react';
import { ArrowLeft, GitPullRequestDraft, ExternalLink, ChevronLeft, ChevronRight, Edit, X } from 'lucide-react';
import ProjectForm from '@/components/projects/ProjectForm';
import type { Project } from '@/lib/types';

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const { user } = useAuth();
  const { data: userData } = useUserData();
  const { data: project, isLoading, error } = useProject(projectId);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const updateMutation = useUpdateProject((progress) => setUploadProgress(progress));
  const deleteMutation = useDeleteProject();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center py-24">
        <div className="loading" />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen flex items-center justify-center py-24 px-8">
        <div className="cyber-card max-w-md text-center">
          <h1 className="font-['Orbitron'] text-2xl font-bold mb-4 text-red-400">
            PROJECT NOT FOUND
          </h1>
          <p className="mb-6" style={{ color: 'var(--color-text-secondary)' }}>
            The project you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <button onClick={() => router.push('/projects')} className="cyber-btn">
            <ArrowLeft size={20} className="inline mr-2" />
            Back to Projects
          </button>
        </div>
      </div>
    );
  }

  const images = project.images || [project.imageUrl];
  const currentImage = images[selectedImageIndex] || images[0];

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleUpdate = async (
    projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>,
    imageFiles?: File[]
  ) => {
    try {
      setUploadProgress(0);
      await updateMutation.mutateAsync({
        id: projectId,
        updates: projectData,
        imageFiles,
      });
      setIsEditing(false);
      setUploadProgress(0);
    } catch (error) {
      console.error('Failed to update project:', error);
      alert('Failed to update project. Please try again.');
      setUploadProgress(0);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(projectId);
      router.push('/projects');
    } catch (error) {
      console.error('Failed to delete project:', error);
      alert('Failed to delete project. Please try again.');
    }
  };

  const isAdmin = user && userData?.isAdmin;

  return (
    <div className="min-h-screen py-24 px-8">
      <div className="max-w-[1200px] mx-auto">
        {/* Back Button and Edit Button */}
        <div className="flex justify-between items-center mb-8 gap-4">
          <button
            onClick={() => router.push('/projects')}
            className="cyber-btn secondary inline-flex items-center gap-2"
          >
            <ArrowLeft size={20} />
            Back to Projects
          </button>

          {isAdmin && !isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="cyber-btn inline-flex items-center gap-2"
            >
              <Edit size={20} />
              Edit Project
            </button>
          )}
        </div>

        {/* Edit Form */}
        {isEditing && isAdmin && (
          <div className="mb-8">
            <ProjectForm
              initialData={project}
              onSubmit={handleUpdate}
              onCancel={() => setIsEditing(false)}
              onDelete={handleDelete}
              isLoading={updateMutation.isPending}
              uploadProgress={uploadProgress}
            />
          </div>
        )}

        {/* Project Content (hidden when editing) */}
        {!isEditing && (
          <>
            {/* Project Header */}
            <div className="mb-8">
              <h1 className="font-['Orbitron'] text-4xl md:text-5xl font-bold mb-4">
                {project.title}
              </h1>
              {project.featured && (
                <span className="inline-block px-3 py-1 rounded text-sm font-['Rajdhani'] font-bold bg-primary-green text-black">
                  FEATURED PROJECT
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Image Gallery */}
          <div className="cyber-card">
            {/* Main Image */}
            <div
              className="relative w-full aspect-video mb-4 rounded overflow-hidden border cursor-pointer group"
              style={{ borderColor: 'var(--color-border)' }}
              onClick={() => setIsLightboxOpen(true)}
            >
              <Image
                src={currentImage}
                alt={`${project.title} - Image ${selectedImageIndex + 1}`}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />

              {/* Click hint overlay - hidden on mobile */}
              <div className="hidden md:flex absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors items-center justify-center">
                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-white font-['Rajdhani'] text-lg bg-black/70 px-4 py-2 rounded">
                  Click to enlarge
                </span>
              </div>

              {/* Navigation Arrows (only show if multiple images) - hidden on mobile */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="hidden md:block absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/70 hover:bg-black/90 transition-colors"
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={24} style={{ color: 'var(--color-primary-cyan)' }} />
                  </button>
                  <button
                    onClick={nextImage}
                    className="hidden md:block absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/70 hover:bg-black/90 transition-colors"
                    aria-label="Next image"
                  >
                    <ChevronRight size={24} style={{ color: 'var(--color-primary-cyan)' }} />
                  </button>

                  {/* Image Counter */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded bg-black/70 text-sm font-['Rajdhani']">
                    {selectedImageIndex + 1} / {images.length}
                  </div>
                </>
              )}
            </div>

            {/* Image Thumbnails */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative h-20 rounded overflow-hidden border-2 transition-all ${
                      selectedImageIndex === index
                        ? 'border-primary-cyan ring-2 ring-primary-cyan'
                        : 'border-border hover:border-(--color-primary-cyan)'
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Project Details */}
          <div className="space-y-6">
            {/* Description */}
            <div className="cyber-card">
              <h2 className="font-['Orbitron'] text-2xl font-bold mb-4">
                DESCRIPTION
              </h2>
              <p className="leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                {project.description}
              </p>
            </div>

            {/* Technologies */}
            <div className="cyber-card">
              <h2 className="font-['Orbitron'] text-2xl font-bold mb-4">
                TECHNOLOGIES
              </h2>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 rounded border font-['Rajdhani']"
                    style={{ borderColor: 'var(--color-border)', color: 'var(--color-primary-green)' }}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Links */}
            <div className="cyber-card">
              <h2 className="font-['Orbitron'] text-2xl font-bold mb-4">
                LINKS
              </h2>
              <div className="space-y-3">
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cyber-btn w-full flex items-center justify-center gap-2"
                  >
                    <GitPullRequestDraft size={20} />
                    View Source Code
                  </a>
                )}
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cyber-btn success w-full flex items-center justify-center gap-2"
                  >
                    <ExternalLink size={20} />
                    Visit Live Site
                  </a>
                )}
                {!project.githubUrl && !project.liveUrl && (
                  <p style={{ color: 'var(--color-text-secondary)' }}>
                    No external links available
                  </p>
                )}
              </div>
            </div>

            {/* Project Info */}
            <div className="cyber-card">
              <h2 className="font-['Orbitron'] text-2xl font-bold mb-4">
                PROJECT INFO
              </h2>
              <div className="space-y-2 font-['Rajdhani']" style={{ color: 'var(--color-text-secondary)' }}>
                <p>
                  <span className="font-bold" style={{ color: 'var(--color-primary-cyan)' }}>Created:</span>{' '}
                  {new Date(project.createdAt).toLocaleDateString()}
                </p>
                <p>
                  <span className="font-bold" style={{ color: 'var(--color-primary-cyan)' }}>Last Updated:</span>{' '}
                  {new Date(project.updatedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
            </div>
          </>
        )}

        {/* Lightbox Modal */}
        {isLightboxOpen && (
          <div
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
            onClick={() => setIsLightboxOpen(false)}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/70 hover:bg-black/90 transition-colors z-10"
              aria-label="Close lightbox"
            >
              <X size={32} style={{ color: 'var(--color-primary-cyan)' }} />
            </button>

            {/* Navigation Arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/70 hover:bg-black/90 transition-colors z-10"
                  aria-label="Previous image"
                >
                  <ChevronLeft size={32} style={{ color: 'var(--color-primary-cyan)' }} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/70 hover:bg-black/90 transition-colors z-10"
                  aria-label="Next image"
                >
                  <ChevronRight size={32} style={{ color: 'var(--color-primary-cyan)' }} />
                </button>

                {/* Image Counter */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 px-4 py-2 rounded bg-black/70 text-lg font-['Rajdhani']">
                  {selectedImageIndex + 1} / {images.length}
                </div>
              </>
            )}

            {/* Large Image */}
            <div
              className="relative w-full h-full max-w-7xl max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={currentImage}
                alt={`${project.title} - Image ${selectedImageIndex + 1}`}
                fill
                className="object-contain"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
