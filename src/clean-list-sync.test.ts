import { archiveNodes } from './archiveData';

describe('Clean list sync', () => {
  it('includes the supplemental character set from the consolidated clean list', () => {
    const characterIds = new Set(archiveNodes.filter((node) => node.type === 'character').map((node) => node.id));

    ['lishangling', 'sushan', 'qindingdong', 'qianwu', 'qianduoduo', 'xuanwu', 'zhuque', 'baihu', 'tianniu', 'diji', 'digou', 'dimap'].forEach((id) => {
      expect(characterIds.has(id)).toBe(true);
    });
  });
});
