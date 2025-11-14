import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ProjectCard from '@/components/projects/ProjectCard';
import { Project } from '@/lib/types';

// Mock Next.js router for navigation
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  usePathname: () => '/projects',
}));

jest.mock('next/link', () => {
  const MockLink = ({ children, href, ...props }: { children: React.ReactNode; href: string; [key: string]: unknown }) => {
    return (
      <a
        href={href}
        {...props}
        onClick={(e) => {
          e.preventDefault();
          mockPush(href);
        }}
      >
        {children}
      </a>
    );
  };
  MockLink.displayName = 'MockLink';
  return MockLink;
});

jest.mock('next/image', () => {
  const MockImage = ({ src, alt }: { src: string; alt: string }) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} />;
  };
  MockImage.displayName = 'MockImage';
  return MockImage;
});

const mockProject: Project = {
  id: 'project-123',
  title: 'Cyberpunk Dashboard',
  description: 'A futuristic admin dashboard',
  imageUrl: 'https://example.com/dashboard.jpg',
  images: ['https://example.com/dashboard.jpg'],
  primaryImageIndex: 0,
  technologies: ['React', 'Tailwind'],
  githubUrl: 'https://github.com/test/dashboard',
  liveUrl: 'https://dashboard.test',
  createdAt: new Date(),
  updatedAt: new Date(),
  featured: true,
};

describe('Project Card to Detail Page Integration', () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  test('clicking project card navigates to project detail page', async () => {
    const user = userEvent.setup();

    render(
      <QueryClientProvider client={queryClient}>
        <ProjectCard project={mockProject} />
      </QueryClientProvider>
    );

    // Find the link by its aria-label and click it
    const projectLink = screen.getByLabelText('View Cyberpunk Dashboard details');
    await user.click(projectLink);

    // Verify navigation to detail page
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/projects/project-123');
    });
  });

  test('project card displays all technologies and links correctly', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <ProjectCard project={mockProject} />
      </QueryClientProvider>
    );

    // Check technologies are displayed
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('Tailwind')).toBeInTheDocument();

    // Check link structure - find the detail page link specifically
    const links = screen.getAllByRole('link');
    const detailLink = links.find(link => link.getAttribute('href') === '/projects/project-123');
    expect(detailLink).toBeDefined();
    expect(detailLink).toHaveAttribute('href', '/projects/project-123');
  });
});