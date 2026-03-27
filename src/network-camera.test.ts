import { describe, expect, it } from 'vitest';
import { getCharacterNetworkCamera } from './components/DoomRiver';

describe('getCharacterNetworkCamera', () => {
  it('centers the occupied character bounds inside the viewport', () => {
    const camera = getCharacterNetworkCamera(
      {
        a: { x: 200, y: 240 },
        b: { x: 760, y: 260 },
        c: { x: 220, y: 760 },
        d: { x: 760, y: 780 },
      },
      { width: 1600, height: 1000 },
    );

    expect(camera.zoom).toBeGreaterThan(0);
    expect(camera.focusPoint.x).toBeCloseTo(480, 0);
    expect(camera.focusPoint.y).toBeCloseTo(510, 0);
    expect(camera.offset.x).toBeCloseTo(161.6, 1);
    expect(camera.offset.y).toBeCloseTo(-95.8, 1);
  });
});
