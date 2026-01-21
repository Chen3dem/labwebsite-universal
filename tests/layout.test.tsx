import { render, screen } from '@testing-library/react';
import RootLayout from '../app/layout';

// Mock child components to isolate layout testing
vi.mock('@/components/Navbar', () => ({
  default: () => <nav data-testid="navbar">Navbar</nav>,
}));

vi.mock('@/components/Footer', () => ({
  default: () => <footer data-testid="footer">Footer</footer>,
}));

// Mock fonts
vi.mock('next/font/google', () => ({
  Inter: () => ({ variable: 'font-inter' }),
  Merriweather: () => ({ variable: 'font-merriweather' }),
}));

describe('Root Layout', () => {
  it('renders Navbar, Footer and children', () => {
    render(
      <RootLayout>
        <div data-testid="child-content">Child Content</div>
      </RootLayout>
    );

    // Check for Navbar
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    
    // Check for Footer
    expect(screen.getByTestId('footer')).toBeInTheDocument();
    
    // Check for Children
    expect(screen.getByTestId('child-content')).toBeInTheDocument();
  });
});
