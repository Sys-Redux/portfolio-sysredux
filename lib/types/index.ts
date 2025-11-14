export interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  isAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Project {
  id?: string;
  title: string;
  description: string;
  imageUrl: string; // Legacy: primary image URL (kept for backward compatibility)
  images: string[]; // Array of all image URLs
  primaryImageIndex: number; // Index of the primary image in the images array
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  featured?: boolean;
}

export interface ContactForm {
  name: string;
  email: string;
  message: string;
  timestamp: Date;
}