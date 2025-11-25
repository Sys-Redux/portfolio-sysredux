import { useQuery } from '@tanstack/react-query';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { Project } from '@/lib/types';

export function useFeaturedProjects(limitCount: number = 6) {
    return useQuery({
        queryKey: ['projects', 'featured', limitCount],
        queryFn: async () => {
            const projectsRef = collection(db, 'projects');
            const q = query(
                projectsRef,
                where('featured', '==', true),
                orderBy('createdAt', 'desc'),
                limit(limitCount)
            );

            const snapshot = await getDocs(q);
            const projects: Project[] = [];

            snapshot.forEach((doc) => {
                const data = doc.data();
                projects.push({
                    id: doc.id,
                    title: data.title,
                    description: data.description,
                    imageUrl: data.imageUrl,
                    images: data.images || [data.imageUrl],
                    primaryImageIndex: data.primaryImageIndex || 0,
                    technologies: data.technologies || [],
                    githubUrl: data.githubUrl,
                    liveUrl: data.liveUrl,
                    featured: data.featured || false,
                    createdAt: data.createdAt?.toDate() || new Date(),
                    updatedAt: data.updatedAt?.toDate() || new Date(),
                });
            });
            return projects;
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}