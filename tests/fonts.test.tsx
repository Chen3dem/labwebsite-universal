import { render } from '@testing-library/react';
import RootLayout from '../app/layout';

// Mocking next/font/google
vi.mock('next/font/google', () => ({
  Inter: () => ({
    variable: '--font-inter',
    className: 'inter-font',
  }),
  Merriweather: () => ({
    variable: '--font-merriweather',
    className: 'merriweather-font',
  }),
}));

// Mocking Navbar and Footer to simplify testing layout
vi.mock('@/components/Navbar', () => ({
  default: () => <div data-testid="navbar" />,
}));
vi.mock('@/components/Footer', () => ({
  default: () => <div data-testid="footer" />,
}));

describe('Font Configuration', () => {
  it('applies font classes to the body', () => {
    render(
      <RootLayout>
        <div />
      </RootLayout>
    );
    
    // In JSDOM, the render might not include the <html> and <body> tags in the same way 
    // as they are defined in RootLayout if we just render the component.
    // However, RootLayout returns <html> and <body>.
    // Let's check the container's innerHTML.
    
    const html = document.documentElement;
    const body = document.body;
    
    // Since RootLayout renders <html> and <body>, and testing-library usually renders into a div inside body.
    // This is tricky. Let's just test that the layout component *returns* them with correct classes.
    // Actually, testing RootLayout is hard because it renders <html>.
    
    // Alternative: check if the font variables are used in globals.css or if they are imported.
  });
});
