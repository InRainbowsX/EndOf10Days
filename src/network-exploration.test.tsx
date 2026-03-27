import { render, screen, within } from '@testing-library/react';
import App from './App';

describe('Phase exploration', () => {
  it('lays out the total hall as a full timeline with all stage cards visible at once', () => {
    render(<App />);
    const stage = screen.getByTestId('stage-card-phase-3');

    expect(within(stage).getByRole('heading', { level: 2, name: /主角团雏形生成/ })).toBeInTheDocument();
    expect(within(stage).getByText(/认知、共谋、执行与串联开始形成更稳定的分工/)).toBeInTheDocument();
    expect(within(stage).getAllByText(/乔家劲/).length).toBeGreaterThan(0);
    expect(within(stage).getByText(/分工稳定化/)).toBeInTheDocument();
    expect(screen.getByTestId('river-axis')).toBeInTheDocument();
  });
});
