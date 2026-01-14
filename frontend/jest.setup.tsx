import '@testing-library/jest-dom';
import React from 'react';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
  useParams: () => ({}),
}));

// Mock next-auth - properly mockable
const mockUseSession = jest.fn(() => ({
  data: null,
  status: 'unauthenticated',
}));

jest.mock('next-auth/react', () => ({
  useSession: () => mockUseSession(),
  signIn: jest.fn(),
  signOut: jest.fn(),
}));

// Export for tests to use
(global as any).mockUseSession = mockUseSession;

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
  default: {
    success: jest.fn(),
    error: jest.fn(),
  },
  Toaster: () => null,
}));

// Mock GSAP
jest.mock('gsap', () => ({
  gsap: {
    fromTo: jest.fn(),
    to: jest.fn(),
  },
  fromTo: jest.fn(),
  to: jest.fn(),
}));

// Mock Monaco Editor
jest.mock('@monaco-editor/react', () => ({
  default: () => <div data-testid="monaco-editor">Monaco Editor</div>,
}));

// Mock axios
jest.mock('axios', () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
}));

// Suppress console errors in tests
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render')
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});
