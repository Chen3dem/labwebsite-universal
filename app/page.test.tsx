import { render, screen, waitFor } from '@testing-library/react';
import Home from './page';

// Mock the Sanity client
vi.mock('@/sanity/client', () => ({
  client: {
    fetch: vi.fn(),
  },
}));

// Mock Link since it's used in the component
vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

import { client } from '@/sanity/client';

describe('Home Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the hero section correctly', async () => {
    // Determine if we need to wrap the async component
    // In unit tests for async server components, we can often call them directly
    const ui = await Home();
    render(ui);

    expect(screen.getByText('Hello CUI Lab')).toBeInTheDocument();
    expect(screen.getByText(/Deciphering the molecular machines/i)).toBeInTheDocument();
  });

  it('displays news when data is fetched successfully', async () => {
    const mockNews = {
      title: 'New Publication in Nature',
      publishedAt: '2025-01-20T12:00:00Z',
      slug: 'new-publication',
    };

    (client.fetch as any).mockResolvedValue(mockNews);

    const ui = await Home();
    render(ui);

    expect(screen.getByText('New Publication in Nature')).toBeInTheDocument();
    // Check date formatting (implementation dependent, usually locale based)
    // We'll just check if the element exists in the document
  });

  it('displays fallback message when no news is found', async () => {
    (client.fetch as any).mockRejectedValue(new Error('Fetch failed'));

    const ui = await Home();
    render(ui);

    expect(screen.getByText(/No news posts found yet/i)).toBeInTheDocument();
  });
});