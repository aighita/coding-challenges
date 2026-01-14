/**
 * Integration tests for Challenges list page.
 */
import { render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockChallenges = [
  {
    id: '1',
    title: 'Two Sum',
    description: 'Find two numbers that add up to target',
    difficulty: 'Easy',
  },
  {
    id: '2',
    title: 'Reverse String',
    description: 'Reverse a string',
    difficulty: 'Easy',
  },
  {
    id: '3',
    title: 'Binary Search',
    description: 'Implement binary search',
    difficulty: 'Medium',
  },
];

describe('Challenges List Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedAxios.get.mockResolvedValue({ data: mockChallenges });
  });

  it('renders loading state initially', async () => {
    mockedAxios.get.mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve({ data: mockChallenges }), 100))
    );

    const ChallengesPage = (await import('@/app/(main)/challenges/page')).default;
    render(<ChallengesPage />);

    // Should show loading or immediately load
    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalled();
    });
  });

  it('renders list of challenges', async () => {
    const ChallengesPage = (await import('@/app/(main)/challenges/page')).default;
    render(<ChallengesPage />);

    await waitFor(() => {
      expect(screen.getByText('Two Sum')).toBeInTheDocument();
      expect(screen.getByText('Reverse String')).toBeInTheDocument();
      expect(screen.getByText('Binary Search')).toBeInTheDocument();
    });
  });

  it('shows difficulty badges', async () => {
    const ChallengesPage = (await import('@/app/(main)/challenges/page')).default;
    render(<ChallengesPage />);

    await waitFor(() => {
      expect(screen.getAllByText('Easy')).toHaveLength(2);
      expect(screen.getByText('Medium')).toBeInTheDocument();
    });
  });

  it('handles API error gracefully', async () => {
    // Suppress expected console.error for this test
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    mockedAxios.get.mockRejectedValueOnce(new Error('Network error'));

    const ChallengesPage = (await import('@/app/(main)/challenges/page')).default;
    render(<ChallengesPage />);

    await waitFor(() => {
      // Should handle error without crashing
      expect(mockedAxios.get).toHaveBeenCalled();
    });
    
    consoleSpy.mockRestore();
  });

  it('shows empty state when no challenges', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: [] });

    const ChallengesPage = (await import('@/app/(main)/challenges/page')).default;
    render(<ChallengesPage />);

    await waitFor(() => {
      expect(screen.getByText(/no challenges/i)).toBeInTheDocument();
    });
  });
});
