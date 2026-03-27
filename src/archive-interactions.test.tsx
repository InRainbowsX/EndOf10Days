import { fireEvent, render, screen, within } from '@testing-library/react';
import App from './App';

describe('Archive interactions', () => {
  it('shows complete information for later phases directly in the total-hall overview', () => {
    render(<App />);
    const detail = screen.getByTestId('stage-card-phase-5');

    expect(within(detail).getByRole('heading', { name: /人物线与真相线开始汇流/ })).toBeInTheDocument();
    expect(within(detail).getByText(/齐夏/)).toBeInTheDocument();
    expect(within(detail).getByText(/真相逼近/)).toBeInTheDocument();
    expect(within(detail).getByText(/回响/)).toBeInTheDocument();
  });

  it('renders the character hall with core dossiers directly on the page', () => {
    render(<App initialView="人物馆" />);
    const hall = screen.getByTestId('character-hall');

    expect(within(hall).getByRole('heading', { name: /人物馆/ })).toBeInTheDocument();
    expect(within(hall).getAllByRole('heading', { name: '齐夏' }).length).toBeGreaterThan(0);
    expect(within(hall).getAllByRole('heading', { name: '林檎' }).length).toBeGreaterThan(0);
    expect(within(hall).getAllByText(/回响：生生不息/).length).toBeGreaterThan(0);
  });

  it('shows confirmed echo names for characters with stable public consensus', () => {
    render(<App initialView="人物馆" />);
    const hall = screen.getByTestId('character-hall');

    expect(within(hall).getAllByText(/回响：激发/).length).toBeGreaterThan(0);
    expect(within(hall).getAllByText(/回响：破万法/).length).toBeGreaterThan(0);
    expect(within(hall).getAllByText(/回响：招灾/).length).toBeGreaterThan(0);
  });

  it('navigates across halls when clicking linked archive items', () => {
    render(<App initialView="人物馆" />);

    fireEvent.click(screen.getByRole('button', { name: /打开事件：第一间房试炼/i }));
    expect(screen.getByTestId('event-hall')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /打开世界观节点：终焉之地/i }));
    expect(screen.getByTestId('world-hall')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /打开关系类型：共谋/i }));
    expect(screen.getByTestId('relation-hall')).toBeInTheDocument();
  });
});
