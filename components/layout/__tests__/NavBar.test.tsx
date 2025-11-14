import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NavBar from '../NavBar';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  usePathname: () => '/',
}));

// Create mock functions that we can control
const mockLogout = jest.fn();
let mockAuthState: {
  user: { uid: string; email: string } | null;
  loading: boolean;
  logout: jest.Mock;
} = {
  user: null,
  loading: false,
  logout: mockLogout,
};

let mockUserData: {
  data: { uid: string; isAdmin: boolean } | null;
  isLoading: boolean;
} = {
  data: null,
  isLoading: false,
};

// Mock Auth Context
jest.mock('@/lib/context/AuthContext', () => ({
  useAuth: () => mockAuthState,
}));

// Mock useUserData hook
jest.mock('@/lib/hooks/useUserData', () => ({
  useUserData: () => mockUserData,
}));

describe('NavBar', () => {
  beforeEach(() => {
    // Reset mocks before each test
    mockAuthState = {
      user: null,
      loading: false,
      logout: mockLogout,
    };
    mockUserData = {
      data: null,
      isLoading: false,
    };
    mockLogout.mockClear();
  });

  test('renders logo and navigation links', () => {
    render(<NavBar />);

    expect(screen.getByText('SYS-REDUX')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Projects')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
  });

  test('hamburger menu toggles mobile menu', async () => {
    const user = userEvent.setup();
    render(<NavBar />);

    // Menu should be closed initially (translated off-screen)
    const mobileMenu = screen.getByText('Home').closest('div');
    expect(mobileMenu).toHaveClass('-translate-x-full');

    // Find the hamburger menu by finding the div with cursor-pointer class
    const hamburger = document.querySelector('.cursor-pointer');
    expect(hamburger).toBeTruthy();

    // Click hamburger to open
    await user.click(hamburger!);

    // Menu should be open (translated on-screen)
    expect(mobileMenu).toHaveClass('translate-x-0');
  });

  describe('when user is not authenticated', () => {
    test('displays Login button', () => {
      render(<NavBar />);

      expect(screen.getByText('Login')).toBeInTheDocument();
      expect(screen.queryByText('Logout')).not.toBeInTheDocument();
      expect(screen.queryByText('Settings')).not.toBeInTheDocument();
    });
  });

  describe('when user is authenticated', () => {
    beforeEach(() => {
      // Mock authenticated user
      mockAuthState = {
        user: { uid: 'test-uid', email: 'test@example.com' },
        loading: false,
        logout: mockLogout,
      };
      mockUserData = {
        data: { uid: 'test-uid', isAdmin: false },
        isLoading: false,
      };
    });

    test('displays Settings and Logout buttons', () => {
      render(<NavBar />);

      expect(screen.getByText('Settings')).toBeInTheDocument();
      expect(screen.getByText('Logout')).toBeInTheDocument();
      expect(screen.queryByText('Login')).not.toBeInTheDocument();
    });

    test('does not display Admin button for non-admin users', () => {
      render(<NavBar />);

      expect(screen.queryByText('Admin')).not.toBeInTheDocument();
    });
  });

  describe('when user is authenticated as admin', () => {
    beforeEach(() => {
      // Mock admin user
      mockAuthState = {
        user: { uid: 'admin-uid', email: 'admin@example.com' },
        loading: false,
        logout: mockLogout,
      };
      mockUserData = {
        data: { uid: 'admin-uid', isAdmin: true },
        isLoading: false,
      };
    });

    test('displays Admin, Settings and Logout buttons', () => {
      render(<NavBar />);

      expect(screen.getByText('Admin')).toBeInTheDocument();
      expect(screen.getByText('Settings')).toBeInTheDocument();
      expect(screen.getByText('Logout')).toBeInTheDocument();
      expect(screen.queryByText('Login')).not.toBeInTheDocument();
    });
  });
});