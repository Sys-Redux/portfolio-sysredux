'use client';

import { useState } from 'react';
import { Project } from '@/lib/types';
import { X, Upload } from 'lucide-react';
import Image from 'next/image';

interface ProjectFormProps {
  initialData?: Project;
  onSubmit: (
    data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>,
    imageFiles?: File[]
  ) => void;
  onCancel: () => void;
  onDelete?: () => void;
  isLoading?: boolean;
  uploadProgress?: number;
}

interface ImageItem {
  file?: File;
  url: string;
  isNew: boolean;
}

export default function ProjectForm({ initialData, onSubmit, onCancel, onDelete, isLoading, uploadProgress }: ProjectFormProps) {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    imageUrl: initialData?.imageUrl || '',
    images: initialData?.images || [],
    primaryImageIndex: initialData?.primaryImageIndex || 0,
    technologies: initialData?.technologies || [],
    githubUrl: initialData?.githubUrl || '',
    liveUrl: initialData?.liveUrl || '',
    featured: initialData?.featured || false,
  });

  const [techInput, setTechInput] = useState('');
  const [imageItems, setImageItems] = useState<ImageItem[]>(
    initialData?.images?.map(url => ({ url, isNew: false })) || []
  );
  const [primaryImageIndex, setPrimaryImageIndex] = useState(initialData?.primaryImageIndex || 0);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImageItems(prev => [...prev, {
            file,
            url: reader.result as string,
            isNew: true
          }]);
        };
        reader.readAsDataURL(file);
      });

      // Reset file input
      const fileInput = document.getElementById('imageInput') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    }
  };

  const handleRemoveImage = (index: number) => {
    setImageItems(prev => prev.filter((_, i) => i !== index));

    // Adjust primary image index if needed
    if (primaryImageIndex >= imageItems.length - 1) {
      setPrimaryImageIndex(Math.max(0, imageItems.length - 2));
    } else if (primaryImageIndex > index) {
      setPrimaryImageIndex(primaryImageIndex - 1);
    }
  };

  const handleSetPrimaryImage = (index: number) => {
    setPrimaryImageIndex(index);
  };

  const handleAddTech = () => {
    if (techInput.trim() && !formData.technologies.includes(techInput.trim())) {
      setFormData({
        ...formData,
        technologies: [...formData.technologies, techInput.trim()],
      });
      setTechInput('');
    }
  };

  const handleRemoveTech = (tech: string) => {
    setFormData({
      ...formData,
      technologies: formData.technologies.filter((t) => t !== tech),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (imageItems.length === 0) {
      alert('Please add at least one image to the project.');
      return;
    }

    // Extract new image files
    const newImageFiles = imageItems.filter(item => item.isNew && item.file).map(item => item.file!);

    // For editing, preserve existing image URLs
    const existingImageUrls = imageItems.filter(item => !item.isNew).map(item => item.url);

    // Update formData with image info
    const updatedFormData = {
      ...formData,
      images: imageItems.map(item => item.url),
      primaryImageIndex,
      imageUrl: imageItems[primaryImageIndex]?.url || '',
      existingImages: existingImageUrls,
    };

    // Pass to parent with files
    onSubmit(updatedFormData, newImageFiles);
  };

  return (
    <form onSubmit={handleSubmit} className="cyber-card space-y-4">
      <h2 className="font-['Orbitron'] text-2xl font-bold neon-text">
        {initialData ? 'EDIT PROJECT' : 'NEW PROJECT'}
      </h2>

      <div>
        <label className="block mb-2 font-['Rajdhani'] text-lg" style={{ color: 'var(--color-text-secondary)' }}>
          Title
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
          disabled={isLoading}
          className="w-full p-3 rounded border bg-transparent"
          style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }}
        />
      </div>

      <div>
        <label className="block mb-2 font-['Rajdhani'] text-lg" style={{ color: 'var(--color-text-secondary)' }}>
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
          disabled={isLoading}
          rows={4}
          className="w-full p-3 rounded border bg-transparent"
          style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }}
        />
      </div>

      <div>
        <label className="block mb-2 font-['Rajdhani'] text-lg" style={{ color: 'var(--color-text-secondary)' }}>
          Project Images
        </label>

        {/* Image Gallery */}
        {imageItems.length > 0 && (
          <div className="mb-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
              {imageItems.map((item, index) => (
                <div
                  key={index}
                  className={`relative rounded border-2 overflow-hidden cursor-pointer transition-all ${
                    primaryImageIndex === index
                      ? 'border-primary-green ring-2 ring-primary-green'
                      : 'border-border hover:border-(--color-primary-cyan)'
                  }`}
                  onClick={() => handleSetPrimaryImage(index)}
                >
                  <div className="relative w-full h-32">
                    <Image
                      src={item.url}
                      alt={`Project image ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Primary Badge */}
                  {primaryImageIndex === index && (
                    <div className="absolute top-2 left-2 px-2 py-1 rounded text-xs font-['Rajdhani'] font-bold bg-primary-green text-black">
                      PRIMARY
                    </div>
                  )}

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveImage(index);
                    }}
                    disabled={isLoading}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-red-900/80 hover:bg-red-800 transition-colors"
                    title="Remove image"
                  >
                    <X size={14} className="text-red-400" />
                  </button>
                </div>
              ))}
            </div>
            <p className="text-sm mb-4" style={{ color: 'var(--color-text-secondary)' }}>
              Click an image to set it as the primary thumbnail for the project card
            </p>
          </div>
        )}

        {/* Upload Zone */}
        <div className="mb-4">
          <label
            htmlFor="imageInput"
            className="flex flex-col items-center justify-center w-full h-32 rounded border-2 border-dashed cursor-pointer hover:border-(--color-primary-cyan) transition-colors"
            style={{ borderColor: 'var(--color-border)' }}
          >
            <div className="flex flex-col items-center justify-center py-4">
              <Upload size={32} style={{ color: 'var(--color-primary-cyan)' }} />
              <p className="mt-2 text-sm font-['Rajdhani']" style={{ color: 'var(--color-text-secondary)' }}>
                <span className="font-semibold" style={{ color: 'var(--color-primary-cyan)' }}>Add {imageItems.length > 0 ? 'more ' : ''}images</span>
              </p>
              <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                PNG, JPG, GIF up to 10MB (multiple files supported)
              </p>
            </div>
          </label>
          <input
            id="imageInput"
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            disabled={isLoading}
            className="hidden"
          />
        </div>

        {/* Upload Progress Bar */}
        {isLoading && uploadProgress !== undefined && uploadProgress > 0 && (
          <div className="mb-4">
            <div className="flex justify-between mb-1">
              <span className="text-sm font-['Rajdhani']" style={{ color: 'var(--color-text-secondary)' }}>
                Uploading images...
              </span>
              <span className="text-sm font-['Rajdhani']" style={{ color: 'var(--color-primary-cyan)' }}>
                {uploadProgress}%
              </span>
            </div>
            <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'var(--color-border)' }}>
              <div
                className="h-full transition-all duration-300 rounded-full"
                style={{
                  width: `${uploadProgress}%`,
                  background: 'linear-gradient(90deg, var(--color-primary-cyan), var(--color-primary-green))',
                  boxShadow: '0 0 10px var(--color-primary-cyan)'
                }}
              />
            </div>
          </div>
        )}
      </div>

      <div>
        <label className="block mb-2 font-['Rajdhani'] text-lg" style={{ color: 'var(--color-text-secondary)' }}>
          Technologies
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={techInput}
            onChange={(e) => setTechInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTech())}
            placeholder="Add technology..."
            disabled={isLoading}
            className="flex-1 p-3 rounded border bg-transparent"
            style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }}
          />
          <button
            type="button"
            onClick={handleAddTech}
            disabled={isLoading}
            className="cyber-btn"
          >
            ADD
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.technologies.map((tech) => (
            <span
              key={tech}
              className="flex items-center gap-2 px-3 py-1 rounded border"
              style={{ borderColor: 'var(--color-border)', color: 'var(--color-primary-green)' }}
            >
              {tech}
              <button type="button" onClick={() => handleRemoveTech(tech)} disabled={isLoading}>
                <X size={14} />
              </button>
            </span>
          ))}
        </div>
      </div>

      <div>
        <label className="block mb-2 font-['Rajdhani'] text-lg" style={{ color: 'var(--color-text-secondary)' }}>
          GitHub URL (optional)
        </label>
        <input
          type="url"
          value={formData.githubUrl}
          onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
          disabled={isLoading}
          className="w-full p-3 rounded border bg-transparent"
          style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }}
        />
      </div>

      <div>
        <label className="block mb-2 font-['Rajdhani'] text-lg" style={{ color: 'var(--color-text-secondary)' }}>
          Live URL (optional)
        </label>
        <input
          type="url"
          value={formData.liveUrl}
          onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
          disabled={isLoading}
          className="w-full p-3 rounded border bg-transparent"
          style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }}
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="featured"
          checked={formData.featured}
          onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
          disabled={isLoading}
          className="w-5 h-5"
        />
        <label htmlFor="featured" className="font-['Rajdhani'] text-lg" style={{ color: 'var(--color-text-secondary)' }}>
          Featured Project
        </label>
      </div>

      <div className="flex gap-4">
        <button type="submit" disabled={isLoading} className="cyber-btn success flex-1">
          {isLoading ? 'SAVING...' : 'SAVE PROJECT'}
        </button>
        <button type="button" onClick={onCancel} disabled={isLoading} className="cyber-btn secondary flex-1">
          CANCEL
        </button>
      </div>

      {/* Delete Button (only show when editing) */}
      {initialData && onDelete && (
        <div className="mt-4 pt-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
          <button
            type="button"
            onClick={() => {
              if (confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
                onDelete();
              }
            }}
            disabled={isLoading}
            className="cyber-btn w-full bg-red-900/20 border-red-500 hover:bg-red-900/40 text-red-400"
          >
            DELETE PROJECT
          </button>
        </div>
      )}
    </form>
  );
}