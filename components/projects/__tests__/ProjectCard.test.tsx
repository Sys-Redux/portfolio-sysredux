import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ProjectCard from '../ProjectCard';
import type { Project } from '@/lib/types';

jest.mock('next/link', () => {
    const MockLink = ({ children, href, ...props }: { children: React.ReactNode; href: string; [key: string]: unknown }) => {
        return <a href={href} {...props}>{children}</a>;
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
  id: 'test-project-1',
  title: 'Test Project',
  description: 'A test project description',
  imageUrl: 'https://example.com/image.jpg',
  images: ['https://example.com/image.jpg'],
  primaryImageIndex: 0,
  technologies: ['React', 'Next.js', 'TypeScript'],
  githubUrl: 'https://github.com/test/repo',
  liveUrl: 'https://test-project.com',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
  featured: true,
};

describe('ProjectCard', () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  const renderWithClient = (component: React.ReactNode) => {
    return render(
      <QueryClientProvider client={queryClient}>
        {component}
      </QueryClientProvider>
    );
  };

  test('renders project title and description', () => {
    renderWithClient(<ProjectCard project={mockProject} />);

    expect(screen.getByText('Test Project')).toBeInTheDocument();
    expect(screen.getByText('A test project description')).toBeInTheDocument();
  });

  test('renders project technologies as badges', () => {
    renderWithClient(<ProjectCard project={mockProject} />);

    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('Next.js')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
  });

  test('displays project image with correct alt text', () => {
    renderWithClient(<ProjectCard project={mockProject} />);

    const image = screen.getByAltText('Test Project');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://example.com/image.jpg');
  });

  test('links to project detail page', () => {
    renderWithClient(<ProjectCard project={mockProject} />);

    // Get all links and find the one to the project detail page
    const links = screen.getAllByRole('link');
    const detailLink = links.find(link => link.getAttribute('href') === '/projects/test-project-1');

    expect(detailLink).toBeDefined();
    expect(detailLink).toHaveAttribute('href', '/projects/test-project-1');
  });
});