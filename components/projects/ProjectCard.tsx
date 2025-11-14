import Image from 'next/image';
import Link from 'next/link';
import { Project } from '@/lib/types';
import { ExternalLink, Github } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div className="cyber-card group relative">
      {/* Clickable Overlay to Detail Page */}
      <Link
        href={`/projects/${project.id}`}
        className="absolute inset-0 z-10 cursor-pointer"
        aria-label={`View ${project.title} details`}
      />
      {/* Project Image */}
      <div className="relative h-48 mb-4 rounded overflow-hidden">
        {project.imageUrl ? (
          <Image
            src={project.imageUrl}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-darker-bg">
            <span style={{ color: 'var(--color-text-secondary)' }}>No Image</span>
          </div>
        )}
        <div className="absolute inset-0 bg-linear-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Featured Badge */}
      {project.featured && (
        <div className="absolute top-2 left-2 px-2 py-1 rounded text-xs font-bold bg-primary-pink text-white">
          FEATURED
        </div>
      )}

      {/* Project Info */}
      <h3 className="font-['Orbitron'] text-xl font-bold mb-2" style={{ color: 'var(--color-primary-cyan)' }}>
        {project.title}
      </h3>

      <p className="mb-4 line-clamp-3" style={{ color: 'var(--color-text-secondary)' }}>
        {project.description}
      </p>

      {/* Technologies */}
      <div className="flex flex-wrap gap-2 mb-4">
        {project.technologies.map((tech, index) => (
          <span
            key={index}
            className="px-2 py-1 text-xs rounded"
            style={{
              border: '1px solid var(--color-border)',
              color: 'var(--color-primary-green)',
            }}
          >
            {tech}
          </span>
        ))}
      </div>

      {/* Links */}
      <div className="flex gap-4 relative z-20">
        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-2 text-sm hover:text-primary-cyan transition-colors"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            <Github size={16} />
            Code
          </a>
        )}
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-2 text-sm hover:text-primary-cyan transition-colors"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            <ExternalLink size={16} />
            Live Demo
          </a>
        )}
      </div>
    </div>
  );
}