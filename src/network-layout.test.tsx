import { render, screen } from '@testing-library/react';
import App from './App';

type Box = { left: number; top: number; right: number; bottom: number };

const NODE_WIDTH = 110;
const NODE_HEIGHT = 176;
const CANVAS_WIDTH = 2400;
const CANVAS_HEIGHT = 1800;

function boxFromStyle(style: CSSStyleDeclaration): Box {
  const left = Number.parseFloat(style.left);
  const top = Number.parseFloat(style.top);
  return {
    left: left - NODE_WIDTH / 2,
    top: top - NODE_HEIGHT / 2,
    right: left + NODE_WIDTH / 2,
    bottom: top + NODE_HEIGHT / 2,
  };
}

function boxesOverlap(left: Box, right: Box) {
  return left.left < right.right && left.right > right.left && left.top < right.bottom && left.bottom > right.top;
}

describe('Character network layout', () => {
  it('keeps the initial character cards mathematically separated', () => {
    render(<App initialView="人物馆" />);

    const hall = screen.getByTestId('character-hall');
    const nodes = Array.from(hall.querySelectorAll('.museum-home__network-node')) as HTMLElement[];
    const boxes = nodes.map((node) => boxFromStyle(window.getComputedStyle(node)));

    for (let left = 0; left < boxes.length; left += 1) {
      for (let right = left + 1; right < boxes.length; right += 1) {
        expect(boxesOverlap(boxes[left], boxes[right])).toBe(false);
      }
    }
  });

  it('keeps every character card fully inside the network canvas', () => {
    render(<App initialView="人物馆" />);

    const hall = screen.getByTestId('character-hall');
    const nodes = Array.from(hall.querySelectorAll('.museum-home__network-node')) as HTMLElement[];
    const boxes = nodes.map((node) => boxFromStyle(window.getComputedStyle(node)));

    boxes.forEach((box) => {
      expect(box.left).toBeGreaterThanOrEqual(0);
      expect(box.top).toBeGreaterThanOrEqual(0);
      expect(box.right).toBeLessThanOrEqual(CANVAS_WIDTH);
      expect(box.bottom).toBeLessThanOrEqual(CANVAS_HEIGHT);
    });
  });
});
