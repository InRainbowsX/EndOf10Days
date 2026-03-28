import { describe, expect, it } from 'vitest';
import { archiveNodes } from './archiveData';
import { getCharacterHallGroups } from './characterHall';

describe('character hall grouping', () => {
  it('keeps the main board limited to core characters and folds the rest', () => {
    const { mainBoardIds, collapsedIds } = getCharacterHallGroups(archiveNodes);

    expect(mainBoardIds).toContain('qixia');
    expect(mainBoardIds.length).toBeLessThanOrEqual(12);
    expect(collapsedIds.length).toBeGreaterThan(0);
    expect(new Set([...mainBoardIds, ...collapsedIds]).size).toBe(
      archiveNodes.filter((node) => node.type === 'character').length,
    );
  });
});

