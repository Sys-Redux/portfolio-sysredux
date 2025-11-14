import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  limit,
  startAfter,
  Timestamp,
  QueryDocumentSnapshot,
  DocumentData,
} from 'firebase/firestore';
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  uploadBytesResumable,
  UploadTask,
} from 'firebase/storage';
import { db, storage } from '@/lib/firebase/config';
import { Project } from '@/lib/types';

const PROJECTS_COLLECTION = 'projects';

// Upload single image to Firebase Storage with progress tracking
export async function uploadProjectImage(
  file: File,
  projectId: string,
  onProgress?: (progress: number) => void
): Promise<string> {
  const storageRef = ref(storage, `projects/${projectId}/${Date.now()}_${file.name}`);

  if (onProgress) {
    // Use resumable upload for progress tracking
    return new Promise((resolve, reject) => {
      const uploadTask: UploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          onProgress(Math.round(progress));
        },
        (error) => {
          reject(error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        }
      );
    });
  } else {
    // Simple upload without progress tracking
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  }
}

// Upload multiple images to Firebase Storage
export async function uploadProjectImages(
  files: File[],
  projectId: string,
  onProgress?: (progress: number) => void
): Promise<string[]> {
  const uploadPromises = files.map(async (file, index) => {
    const storageRef = ref(storage, `projects/${projectId}/${Date.now()}_${index}_${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);

    // Update progress for each file
    if (onProgress) {
      const fileProgress = ((index + 1) / files.length) * 100;
      onProgress(Math.round(fileProgress));
    }

    return downloadURL;
  });

  return Promise.all(uploadPromises);
}

// Delete image from Firebase Storage
export async function deleteProjectImage(imageUrl: string): Promise<void> {
  try {
    const imageRef = ref(storage, imageUrl);
    await deleteObject(imageRef);
  } catch (error) {
    console.error('Error deleting image:', error);
    // Continue even if deletion fails
  }
}

// Delete multiple images from Firebase Storage
export async function deleteProjectImages(imageUrls: string[]): Promise<void> {
  await Promise.all(imageUrls.map(url => deleteProjectImage(url)));
}

// Create a new project
export async function createProject(
  projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>,
  imageFiles?: File[],
  onProgress?: (progress: number) => void
): Promise<string> {
  const now = Timestamp.now();

  // Create project document first to get ID
  const projectRef = await addDoc(collection(db, PROJECTS_COLLECTION), {
    title: projectData.title,
    description: projectData.description,
    technologies: projectData.technologies,
    githubUrl: projectData.githubUrl || '',
    liveUrl: projectData.liveUrl || '',
    featured: projectData.featured || false,
    imageUrl: '', // Will be set after upload
    images: [],
    primaryImageIndex: projectData.primaryImageIndex || 0,
    createdAt: now,
    updatedAt: now,
  });

  // Upload images if provided
  if (imageFiles && imageFiles.length > 0) {
    const imageUrls = await uploadProjectImages(imageFiles, projectRef.id, onProgress);
    const primaryIndex = projectData.primaryImageIndex || 0;
    const primaryImageUrl = imageUrls[primaryIndex] || imageUrls[0];

    await updateDoc(projectRef, {
      images: imageUrls,
      imageUrl: primaryImageUrl,
      primaryImageIndex: primaryIndex
    });
  }

  return projectRef.id;
}

// Get all projects with pagination
export async function getProjects(
  pageSize: number = 9,
  lastDoc?: QueryDocumentSnapshot<DocumentData>
): Promise<{ projects: Project[]; lastVisible: QueryDocumentSnapshot<DocumentData> | null }> {
  let q = query(
    collection(db, PROJECTS_COLLECTION),
    orderBy('createdAt', 'desc'),
    limit(pageSize)
  );

  if (lastDoc) {
    q = query(q, startAfter(lastDoc));
  }

  const querySnapshot = await getDocs(q);
  const projects: Project[] = [];

  querySnapshot.forEach((doc) => {
    const data = doc.data();
    projects.push({
      id: doc.id,
      ...data,
      createdAt: data.createdAt.toDate(),
      updatedAt: data.updatedAt.toDate(),
    } as Project);
  });

  const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1] || null;

  return { projects, lastVisible };
}

// Get a single project by ID
export async function getProjectById(id: string): Promise<Project | null> {
  const docRef = doc(db, PROJECTS_COLLECTION, id);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) return null;

  const data = docSnap.data();
  return {
    id: docSnap.id,
    ...data,
    createdAt: data.createdAt.toDate(),
    updatedAt: data.updatedAt.toDate(),
  } as Project;
}

// Update a project
export async function updateProject(
  id: string,
  updates: Partial<Omit<Project, 'id' | 'createdAt' | 'updatedAt'>>,
  newImageFiles?: File[],
  onProgress?: (progress: number) => void
): Promise<void> {
  const projectRef = doc(db, PROJECTS_COLLECTION, id);

  // Upload new images if provided
  if (newImageFiles && newImageFiles.length > 0) {
    const newImageUrls = await uploadProjectImages(newImageFiles, id, onProgress);

    // Combine existing images with new ones
    type UpdatesWithExtras = typeof updates & { existingImages?: string[] };
    const existingImages = (updates as UpdatesWithExtras).existingImages || [];
    const allImages = [...existingImages, ...newImageUrls];

    const primaryIndex = updates.primaryImageIndex !== undefined ? updates.primaryImageIndex : 0;
    const primaryImageUrl = allImages[primaryIndex] || allImages[0];

    updates.images = allImages;
    updates.imageUrl = primaryImageUrl;
  }

  // Remove temporary existingImages field
  type UpdatesWithExtras = typeof updates & { existingImages?: string[] };
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { existingImages, ...cleanUpdates } = updates as UpdatesWithExtras;

  await updateDoc(projectRef, {
    ...cleanUpdates,
    updatedAt: Timestamp.now(),
  });
}

// Delete a project
export async function deleteProject(id: string): Promise<void> {
  const projectRef = doc(db, PROJECTS_COLLECTION, id);

  // Get project data to delete associated images
  const projectSnap = await getDoc(projectRef);
  if (projectSnap.exists()) {
    const projectData = projectSnap.data();

    // Delete all images if they exist
    if (projectData.images && Array.isArray(projectData.images) && projectData.images.length > 0) {
      try {
        await deleteProjectImages(projectData.images);
      } catch (error) {
        console.error('Error deleting project images:', error);
        // Continue with deletion even if image deletion fails
      }
    }
    // Fallback to single imageUrl for backward compatibility
    else if (projectData.imageUrl) {
      try {
        await deleteProjectImage(projectData.imageUrl);
      } catch (error) {
        console.error('Error deleting project image:', error);
      }
    }
  }

  await deleteDoc(projectRef);
}