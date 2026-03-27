import { render, screen } from '@testing-library/react';
import App from './App';

describe('App shell', () => {
  it('renders the museum homepage directly without a boot screen', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: /十日终焉博物馆/i })).toBeInTheDocument();
    expect(screen.queryByText(/正在接入终焉档案/)).not.toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: /馆内导航/ })).toBeInTheDocument();
  });
});
