import { useQuery, useMutation, useQueryClient, useInfiniteQuery, InfiniteData } from '@tanstack/react-query';
import {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} from '@/lib/services/projectService';
import { Project } from '@/lib/types';
import { QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';

// Type for project pages
type ProjectPage = { projects: Project[]; lastVisible: QueryDocumentSnapshot<DocumentData> | null };

// Query Keys
export const projectKeys = {
  all: ['projects'] as const,
  lists: () => [...projectKeys.all, 'list'] as const,
  list: (pageSize: number) => [...projectKeys.lists(), pageSize] as const,
  details: () => [...projectKeys.all, 'detail'] as const,
  detail: (id: string) => [...projectKeys.details(), id] as const,
};

// Fetch all projects with pagination (infinite query)
export function useInfiniteProjects(pageSize: number = 9) {
  return useInfiniteQuery<
    ProjectPage,
    Error,
    InfiniteData<ProjectPage>,
    readonly ["projects", "list", number],
    QueryDocumentSnapshot<DocumentData> | undefined
  >({
    queryKey: projectKeys.list(pageSize),
    queryFn: ({ pageParam }) => getProjects(pageSize, pageParam),
    getNextPageParam: (lastPage) => lastPage.lastVisible ?? undefined,
    initialPageParam: undefined,
  });
}

// Fetch single project by ID
export function useProject(id: string) {
  return useQuery({
    queryKey: projectKeys.detail(id),
    queryFn: () => getProjectById(id),
    enabled: !!id,
  });
}

// Create project mutation
export function useCreateProject(onProgress?: (progress: number) => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectData,
      imageFiles,
    }: {
      projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>;
      imageFiles?: File[];
    }) => createProject(projectData, imageFiles, onProgress),
    onSuccess: () => {
      // Invalidate and refetch projects list
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
    },
  });
}

// Update project mutation
export function useUpdateProject(onProgress?: (progress: number) => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      updates,
      imageFiles,
    }: {
      id: string;
      updates: Partial<Omit<Project, 'id' | 'createdAt' | 'updatedAt'>>;
      imageFiles?: File[];
    }) => updateProject(id, updates, imageFiles, onProgress),
    onSuccess: (_, { id }) => {
      // Invalidate specific project and list
      queryClient.invalidateQueries({ queryKey: projectKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
    },
  });
}

// Delete project mutation
export function useDeleteProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteProject(id),
    onMutate: async (id) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: projectKeys.lists() });

      // Snapshot previous value
      const previousProjects = queryClient.getQueryData(projectKeys.lists());

      // Optimistically remove project from cache
      queryClient.setQueryData(
        projectKeys.lists(),
        (old: InfiniteData<ProjectPage> | undefined) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page: ProjectPage) => ({
              ...page,
              projects: page.projects.filter((p: Project) => p.id !== id),
            })),
          };
        }
      );

      return { previousProjects };
    },
    onError: (err, id, context) => {
      // Rollback on error
      if (context?.previousProjects) {
        queryClient.setQueryData(projectKeys.lists(), context.previousProjects);
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
    },
  });
}