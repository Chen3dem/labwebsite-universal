import { render, screen } from '@testing-library/react';
import Navbar from '../../components/Navbar';

describe('Navbar Component', () => {
  it('renders the brand name', () => {
    render(<Navbar />);
    expect(screen.getByText((content, element) => {
      return element?.tagName.toLowerCase() === 'span' && content.includes('CUI');
    })).toBeInTheDocument();
    expect(screen.getByText('Lab')).toBeInTheDocument();
  });

  it('renders all main navigation links', () => {
    render(<Navbar />);
    expect(screen.getByRole('link', { name: /Research/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Team/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Publications/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /News/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Contact/i })).toBeInTheDocument();
  });
});
