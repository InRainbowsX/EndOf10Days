import { render, screen, within } from '@testing-library/react';
import App from './App';

describe('Phase graph visuals', () => {
  it('keeps the centered river axis visible while alternating stage cards around it', () => {
    render(<App />);
    const phaseCard = screen.getByTestId('stage-card-finale');

    expect(screen.getByTestId('river-stage-rail')).toBeInTheDocument();
    expect(screen.getByTestId('river-axis')).toBeInTheDocument();
    expect(within(phaseCard).getByRole('heading', { name: /终局回收/ })).toBeInTheDocument();
    expect(screen.getByText(/分馆索引/)).toBeInTheDocument();
    expect(within(phaseCard).getByText(/列车与第二站/)).toBeInTheDocument();
  });
});
