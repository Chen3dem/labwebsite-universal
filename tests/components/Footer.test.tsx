import { render, screen } from '@testing-library/react';
import Footer from '../../components/Footer';

describe('Footer Component', () => {
  it('renders the copyright notice', () => {
    render(<Footer />);
    const year = new Date().getFullYear();
    expect(screen.getByText(new RegExp(`© ${year} CUI Lab`, 'i'))).toBeInTheDocument();
  });

  it('renders contact information', () => {
    render(<Footer />);
    expect(screen.getByText(/University of California, Berkeley/i)).toBeInTheDocument();
    expect(screen.getByText(/Department of Molecular & Cell Biology/i)).toBeInTheDocument();
  });
});
