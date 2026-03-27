import { render, screen } from '@testing-library/react';
import App from './App';

describe('Archive visuals', () => {
  it('renders the museum homepage as a fully expanded total-hall overview', () => {
    render(<App />);

    expect(screen.queryByRole('heading', { name: /终焉总馆/ })).not.toBeInTheDocument();
    expect(screen.queryByText(/终焉主脉络馆/)).not.toBeInTheDocument();
    expect(screen.getByTestId('river-stage-rail')).toBeInTheDocument();
    expect(screen.getByTestId('stage-card-prelude')).toBeInTheDocument();
    expect(screen.getByTestId('stage-card-phase-1')).toBeInTheDocument();
    expect(screen.getByTestId('stage-card-phase-5')).toBeInTheDocument();
    expect(screen.getByTestId('stage-card-finale')).toBeInTheDocument();
    expect(screen.getByTestId('stage-card-prelude')).toHaveAttribute('data-variant', 'uniform');
    expect(screen.getByTestId('stage-card-phase-1')).toHaveAttribute('data-variant', 'uniform');
    expect(screen.getByTestId('stage-card-phase-5')).toHaveTextContent(/终焉之地/);
    expect(screen.getByText(/Archive: Personae/)).toBeInTheDocument();
    expect(screen.getByText(/Chronicle: Events/)).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: /人物馆/ }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('link', { name: /事件馆/ }).length).toBeGreaterThan(0);
    expect(screen.getByText(/ID: 10-DAY-001/)).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: /底部分馆切换/ })).toBeInTheDocument();
    expect(screen.getByTestId('hero-marginalia')).toBeInTheDocument();
    expect(screen.queryByTestId('phase-dossier')).not.toBeInTheDocument();
  });
});
