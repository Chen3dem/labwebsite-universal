import { render, screen } from '@testing-library/react';
import Home from './page';

describe('Home Page', () => {
  it('renders the core heading', () => {
    render(<Home />);
    const heading = screen.getByText(/Hello CUI Lab/i);
    expect(heading).toBeInTheDocument();
  });

  it('does not contain old boilerplate content', () => {
    render(<Home />);
    const oldText = screen.queryByText(/Deciphering the Molecular Machines/i);
    expect(oldText).not.toBeInTheDocument();
  });
});
