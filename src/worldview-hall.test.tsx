import { render, screen } from '@testing-library/react';
import App from './App';

describe('Worldview hall', () => {
  it('renders the three worldview layers in order', () => {
    render(<App initialView="世界观馆" />);

    const hall = screen.getByTestId('world-hall');
    const panels = [
      hall.querySelector('#world-rules h3'),
      hall.querySelector('#world-structure h3'),
      hall.querySelector('#world-truth h3'),
    ];

    expect(panels.every(Boolean)).toBe(true);

    const rendered = panels.map((node) => node?.textContent);

    expect(rendered).toEqual(['规则层', '结构层', '真相层']);
  });

  it('renders the macro worldview classification', () => {
    render(<App initialView="世界观馆" />);

    const hall = screen.getByTestId('world-hall');

    expect(hall).toHaveTextContent('世界分类图谱');
    expect(hall).toHaveTextContent('世界壳层');
    expect(hall).toHaveTextContent('管理周期');
    expect(hall).toHaveTextContent('权力分层');
    expect(hall).toHaveTextContent('终局回收');
  });
});
