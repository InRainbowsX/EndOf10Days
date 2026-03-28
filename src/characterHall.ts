import type { ArchiveNode } from './archiveData';

const CORE_CHARACTER_IDS = new Set([
  'qixia',
  'linqin',
  'qiaojiajin',
  'chenjunnan',
  'chutianqiu',
  'wenqiaoyun',
  'yanzhichun',
  'yunyao',
  'baiyang',
  'qinglong',
  'tianlong',
  'xuliunian',
]);

export function getCharacterHallGroups(nodes: ArchiveNode[]) {
  const characters = nodes.filter((node) => node.type === 'character');
  const mainBoardIds = characters
    .filter((node) => CORE_CHARACTER_IDS.has(node.id))
    .map((node) => node.id);
  const collapsedIds = characters
    .filter((node) => !CORE_CHARACTER_IDS.has(node.id))
    .map((node) => node.id);

  return { mainBoardIds, collapsedIds };
}

