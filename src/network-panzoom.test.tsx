import { render, screen } from '@testing-library/react';
import App from './App';

describe('Phase layout', () => {
  it('renders the expanded total-hall timeline and the museum branch hall index', () => {
    render(<App />);
    expect(screen.getByTestId('river-stage-rail')).toBeInTheDocument();
    expect(screen.getByTestId('river-axis')).toBeInTheDocument();
    expect(screen.getByTestId('stage-card-prelude')).toBeInTheDocument();
    expect(screen.getByTestId('stage-card-finale')).toBeInTheDocument();
    expect(screen.getByText(/Archive: Personae/)).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: /人物馆/ }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('link', { name: /事件馆/ }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('link', { name: /世界观馆/ }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('link', { name: /关系馆/ }).length).toBeGreaterThan(0);
  });
});
