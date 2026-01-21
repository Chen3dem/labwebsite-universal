import { render } from '@testing-library/react';
import StudioPage from '../app/studio/[[...index]]/page';

// Mock NextStudio since it's a heavy client component
vi.mock('next-sanity/studio', () => ({
  NextStudio: () => <div data-testid="next-studio" />,
}));

describe('Studio Page', () => {
  it('renders NextStudio', () => {
    const { getByTestId } = render(<StudioPage />);
    expect(getByTestId('next-studio')).toBeInTheDocument();
  });
});
