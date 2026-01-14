/**
 * Integration tests for Login page.
 */
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { signIn } from 'next-auth/react';

// Mock modules
jest.mock('next-auth/react', () => ({
  useSession: () => ({ data: null, status: 'unauthenticated' }),
  signIn: jest.fn(),
}));

describe('Login Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders login form', async () => {
    const LoginPage = (await import('@/app/(main)/(auth)/login/page')).default;
    render(<LoginPage />);

    expect(screen.getByText(/sign in to your account/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('shows link to register page', async () => {
    const LoginPage = (await import('@/app/(main)/(auth)/login/page')).default;
    render(<LoginPage />);

    expect(screen.getByText(/create one/i)).toBeInTheDocument();
  });

  it('handles form submission', async () => {
    (signIn as jest.Mock).mockResolvedValue({ error: null });

    const LoginPage = (await import('@/app/(main)/(auth)/login/page')).default;
    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: 'testuser' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(signIn).toHaveBeenCalledWith('credentials', expect.objectContaining({
        username: 'testuser',
        password: 'password123',
      }));
    });
  });

  it('shows error on failed login', async () => {
    (signIn as jest.Mock).mockResolvedValue({ error: 'Invalid credentials' });

    const LoginPage = (await import('@/app/(main)/(auth)/login/page')).default;
    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: 'wronguser' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'wrongpass' },
    });

    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText(/invalid username or password/i)).toBeInTheDocument();
    });
  });

  it('disables button while loading', async () => {
    (signIn as jest.Mock).mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 1000))
    );

    const LoginPage = (await import('@/app/(main)/(auth)/login/page')).default;
    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: 'testuser' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByRole('button')).toBeDisabled();
    });
  });
});
