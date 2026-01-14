/**
 * Integration tests for Register page.
 */
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Register Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders registration form', async () => {
    const RegisterPage = (await import('@/app/(main)/(auth)/register/page')).default;
    render(<RegisterPage />);

    expect(screen.getByText(/create your account/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getAllByLabelText(/password/i)).toHaveLength(2);
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
  });

  it('shows link to login page', async () => {
    const RegisterPage = (await import('@/app/(main)/(auth)/register/page')).default;
    render(<RegisterPage />);

    expect(screen.getByText(/sign in/i)).toBeInTheDocument();
  });

  it('validates password match', async () => {
    const RegisterPage = (await import('@/app/(main)/(auth)/register/page')).default;
    render(<RegisterPage />);

    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: 'testuser' },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    
    const passwordFields = screen.getAllByLabelText(/password/i);
    fireEvent.change(passwordFields[0], {
      target: { value: 'password123' },
    });
    fireEvent.change(passwordFields[1], {
      target: { value: 'differentpassword' },
    });

    fireEvent.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() => {
      expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
    });
  });

  it('handles successful registration', async () => {
    mockedAxios.post.mockResolvedValueOnce({ data: { success: true } });

    const RegisterPage = (await import('@/app/(main)/(auth)/register/page')).default;
    render(<RegisterPage />);

    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: 'newuser' },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'new@example.com' },
    });
    
    const passwordFields = screen.getAllByLabelText(/password/i);
    fireEvent.change(passwordFields[0], {
      target: { value: 'password123' },
    });
    fireEvent.change(passwordFields[1], {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith('/api/auth/register', {
        username: 'newuser',
        email: 'new@example.com',
        password: 'password123',
      });
    });
  });

  it('shows error on failed registration', async () => {
    mockedAxios.post.mockRejectedValueOnce({
      response: { data: { message: 'Email already exists' } },
    });

    const RegisterPage = (await import('@/app/(main)/(auth)/register/page')).default;
    render(<RegisterPage />);

    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: 'existinguser' },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'existing@example.com' },
    });
    
    const passwordFields = screen.getAllByLabelText(/password/i);
    fireEvent.change(passwordFields[0], {
      target: { value: 'password123' },
    });
    fireEvent.change(passwordFields[1], {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() => {
      expect(screen.getByText(/email already exists/i)).toBeInTheDocument();
    });
  });
});
