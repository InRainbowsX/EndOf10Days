import { useEffect, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import type { NavigationItem } from '../App';
import { archiveEdges, archiveNodes, characterEchoNames, flowCards, museumHalls, riverStages, timelineEvents } from '../archiveData';
import { getCharacterHallGroups } from '../characterHall';

type DoomRiverProps = {
  activeView: NavigationItem;
  onNavigate: (view: NavigationItem) => void;
};

type Point = { x: number; y: number };
type Box = { left: number; top: number; right: number; bottom: number };
type DragState =
  | { kind: 'pan'; startX: number; startY: number; baseX: number; baseY: number; pointerId: number }
  | {
      kind: 'node';
      id: string;
      startX: number;
      startY: number;
      baseX: number;
      baseY: number;
      pointerId: number;
      snapshot: Record<string, Point>;
    };

const NETWORK_CANVAS = { width: 2400, height: 1800 };
const NETWORK_CARD = { width: 110, height: 176 };
const NETWORK_EDGE_MARGIN = 14;
const NETWORK_SLOT_STEP = { x: 250, y: 280 };
const NETWORK_PIN_OFFSET = NETWORK_CARD.height / 2 + 6;

const rectFromCenter = (point: Point): Box => ({
  left: point.x - NETWORK_CARD.width / 2,
  top: point.y - NETWORK_CARD.height / 2,
  right: point.x + NETWORK_CARD.width / 2,
  bottom: point.y + NETWORK_CARD.height / 2,
});

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const clampPointToCanvas = (point: Point): Point => ({
  x: clamp(point.x, NETWORK_CARD.width / 2, NETWORK_CANVAS.width - NETWORK_CARD.width / 2),
  y: clamp(point.y, NETWORK_CARD.height / 2, NETWORK_CANVAS.height - NETWORK_CARD.height / 2),
});

export const getCharacterNetworkBounds = (positions: Record<string, Point>) => {
  const points = Object.values(positions);
  if (points.length === 0) {
    return null;
  }

  return points.reduce<Box>(
    (acc, point) => {
      const rect = rectFromCenter(point);
      return {
        left: Math.min(acc.left, rect.left),
        top: Math.min(acc.top, rect.top),
        right: Math.max(acc.right, rect.right),
        bottom: Math.max(acc.bottom, rect.bottom),
      };
    },
    {
      left: Number.POSITIVE_INFINITY,
      top: Number.POSITIVE_INFINITY,
      right: Number.NEGATIVE_INFINITY,
      bottom: Number.NEGATIVE_INFINITY,
    },
  );
};

export const getCharacterNetworkCamera = (
  positions: Record<string, Point>,
  viewport: { width: number; height: number },
) => {
  const bounds = getCharacterNetworkBounds(positions);
  if (!bounds) {
    return {
      zoom: 0.6,
      offset: { x: 0, y: 0 },
      focusPoint: { x: NETWORK_CANVAS.width / 2, y: NETWORK_CANVAS.height / 2 },
      bounds: null as Box | null,
    };
  }

  const contentWidth = Math.max(1, bounds.right - bounds.left + NETWORK_EDGE_MARGIN * 2);
  const contentHeight = Math.max(1, bounds.bottom - bounds.top + NETWORK_EDGE_MARGIN * 2);
  const usableWidth = Math.max(0, viewport.width - 64);
  const usableHeight = Math.max(0, viewport.height - 64);
  const zoom = clamp(Math.min(usableWidth / contentWidth, usableHeight / contentHeight), 0.42, 0.78);
  const focusPoint = {
    x: (bounds.left + bounds.right) / 2,
    y: (bounds.top + bounds.bottom) / 2,
  };
  const canvasCenter = { x: NETWORK_CANVAS.width / 2, y: NETWORK_CANVAS.height / 2 };
  const projectedFocus = {
    x: canvasCenter.x + (focusPoint.x - canvasCenter.x) * zoom,
    y: canvasCenter.y + (focusPoint.y - canvasCenter.y) * zoom,
  };

  return {
    zoom,
    offset: {
      x: viewport.width / 2 - projectedFocus.x,
      y: viewport.height / 2 - projectedFocus.y,
    },
    focusPoint,
    bounds,
  };
};

const toPoint = (x: number, y: number): Point => ({ x, y });

export function DoomRiver({ activeView, onNavigate }: DoomRiverProps) {
  const [selectedCharacterId, setSelectedCharacterId] = useState('qixia');
  const [networkZoom, setNetworkZoom] = useState(0.6);
  const [boardOffset, setBoardOffset] = useState({ x: 0, y: 0 });
  const cameraInitializedRef = useRef(false);
  const dragState = useRef<DragState | null>(null);
  const boardRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (activeView !== '人物馆') return;
    const syncCamera = () => {
      if (!boardRef.current) return;
      const bounds = boardRef.current.getBoundingClientRect();
      const camera = getCharacterNetworkCamera(nodePositions, { width: bounds.width, height: bounds.height });
      setNetworkZoom(camera.zoom);
      if (!cameraInitializedRef.current) {
        setBoardOffset(camera.offset);
        cameraInitializedRef.current = true;
      }
    };
    syncCamera();
    const board = boardRef.current;
    if (!board || typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(syncCamera);
    observer.observe(board);
    return () => observer.disconnect();
  }, [activeView]);
  const characterNodes = archiveNodes.filter((node) => node.type === 'character');
  const { mainBoardIds, collapsedIds } = getCharacterHallGroups(archiveNodes);
  const mainCharacterNodes = characterNodes.filter((node) => mainBoardIds.includes(node.id));
  const collapsedCharacterNodes = characterNodes.filter((node) => collapsedIds.includes(node.id));
  const eventNodes = archiveNodes.filter((node) => node.type === 'event');
  const ruleNodes = archiveNodes.filter((node) => node.type === 'rule');
  const factionNodes = archiveNodes.filter((node) => node.type === 'faction');
  const truthNodes = archiveNodes.filter((node) => node.type === 'truth');
  const nodeMap = new Map(archiveNodes.map((node) => [node.id, node]));
  const nodeTitleMap = new Map(archiveNodes.map((node) => [node.id, node.title]));
  const timelineMap = new Map(timelineEvents.map((event) => [event.id, event]));
  const toTitle = (id: string) => nodeTitleMap.get(id) ?? id;
  const toEchoName = (id: string) => characterEchoNames[id] ?? '待核';
  const unique = <T,>(values: T[]) => Array.from(new Set(values));
  const relationTypes = unique(archiveEdges.map((edge) => edge.label)).slice(0, 12);
  const featuredCharacter = characterNodes.find((node) => node.id === 'qixia') ?? characterNodes[0];
  const supportingCharacters = characterNodes.filter((node) => node.id !== featuredCharacter.id);
  const featuredCharacters = [featuredCharacter, ...supportingCharacters].slice(0, 10);
  const featuredEvent = eventNodes.find((node) => node.id === 'first-room') ?? eventNodes[0];
  const featuredEvents = featuredCharacter.timeline
    .map((eventId) => timelineMap.get(eventId))
    .filter((event): event is NonNullable<typeof event> => Boolean(event));
  const featuredRelations = archiveEdges
    .filter((edge) => edge.source === featuredCharacter.id || edge.target === featuredCharacter.id)
    .map((edge) => {
      const counterpart = edge.source === featuredCharacter.id ? edge.target : edge.source;
      const counterpartNode = nodeMap.get(counterpart);
      return {
        id: `${edge.source}-${edge.target}`,
        label: edge.label,
        title: toTitle(counterpart),
        summary: counterpartNode?.summary ?? '',
      };
    })
    .slice(0, 6);
  const featuredEventParticipants = archiveEdges
    .filter((edge) => edge.target === featuredEvent.id || edge.source === featuredEvent.id)
    .map((edge) => {
      const otherId = edge.source === featuredEvent.id ? edge.target : edge.source;
      return archiveNodes.find((node) => node.id === otherId && node.type === 'character');
    })
    .filter((node): node is NonNullable<typeof node> => Boolean(node));
  const featuredRelationEdge =
    archiveEdges.find((edge) => edge.source === 'qixia' && edge.target === 'linqin') ?? archiveEdges[0];
  const featuredRelation = {
    id: `${featuredRelationEdge.source}-${featuredRelationEdge.target}`,
    label: featuredRelationEdge.label,
    left: toTitle(featuredRelationEdge.source),
    right: toTitle(featuredRelationEdge.target),
  };
  const characterProfiles = featuredCharacters.map((character) => {
    const timeline = character.timeline
      .map((eventId) => timelineMap.get(eventId))
      .filter((event): event is NonNullable<typeof event> => Boolean(event));
    const linkedEdges = archiveEdges.filter((edge) => edge.source === character.id || edge.target === character.id);
    const linkedCharacters = unique(
      linkedEdges
        .map((edge) => (edge.source === character.id ? edge.target : edge.source))
        .filter((id) => nodeMap.get(id)?.type === 'character')
        .map((id) => toTitle(id)),
    );
    const linkedEvents = unique(
      linkedEdges
        .map((edge) => (edge.source === character.id ? edge.target : edge.source))
        .filter((id) => nodeMap.get(id)?.type === 'event')
        .map((id) => toTitle(id)),
    );

    return { character, timeline, linkedCharacters, linkedEvents, linkedEdges };
  });
  const characterLookup = new Map(characterNodes.map((character) => [character.id, character]));
  const selectedCharacter = characterLookup.get(selectedCharacterId) ?? featuredCharacter;
  const characterCharacterEdges = archiveEdges.filter(
    (edge) => nodeMap.get(edge.source)?.type === 'character' && nodeMap.get(edge.target)?.type === 'character',
  );
  const characterHeatMap = new Map(
    characterNodes.map((character) => {
      const relatedEdges = characterCharacterEdges.filter(
        (edge) => edge.source === character.id || edge.target === character.id,
      );
      const linkedCount = new Set(
        relatedEdges.map((edge) => (edge.source === character.id ? edge.target : edge.source)),
      ).size;
      const weightedHeat = relatedEdges.reduce((sum, edge) => {
        if (edge.label === '共谋' || edge.label === '高位对照' || edge.label === '王与军师' || edge.label === '短暂咬合') {
          return sum + 2;
        }
        return sum + 1;
      }, 0);
      return [character.id, linkedCount * 10 + weightedHeat] as const;
    }),
  );
  const characterRatings = new Map(
    characterNodes.map((character) => {
      const text = `${character.title} ${character.subtitle} ${character.summary} ${character.tags.join(' ')}`;
      let intelligence = 3;
      let battle = 3;
      let support = 3;

      if (/规则|认知|军师|信息|因果|布局|见证|推演/.test(text)) intelligence += 2;
      else if (/连接|串联|组织|管理/.test(text)) intelligence += 1;

      if (/战斗|锋刃|执行|硬解|猎杀|压制|反抗|搏/.test(text)) battle += 2;
      else if (/领袖|王|主控|对抗/.test(text)) battle += 1;

      if (/串联|缓冲|保护|连接|信息链|传音|共创|托底|补位|支柱/.test(text)) support += 2;
      else if (/共谋|共创|协作|默契/.test(text)) support += 1;

      if (character.id === 'qixia') {
        intelligence = 5;
        battle = 4;
        support = 4;
      }

      return [
        character.id,
        {
          intelligence: Math.min(5, intelligence),
          battle: Math.min(5, battle),
          support: Math.min(5, support),
        },
      ] as const;
    }),
  );
  const sortedByHeat = (ids: string[]) =>
    ids
      .map((id) => characterLookup.get(id))
      .filter((item): item is NonNullable<typeof item> => Boolean(item))
      .sort((left, right) => {
        const diff = (characterHeatMap.get(right.id) ?? 0) - (characterHeatMap.get(left.id) ?? 0);
        return diff !== 0 ? diff : left.title.localeCompare(right.title, 'zh-Hans-CN');
      })
      .map((item) => item.id);

  const groupMap: Record<string, string[]> = {
    heroes: ['qixia', 'linqin', 'qiaojiajin', 'chenjunnan', 'tiantian', 'hanyimo', 'yunianan', 'lishangwu', 'xiaoran', 'jinyuanxun', 'xuliunian'],
    paradise: ['chutianqiu', 'wenqiaoyun', 'yunyao', 'zhangshan'],
    jidao: ['yanzhichun', 'jiangruoxue', 'zhoumo', 'luxiaoxiao', 'tongchan', 'guyu', 'shuhua'],
    upper: ['qinglong', 'tianlong', 'baiyang', 'xuanwu', 'zhuque', 'baihu', 'tianniu', 'renshe', 'dishe', 'renzhu'],
    supplement: ['lishangling', 'sushan', 'qindingdong', 'qianwu', 'qianduoduo', 'renyang', 'diji', 'digou', 'dimap'],
  };
  const groupSlots: Record<string, Point[]> = {
    heroes: [
      toPoint(170, 180),
      toPoint(380, 180),
      toPoint(590, 180),
      toPoint(170, 460),
      toPoint(380, 460),
      toPoint(590, 460),
      toPoint(170, 740),
      toPoint(380, 740),
      toPoint(590, 740),
      toPoint(780, 1000),
      toPoint(780, 1280),
    ],
    paradise: [
      toPoint(1480, 180),
      toPoint(1690, 180),
      toPoint(1900, 180),
      toPoint(1480, 460),
      toPoint(1690, 460),
      toPoint(1900, 460),
    ],
    jidao: [
      toPoint(170, 1100),
      toPoint(380, 1100),
      toPoint(590, 1100),
      toPoint(170, 1380),
      toPoint(380, 1380),
      toPoint(590, 1380),
      toPoint(380, 1620),
    ],
    upper: [
      toPoint(1480, 1100),
      toPoint(1690, 1100),
      toPoint(1900, 1100),
      toPoint(1480, 1380),
      toPoint(1690, 1380),
      toPoint(1900, 1380),
      toPoint(1480, 1660),
      toPoint(1690, 1660),
      toPoint(1900, 1660),
      toPoint(2200, 1380),
    ],
    supplement: [
      toPoint(2070, 180),
      toPoint(2200, 180),
      toPoint(2330, 180),
      toPoint(2070, 460),
      toPoint(2200, 460),
      toPoint(2330, 460),
      toPoint(2070, 740),
      toPoint(2200, 740),
      toPoint(2330, 740),
    ],
  };

  const buildInitialNodePositions = () => {
    const positions = new Map<string, Point>();
    positions.set('qixia', clampPointToCanvas(toPoint(1200, 860)));

    const assignGroup = (groupId: keyof typeof groupMap) => {
      const orderedIds = sortedByHeat(groupMap[groupId].filter((id) => id !== 'qixia'));
      orderedIds.forEach((id, index) => {
        const slot = groupSlots[groupId][index];
        if (slot) positions.set(id, clampPointToCanvas(slot));
      });
    };

    assignGroup('heroes');
    assignGroup('paradise');
    assignGroup('jidao');
    assignGroup('upper');
    assignGroup('supplement');

    characterNodes.forEach((character, index) => {
      if (positions.has(character.id)) return;
      const x = 930 + (index % 3) * (NETWORK_SLOT_STEP.x + 36);
      const y = 930 + Math.floor(index / 3) * (NETWORK_SLOT_STEP.y + 40);
      positions.set(character.id, clampPointToCanvas(toPoint(x, y)));
    });

    return Object.fromEntries(positions);
  };

  const [nodePositions, setNodePositions] = useState<Record<string, Point>>(() => buildInitialNodePositions());

  const characterNetworkNodes = mainCharacterNodes.map((character) => {
    const position = nodePositions[character.id] ?? toPoint(120, 120);
    return {
      character,
      x: position.x,
      y: position.y,
      heat: characterHeatMap.get(character.id) ?? 0,
    };
  });
  const networkEdgePaths = characterCharacterEdges
    .map((edge) => {
      const sourcePosition = nodePositions[edge.source];
      const targetPosition = nodePositions[edge.target];
      if (!sourcePosition || !targetPosition) return null;

      const sourcePin = toPoint(sourcePosition.x, sourcePosition.y - NETWORK_PIN_OFFSET);
      const targetPin = toPoint(targetPosition.x, targetPosition.y - NETWORK_PIN_OFFSET);
      const dx = targetPosition.x - sourcePosition.x;
      const dy = targetPosition.y - sourcePosition.y;
      const midX = (sourcePin.x + targetPin.x) / 2;
      const midY = (sourcePin.y + targetPin.y) / 2;

      return {
        id: `${edge.source}-${edge.target}`,
        label: edge.label,
        d: `M ${sourcePin.x} ${sourcePin.y} L ${targetPin.x} ${targetPin.y}`,
        strength: edge.label === '共谋' || edge.label === '王与军师' || edge.label === '高位对照' ? 'strong' : 'medium',
        source: edge.source,
        target: edge.target,
        midX: midX,
        midY: midY,
        dx,
        dy,
      };
    })
    .filter((edge): edge is NonNullable<typeof edge> => Boolean(edge));
  const buildCatalogCharacter = (id: string, fallbackTitle: string) => {
    const character = characterLookup.get(id);
    return {
      id,
      title: character?.title ?? fallbackTitle,
      echo: character ? toEchoName(character.id) : '待核',
      summary: character?.summary ?? '资料已进入总册，正文档案待继续补充。',
      isReady: Boolean(character),
    };
  };
  const characterCatalogSections = [
    {
      id: 'heroes',
      title: '主角团',
      subtitle: 'Core Ensemble',
      description: '先从主角团进入，能最快看清终焉里最核心的人物推动力、心理变化和关系骨架。',
      entries: [
        buildCatalogCharacter('qixia', '齐夏'),
        buildCatalogCharacter('linqin', '林檎'),
        buildCatalogCharacter('qiaojiajin', '乔家劲'),
        buildCatalogCharacter('chenjunnan', '陈俊南'),
        buildCatalogCharacter('tiantian', '甜甜'),
        buildCatalogCharacter('hanyimo', '韩一墨'),
        buildCatalogCharacter('yunianan', '余念安'),
        buildCatalogCharacter('lishangwu', '李尚武'),
        buildCatalogCharacter('xiaoran', '萧冉'),
      ],
    },
    {
      id: 'paradise',
      title: '天堂口',
      subtitle: 'Paradise Mouth',
      description: '这一层看另一种生存秩序如何被建立，也看它如何在保护、利用和失控之间摆动。',
      entries: [
        buildCatalogCharacter('chutianqiu', '楚天秋'),
        buildCatalogCharacter('wenqiaoyun', '文巧云'),
        buildCatalogCharacter('yunyao', '云瑶'),
        buildCatalogCharacter('zhangshan', '张山'),
        buildCatalogCharacter('jinyuanxun', '金元勋'),
      ],
    },
    {
      id: 'jidao',
      title: '极道',
      subtitle: 'Ji Dao',
      description: '极道不是一个名字，而是一整组被共同信念和策略推着往前走的群像结构。',
      entries: [
        buildCatalogCharacter('yanzhichun', '燕知春'),
        buildCatalogCharacter('jiangruoxue', '江若雪'),
        buildCatalogCharacter('zhoumo', '周末'),
        buildCatalogCharacter('luxiaoxiao', '陆潇潇'),
        buildCatalogCharacter('tongchan', '童婵'),
        buildCatalogCharacter('guyu', '顾禹'),
        buildCatalogCharacter('shuhua', '舒画'),
      ],
    },
    {
      id: 'upper-order',
      title: '高位秩序 / 生肖人物',
      subtitle: 'Upper Order / Zodiac',
      description: '这一层不是普通配角，他们决定了很多规则边界、很多游戏强度和很多人的命运。',
      entries: [
        buildCatalogCharacter('baiyang', '白羊'),
        buildCatalogCharacter('qinglong', '青龙'),
        buildCatalogCharacter('tianlong', '天龙'),
        buildCatalogCharacter('xuliunian', '许流年'),
        buildCatalogCharacter('renyang', '人羊'),
        buildCatalogCharacter('renshe', '人蛇'),
        buildCatalogCharacter('dishe', '地蛇'),
        buildCatalogCharacter('renzhu', '人猪'),
      ],
    },
  ];
  const characterHallJumpTargets: Record<string, NavigationItem> = {
    heroes: '人物馆',
    paradise: '关系馆',
    jidao: '关系馆',
    'upper-order': '世界观馆',
  };
  const eventProfiles = eventNodes.map((event) => {
    const linkedEdges = archiveEdges.filter((edge) => edge.source === event.id || edge.target === event.id);
    const participants = unique(
      linkedEdges
        .map((edge) => (edge.source === event.id ? edge.target : edge.source))
        .filter((id) => nodeMap.get(id)?.type === 'character')
        .map((id) => toTitle(id)),
    );
    const linkedRules = unique(
      linkedEdges
        .map((edge) => (edge.source === event.id ? edge.target : edge.source))
        .filter((id) => nodeMap.get(id)?.type === 'rule')
        .map((id) => toTitle(id)),
    );
    const linkedTruths = unique(
      linkedEdges
        .map((edge) => (edge.source === event.id ? edge.target : edge.source))
        .filter((id) => ['truth', 'faction'].includes(nodeMap.get(id)?.type ?? ''))
        .map((id) => toTitle(id)),
    );
    const stageTrail = event.timeline
      .map((eventId) => timelineMap.get(eventId))
      .filter((item): item is NonNullable<typeof item> => Boolean(item));

    return { event, participants, linkedRules, linkedTruths, stageTrail };
  });
  const timelineOrder = new Map(timelineEvents.map((event, index) => [event.id, index]));
  const eventChronologySections = timelineEvents.map((timelineEvent) => {
    const events = eventProfiles
      .filter(({ stageTrail }) => {
        const phaseIndexes = stageTrail
          .map((item) => timelineOrder.get(item.id))
          .filter((index): index is number => typeof index === 'number');
        const primaryPhaseIndex = phaseIndexes.length ? Math.min(...phaseIndexes) : null;
        return primaryPhaseIndex === timelineOrder.get(timelineEvent.id);
      })
      .sort((left, right) => {
        const leftIndex = left.event.timeline
          .map((id) => timelineOrder.get(id))
          .filter((index): index is number => typeof index === 'number');
        const rightIndex = right.event.timeline
          .map((id) => timelineOrder.get(id))
          .filter((index): index is number => typeof index === 'number');
        return (leftIndex[0] ?? Number.POSITIVE_INFINITY) - (rightIndex[0] ?? Number.POSITIVE_INFINITY);
      });

    const rules = ruleNodes.filter((node) => node.timeline.includes(timelineEvent.id));
    const truths = truthNodes.filter((node) => node.timeline.includes(timelineEvent.id));
    const factions = factionNodes.filter((node) => node.timeline.includes(timelineEvent.id));

    return {
      ...timelineEvent,
      events,
      rules,
      truths,
      factions,
    };
  });
  const worldviewConnections = archiveEdges
    .filter((edge) => {
      const sourceType = nodeMap.get(edge.source)?.type;
      const targetType = nodeMap.get(edge.target)?.type;
      return (
        ['rule', 'truth', 'faction'].includes(sourceType ?? '') ||
        ['rule', 'truth', 'faction'].includes(targetType ?? '')
      );
    })
    .slice(0, 10)
    .map((edge) => ({
      id: `${edge.source}-${edge.target}`,
      label: edge.label,
      source: toTitle(edge.source),
      target: toTitle(edge.target),
      sourceType: nodeMap.get(edge.source)?.type ?? 'unknown',
      targetType: nodeMap.get(edge.target)?.type ?? 'unknown',
    }));
  const relationGroups = relationTypes.map((type) => {
    const edges = archiveEdges.filter((edge) => edge.label === type);
    return {
      type,
      edges,
      samples: edges.slice(0, 3).map((edge) => ({
        id: `${edge.source}-${edge.target}`,
        title: `${toTitle(edge.source)} × ${toTitle(edge.target)}`,
      })),
    };
  });

  const isHomeView = activeView === '总馆';
  const renderStars = (value: number) => (
    <span className="museum-home__stars" aria-label={`${value}星`}>
      {Array.from({ length: 5 }, (_, index) => (
        <span key={index} className={index < value ? 'is-filled' : ''}>
          ★
        </span>
      ))}
    </span>
  );
  const resolveAxisMove = (
    movingId: string,
    snapshot: Record<string, Point>,
    currentCenter: Point,
    deltaX: number,
    deltaY: number,
  ) => {
    const minCenterX = NETWORK_CARD.width / 2 + NETWORK_EDGE_MARGIN;
    const maxCenterX = NETWORK_CANVAS.width - NETWORK_CARD.width / 2 - NETWORK_EDGE_MARGIN;
    const minCenterY = NETWORK_CARD.height / 2 + NETWORK_EDGE_MARGIN;
    const maxCenterY = NETWORK_CANVAS.height - NETWORK_CARD.height / 2 - NETWORK_EDGE_MARGIN;
    const currentRect = rectFromCenter(currentCenter);
    const boundsX = clamp(currentCenter.x + deltaX, minCenterX, maxCenterX) - currentCenter.x;
    const boundsY = clamp(currentCenter.y + deltaY, minCenterY, maxCenterY) - currentCenter.y;

    let allowedX = boundsX;
    Object.entries(snapshot).forEach(([id, point]) => {
      if (id === movingId) return;
      const otherRect = rectFromCenter(point);
      const overlapY = currentRect.top < otherRect.bottom && currentRect.bottom > otherRect.top;
      if (!overlapY) return;
      if (allowedX > 0 && currentRect.right <= otherRect.left) {
        allowedX = Math.min(allowedX, otherRect.left - currentRect.right);
      } else if (allowedX < 0 && currentRect.left >= otherRect.right) {
        allowedX = Math.max(allowedX, otherRect.right - currentRect.left);
      }
    });

    const xCenter = currentCenter.x + allowedX;
    const xRect = rectFromCenter(toPoint(xCenter, currentCenter.y));
    let allowedY = boundsY;
    Object.entries(snapshot).forEach(([id, point]) => {
      if (id === movingId) return;
      const otherRect = rectFromCenter(point);
      const overlapX = xRect.left < otherRect.right && xRect.right > otherRect.left;
      if (!overlapX) return;
      if (allowedY > 0 && xRect.bottom <= otherRect.top) {
        allowedY = Math.min(allowedY, otherRect.top - xRect.bottom);
      } else if (allowedY < 0 && xRect.top >= otherRect.bottom) {
        allowedY = Math.max(allowedY, otherRect.bottom - xRect.top);
      }
    });

    return clampPointToCanvas(toPoint(currentCenter.x + allowedX, currentCenter.y + allowedY));
  };

  const handleBoardPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const activeDrag = dragState.current;
    if (!activeDrag) return;
    const zoom = networkZoom || 1;
    if (activeDrag.kind === 'pan') {
      const deltaX = (event.clientX - activeDrag.startX) / zoom;
      const deltaY = (event.clientY - activeDrag.startY) / zoom;
      setBoardOffset({
        x: activeDrag.baseX + deltaX,
        y: activeDrag.baseY + deltaY,
      });
      return;
    }

    const deltaX = (event.clientX - activeDrag.startX) / zoom;
    const deltaY = (event.clientY - activeDrag.startY) / zoom;
    const nextPosition = resolveAxisMove(
      activeDrag.id,
      activeDrag.snapshot,
      toPoint(activeDrag.baseX, activeDrag.baseY),
      deltaX,
      deltaY,
    );
    setNodePositions((current) => ({
      ...current,
      [activeDrag.id]: nextPosition,
    }));
  };

  const startBoardPan = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget || !boardRef.current) return;
    dragState.current = {
      kind: 'pan',
      startX: event.clientX,
      startY: event.clientY,
      baseX: boardOffset.x,
      baseY: boardOffset.y,
      pointerId: event.pointerId,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const startNodeDrag = (characterId: string, event: ReactPointerEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    event.currentTarget.setPointerCapture(event.pointerId);
    dragState.current = {
      kind: 'node',
      id: characterId,
      startX: event.clientX,
      startY: event.clientY,
      baseX: nodePositions[characterId]?.x ?? 0,
      baseY: nodePositions[characterId]?.y ?? 0,
      pointerId: event.pointerId,
      snapshot: nodePositions,
    };
    setSelectedCharacterId(characterId);
  };

  const endInteraction = () => {
    dragState.current = null;
  };

  const resetCharacterNetworkCamera = () => {
    if (!boardRef.current) return;
    const bounds = boardRef.current.getBoundingClientRect();
    const camera = getCharacterNetworkCamera(nodePositions, { width: bounds.width, height: bounds.height });
    setNetworkZoom(camera.zoom);
    setBoardOffset(camera.offset);
    cameraInitializedRef.current = true;
  };

  return (
    <div className="museum-home">
      {isHomeView ? (
        <>
          <section className="museum-home__hero" id="总馆">
            <div className="museum-home__intro">
              <div className="museum-home__marginalia" data-testid="hero-marginalia" aria-hidden="true">
                <span>“轮回亦是囚牢”</span>
                <span>“先看阶段，再追人物”</span>
              </div>
              <p className="museum-home__eyebrow">ARCHIVE OF THE END</p>
              <p className="museum-home__hero-echo">我听到了“生生不息”的回响</p>
              <h2>从终焉之前到终局</h2>
              <p className="museum-home__lede">
                这里不再折叠内容。整条终焉脉络会一次性铺开，用户可以沿着中轴时间线直接看见每一段阶段、事件、人物与结果。
              </p>
              <dl className="museum-home__meta">
                <div>
                  <dt>展示方式</dt>
                  <dd>全展开总览</dd>
                </div>
                <div>
                  <dt>阶段数量</dt>
                  <dd>{riverStages.length} 段</dd>
                </div>
                <div>
                  <dt>浏览方式</dt>
                  <dd>沿中轴阅读</dd>
                </div>
              </dl>
            </div>
          </section>

          <section className="museum-home__river" aria-labelledby="museum-river-heading">
            <div className="museum-home__section-heading">
              <p className="eyebrow">TOTAL HALL</p>
              <h2 id="museum-river-heading">终焉主脉络长河</h2>
            </div>

            <section className="museum-home__rail museum-home__rail--expanded" data-testid="river-stage-rail" aria-label="终焉阶段河道">
              <div className="museum-home__axis" data-testid="river-axis" aria-hidden="true">
                <span className="museum-home__axis-line" />
                <span className="museum-home__axis-label">TIME AXIS</span>
              </div>

              <div className="museum-home__stages">
                {riverStages.map((stage, index) => {
                  const isLeft = index % 2 === 0;

                  return (
                    <article
                      key={stage.id}
                      className={`museum-home__stage-item ${isLeft ? 'is-left' : 'is-right'}`}
                      data-testid={`stage-card-${stage.id}`}
                      data-variant="uniform"
                    >
                      <div className="museum-home__stage-dot" aria-hidden="true" />
                      <div className="museum-home__stage-card museum-home__stage-card--uniform">
                        <p className="museum-home__dossier-range">{stage.rangeLabel}</p>
                        <h2>{stage.title}</h2>
                        <p className="museum-home__dossier-kicker">{stage.kicker}</p>
                        <p className="museum-home__dossier-result">{stage.stageResult}</p>
                        <div className="museum-home__stage-tags">
                          {stage.keywords.map((keyword) => (
                            <span key={keyword}>{keyword}</span>
                          ))}
                        </div>

                        <div className="museum-home__stage-panels">
                          <article className="museum-home__card">
                            <p className="museum-home__card-label">核心人物</p>
                            <ul>
                              {stage.coreCharacters.map((character) => (
                                <li key={character}>{character}</li>
                              ))}
                            </ul>
                          </article>

                          <article className="museum-home__card">
                            <p className="museum-home__card-label">核心事件</p>
                            <ul>
                              {stage.coreEvents.map((event) => (
                                <li key={event}>{event}</li>
                              ))}
                            </ul>
                          </article>

                          <article className="museum-home__card">
                            <p className="museum-home__card-label">推动机制</p>
                            <ul>
                              {stage.coreMechanics.map((mechanic) => (
                                <li key={mechanic}>{mechanic}</li>
                              ))}
                            </ul>
                          </article>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          </section>

          <section className="museum-home__branches" aria-labelledby="museum-branch-heading">
            <div className="museum-home__section-heading">
              <p className="eyebrow">BRANCH HALLS</p>
              <h2 id="museum-branch-heading">分馆索引</h2>
            </div>

            <div className="museum-home__branch-grid">
              {museumHalls.map((hall) => (
                <a
                  key={hall.id}
                  href={`#${hall.title}`}
                  className={`museum-home__branch-card museum-home__branch-card--${hall.accent}`}
                  role="link"
                  aria-label={hall.title}
                >
                  <span className="museum-home__branch-icon" aria-hidden="true" />
                  <p className="museum-home__branch-title">{hall.title}</p>
                  <p className="museum-home__branch-label">{hall.label}</p>
                  <p className="museum-home__branch-subtitle">{hall.subtitle}</p>
                  <p className="museum-home__branch-description">{hall.description}</p>
                </a>
              ))}
            </div>
          </section>
        </>
      ) : null}

      {activeView === '人物馆' ? (
        <section
          className="museum-home__character-hall is-focused"
          id="人物馆"
          aria-labelledby="museum-character-heading"
          data-testid="character-hall"
        >
            <div className="museum-home__section-heading">
              <p className="eyebrow">ARCHIVE: PERSONAE</p>
              <h2 id="museum-character-heading">人物馆</h2>
            </div>

            <section className="museum-home__person-wall" aria-labelledby="person-wall-heading">
              <div className="museum-home__section-heading museum-home__section-heading--compact">
                <p className="eyebrow">REF: CATALOGUE / PERSONAE</p>
                <h3 id="person-wall-heading">人物索引墙</h3>
              </div>

              <div className="museum-home__catalogue-stack" aria-label="分层人物索引">
                {characterCatalogSections.map((section) => (
                  <article key={section.id} className="museum-home__catalogue-group">
                    <div className="museum-home__catalogue-group-head">
                      <div>
                        <p className="museum-home__branch-label">{section.subtitle}</p>
                        <h4>{section.title}</h4>
                      </div>
                      <button
                        type="button"
                        className="museum-home__catalogue-count"
                        onClick={() => onNavigate(characterHallJumpTargets[section.id] ?? '人物馆')}
                        aria-label={`进入${section.title}`}
                      >
                        进入
                      </button>
                    </div>
                    <p className="museum-home__catalogue-copy">{section.description}</p>
                    <div className="museum-home__catalogue-tags">
                      {section.entries.map((entry) => (
                        <button
                          type="button"
                          key={entry.id}
                          className={`museum-home__catalogue-chip ${entry.isReady ? 'is-ready' : 'is-pending'}`}
                          aria-label={`${entry.title}，回响${entry.echo}`}
                          onClick={() => onNavigate(section.id === 'upper-order' ? '世界观馆' : section.id === 'paradise' ? '关系馆' : section.id === 'jidao' ? '关系馆' : '人物馆')}
                        >
                          <strong>{entry.title}</strong>
                          <span>回响：{entry.echo}</span>
                        </button>
                      ))}
                    </div>
                  </article>
                ))}
              </div>

              <div className="museum-home__character-network-shell">
                <div className="museum-home__network-corner-toolbar">
                  <button type="button" className="museum-home__jump-button" onClick={() => setNetworkZoom((value) => Math.max(0.65, +(value - 0.08).toFixed(2)))}>
                    缩小
                  </button>
                  <button type="button" className="museum-home__jump-button" onClick={() => {
                    if (!boardRef.current) return;
                    const bounds = boardRef.current.getBoundingClientRect();
                    const camera = getCharacterNetworkCamera(nodePositions, { width: bounds.width, height: bounds.height });
                    setNetworkZoom((value) => Math.min(camera.zoom, +(value + 0.08).toFixed(2)));
                  }}>
                    放大
                  </button>
                  <button type="button" className="museum-home__jump-button" onClick={resetCharacterNetworkCamera}>
                    重置
                  </button>
                </div>

                <div
                  className="museum-home__character-network-board"
                  aria-label="人物关系网络"
                  ref={boardRef}
                  onPointerMove={handleBoardPointerMove}
                  onPointerDown={startBoardPan}
                  onPointerUp={endInteraction}
                  onPointerCancel={endInteraction}
                  onPointerLeave={endInteraction}
                >
                  <div
                    className="museum-home__character-network-zoom"
                    style={{
                      width: `${NETWORK_CANVAS.width}px`,
                      height: `${NETWORK_CANVAS.height}px`,
                      transform: `translate(${boardOffset.x}px, ${boardOffset.y}px) scale(${networkZoom})`,
                    }}
                  >
                    <div className="museum-home__character-network-axis" aria-hidden="true">
                      <span className="museum-home__character-network-axis-line" />
                      <span className="museum-home__character-network-axis-line museum-home__character-network-axis-line--secondary" />
                    </div>

                    <svg
                      className="museum-home__character-network-links"
                      viewBox={`0 0 ${NETWORK_CANVAS.width} ${NETWORK_CANVAS.height}`}
                      aria-hidden="true"
                      preserveAspectRatio="none"
                    >
                      {networkEdgePaths.map((relation) => (
                        <path
                          key={relation.id}
                          className={`museum-home__character-network-link ${relation.strength === 'strong' ? 'is-strong' : ''}`}
                          d={relation.d}
                        />
                      ))}
                      {networkEdgePaths.map((relation) => {
                        const directionX = relation.dx >= 0 ? 1 : -1;
                        const directionY = relation.dy >= 0 ? 1 : -1;
                        const labelX = relation.midX + directionX * 36;
                        const labelY = relation.midY + directionY * 22;
                        const labelWidth = Math.max(72, Math.min(132, relation.label.length * 20));
                        const labelHeight = 28;
                        return (
                          <g key={`${relation.id}-label`} transform={`rotate(${relation.dy >= 0 ? 1.6 : -1.6} ${labelX} ${labelY})`}>
                            <rect
                              className="museum-home__relation-tag-bg"
                              x={labelX - labelWidth / 2}
                              y={labelY - labelHeight / 2}
                              width={labelWidth}
                              height={labelHeight}
                              rx="0.18"
                            />
                            <text className="museum-home__relation-tag" x={labelX} y={labelY + 5} textAnchor="middle">
                              {relation.label}
                            </text>
                          </g>
                        );
                      })}
                    </svg>

                    <div className="museum-home__character-network-nodes">
                      {characterNetworkNodes.map(({ character, x, y }) => {
                        const isActive = character.id === selectedCharacter.id;
                        return (
                          <button
                            key={character.id}
                            type="button"
                            className={`museum-home__network-node ${isActive ? 'is-active' : ''}`}
                            style={{ left: `${x}px`, top: `${y}px` }}
                            onPointerDown={(event) => startNodeDrag(character.id, event)}
                            onClick={() => setSelectedCharacterId(character.id)}
                            aria-label={`查看${character.title}`}
                          >
                            <span className="museum-home__network-node-pin" aria-hidden="true" />
                            <span className="museum-home__network-node-image" aria-hidden="true">
                              <span>图片位</span>
                              <small>待补图片</small>
                            </span>
                            <strong>{character.title}</strong>
                            <span className="museum-home__network-node-stats" aria-label={`${character.title}能力值`}>
                              <span>
                                <em>智</em>
                                {renderStars(characterRatings.get(character.id)?.intelligence ?? 3)}
                              </span>
                              <span>
                                <em>战</em>
                                {renderStars(characterRatings.get(character.id)?.battle ?? 3)}
                              </span>
                              <span>
                                <em>辅</em>
                                {renderStars(characterRatings.get(character.id)?.support ?? 3)}
                              </span>
                            </span>
                            <em>回响：{toEchoName(character.id)}</em>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

              </div>
            </section>

            <section className="museum-home__tab-grid museum-home__tab-grid--characters" aria-label="人物摘要卡">
              {characterProfiles.slice(0, 6).map(({ character, linkedCharacters, linkedEvents }) => (
                <article key={character.id} className="museum-home__tab-card">
                  <p className="museum-home__dossier-range">回响：{toEchoName(character.id)}</p>
                  <h3>{character.title}</h3>
                  <p className="museum-home__character-summary">{character.summary}</p>
                  <div className="museum-home__character-sections">
                    <div className="museum-home__character-section">
                      <p className="museum-home__card-label">关键关系</p>
                      <p>{linkedCharacters.slice(0, 3).join(' / ') || '待补'}</p>
                    </div>
                    <div className="museum-home__character-section">
                      <p className="museum-home__card-label">关键事件</p>
                      <p>{linkedEvents.slice(0, 3).join(' / ') || '待补'}</p>
                    </div>
                  </div>
                </article>
              ))}
            </section>

            <section className="museum-home__character-dossier" aria-labelledby="featured-character-heading">
              <div className="museum-home__character-header">
                <div className="museum-home__character-header-copy">
                  <div className="museum-home__character-badges">
                    <span>SPECIMEN NO. 001</span>
                    <span>Priority: Alpha</span>
                  </div>
                  <h3 id="featured-character-heading">{featuredCharacter.title}</h3>
                  <p className="museum-home__character-quote">“这里的规则不是用来遵守的，而是用来破坏的。”</p>
                </div>

                <aside className="museum-home__character-polaroid" aria-label={`${featuredCharacter.title} 档案照片`}>
                  <div className="museum-home__character-polaroid-frame">
                    <div className="museum-home__person-portrait museum-home__person-portrait--featured" aria-hidden="true">
                      <span>{featuredCharacter.title}</span>
                    </div>
                  </div>
                  <p>Archival Proof: 24-01-X</p>
                </aside>
              </div>

              <div className="museum-home__character-columns">
                <div className="museum-home__character-left">
                  <article className="museum-home__character-pinned">
                    <h4>人物定位</h4>
                    <ul>
                      <li>回响名称：{toEchoName(featuredCharacter.id)}</li>
                      {featuredCharacter.tags.map((tag) => (
                        <li key={tag}>{tag}</li>
                      ))}
                    </ul>
                  </article>

                  <article className="museum-home__character-artifacts">
                    <p className="museum-home__branch-label">Artifact Specimens</p>
                    <div className="museum-home__artifact-list">
                      {supportingCharacters.slice(0, 3).map((character) => (
                        <div key={character.id} className="museum-home__artifact-item">
                          <div className="museum-home__artifact-mark" aria-hidden="true">
                            <span>{character.title.slice(0, 1)}</span>
                          </div>
                          <div>
                            <h4>{character.title}</h4>
                            <p>回响：{toEchoName(character.id)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </article>
                </div>

                <div className="museum-home__character-right">
                  <article className="museum-home__character-timeline">
                    <h4>关键事件轨迹</h4>
                    <div className="museum-home__timeline-list">
                      {featuredEvents.map((event) => (
                        <div key={event.id} className="museum-home__timeline-item">
                          <p className="museum-home__branch-label">{event.phase}</p>
                          <h5>{event.label}</h5>
                          <p>{event.detail}</p>
                        </div>
                      ))}
                    </div>
                  </article>

                  <article className="museum-home__character-relations">
                    <h4>关键关系网</h4>
                    <div className="museum-home__relation-strip">
                      <div className="museum-home__relation-center">{featuredCharacter.title}</div>
                      {featuredRelations.map((relation) => (
                        <div key={relation.id} className="museum-home__relation-node">
                          <span>{relation.label}</span>
                          <strong>{relation.title}</strong>
                          {relation.summary ? <p>{relation.summary}</p> : null}
                        </div>
                      ))}
                    </div>
                  </article>

                  <article className="museum-home__character-relations">
                    <h4>跨馆跳转</h4>
                    <div className="museum-home__jump-links">
                      <button type="button" className="museum-home__jump-button" onClick={() => onNavigate('事件馆')} aria-label="打开事件：第一间房试炼">
                        事件：第一间房试炼
                      </button>
                      <button type="button" className="museum-home__jump-button" onClick={() => onNavigate('关系馆')} aria-label="打开关系类型：共谋">
                        关系：共谋
                      </button>
                      <button type="button" className="museum-home__jump-button" onClick={() => onNavigate('世界观馆')} aria-label="打开世界观节点：终焉之地">
                        世界观：终焉之地
                      </button>
                    </div>
                  </article>
                </div>
              </div>
            </section>

            <section className="museum-home__tab-grid museum-home__tab-grid--characters" aria-label="更多人物档案">
              {characterProfiles.slice(1).map(({ character, timeline, linkedCharacters }) => (
                <article key={character.id} className="museum-home__tab-card">
                  <p className="museum-home__dossier-range">回响：{toEchoName(character.id)}</p>
                  <h3>{character.title}</h3>
                  <p className="museum-home__character-summary">{character.summary}</p>
                  <div className="museum-home__character-sections">
                    {character.sections.slice(0, 3).map((section) => (
                      <div key={section.label} className="museum-home__character-section">
                        <p className="museum-home__card-label">{section.label}</p>
                        <p>{section.value}</p>
                      </div>
                    ))}
                    <div className="museum-home__character-section">
                      <p className="museum-home__card-label">阶段轨迹</p>
                      <p>{timeline.map((item) => item.label).join(' / ') || '待补'}</p>
                    </div>
                    <div className="museum-home__character-section">
                      <p className="museum-home__card-label">关联对象</p>
                      <p>{linkedCharacters.slice(0, 4).join(' / ') || '待补'}</p>
                    </div>
                  </div>
                </article>
              ))}
            </section>

            <section className="museum-home__collapsed-characters" aria-labelledby="collapsed-character-heading">
              <div className="museum-home__section-heading museum-home__section-heading--compact">
                <p className="eyebrow">MORE / COLLAPSED</p>
                <h3 id="collapsed-character-heading">更多人物折叠层</h3>
              </div>
              <div className="museum-home__collapsed-characters-grid">
                {collapsedCharacterNodes.map((character) => (
                  <article key={character.id} className="museum-home__collapsed-character-card">
                    <p className="museum-home__dossier-range">回响：{toEchoName(character.id)}</p>
                    <h4>{character.title}</h4>
                    <p>{character.summary}</p>
                  </article>
                ))}
              </div>
            </section>
        </section>
      ) : null}

      {activeView === '事件馆' ? (
        <section className="museum-home__tab-page" id="事件馆" data-testid="event-hall">
          <header className="museum-home__tab-hero museum-home__tab-hero--events">
            <div>
              <p className="eyebrow">CHRONICLE: EVENTS</p>
              <h2>事件馆</h2>
              <p className="museum-home__tab-intro">
                这里按事件看《十日终焉》。每个事件都不只讲发生了什么，还要补齐参与人物、规则、后果，以及它在整部作品中的结构位置。
              </p>
            </div>
            <div className="museum-home__tab-meta">
              <span>EVT-1024</span>
              <strong>{featuredEvent.title}</strong>
            </div>
          </header>

          <div className="museum-home__event-filterbar">
            <div className="museum-home__event-filter">
              <span>Filter by:</span>
              <button type="button" className="is-active">Stages</button>
              <button type="button">Event Types</button>
            </div>
            <div className="museum-home__event-filterline" aria-hidden="true" />
            <div className="museum-home__event-dots" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
          </div>

          <div className="museum-home__event-layout">
            <aside className="museum-home__event-identity">
              <div className="museum-home__event-poster" aria-hidden="true">
                <span>G-1024 GAME</span>
              </div>
              <div className="museum-home__event-code">
                <p className="museum-home__dossier-range">{featuredEvent.subtitle}</p>
                <h3>{featuredEvent.title}</h3>
                <p>{featuredEvent.summary}</p>
              </div>
              <article className="museum-home__event-participants">
                <h4>参与人物</h4>
                <ul>
                  {featuredEventParticipants.map((participant) => (
                    <li key={participant.id}>{participant.title}</li>
                  ))}
                </ul>
              </article>
              <article className="museum-home__event-participants">
                <h4>阶段目录</h4>
                <ul>
                  {timelineEvents.map((event, index) => (
                    <li key={event.id}>
                      <span>{String(index + 1).padStart(2, '0')}</span>
                      <strong>{event.phase}</strong>
                      <em>·</em>
                      <span>{event.label}</span>
                    </li>
                  ))}
                </ul>
              </article>
            </aside>

            <div className="museum-home__event-main">
              <article className="museum-home__event-rules">
                <h3>规则概要</h3>
                <div className="museum-home__tab-grid">
                  {featuredEvent.sections.map((section) => (
                    <div key={section.label} className="museum-home__character-section">
                      <p className="museum-home__card-label">{section.label}</p>
                      <p>{section.value}</p>
                    </div>
                  ))}
                  <div className="museum-home__character-section">
                    <p className="museum-home__card-label">关联规则</p>
                    <p>{eventProfiles.find((item) => item.event.id === featuredEvent.id)?.linkedRules.join(' / ') || '待补'}</p>
                  </div>
                  <div className="museum-home__character-section">
                    <p className="museum-home__card-label">指向结构</p>
                    <p>{eventProfiles.find((item) => item.event.id === featuredEvent.id)?.linkedTruths.join(' / ') || '待补'}</p>
                  </div>
                  <div className="museum-home__character-section">
                    <p className="museum-home__card-label">知识补充</p>
                    <p>第一间房的真正价值不是介绍设定，而是第一次把信任、风险、规则、站位绑成同一个局。</p>
                  </div>
                </div>
              </article>

              <article className="museum-home__event-flow">
                <h3>事件演化图</h3>
                <div className="museum-home__event-flow-row">
                  <div className="museum-home__event-flow-node">
                    <span>入口阶段</span>
                    <strong>陌生人入局</strong>
                  </div>
                  <div className="museum-home__event-flow-node museum-home__event-flow-node--core">
                    <span>核心博弈</span>
                    <strong>{featuredEvent.title}</strong>
                  </div>
                  <div className="museum-home__event-flow-node">
                    <span>结果流向</span>
                    <strong>主角团共犯网络</strong>
                  </div>
                </div>
              </article>
            </div>
          </div>

          <section className="museum-home__event-flowline" aria-label="事件脉络线索">
            <div className="museum-home__event-flowline-head">
              <div>
                <p className="eyebrow">STRUCTURAL THREADS</p>
                <h3>结构线索</h3>
              </div>
              <p>这些线索来自事件、人物与规则交织出来的主干流向，帮助你快速定位故事推进的关键节点。</p>
            </div>
            <div className="museum-home__event-flowline-grid">
              {flowCards.map((card) => (
                <article key={card.id} className={`museum-home__event-flowline-card is-${card.type}`}>
                  <p className="museum-home__dossier-range">{card.subtitle}</p>
                  <h4>{card.title}</h4>
                  <p>{card.summary}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="museum-home__event-chronology" aria-label="事件时间轴">
            <div className="museum-home__event-chronology-head">
              <div>
                <p className="eyebrow">CHRONOLOGY</p>
                <h3>按时间轴展开的事件脉络</h3>
              </div>
              <p>
                这里把 800 条资料里能对上的事件、规则、人物和真相，先按阶段收拢，再向下展开成可读的时间线。
              </p>
            </div>
            <div className="museum-home__event-chronology-rail">
              {eventChronologySections.map((section, index) => (
                <article
                  key={section.id}
                  className="museum-home__event-chronology-step"
                  data-testid="event-chronology-step"
                  data-phase-id={section.id}
                >
                  <div className="museum-home__event-chronology-marker">
                    <span>{String(index + 1).padStart(2, '0')}</span>
                  </div>
                  <div className="museum-home__event-chronology-body">
                    <div className="museum-home__event-chronology-meta">
                      <p>{section.phase}</p>
                      <strong>{section.label}</strong>
                    </div>
                    <p className="museum-home__event-chronology-detail">{section.detail}</p>
                    <div className="museum-home__event-chronology-panels">
                      <div className="museum-home__event-chronology-events">
                        <h4>关键事件</h4>
                        <div className="museum-home__event-chronology-grid">
                          {section.events.length ? (
                            section.events.map(({ event, participants, linkedRules, linkedTruths }) => {
                              const outcome = event.sections.find((item) => item.label === '后果' || item.label === '结果')?.value
                                ?? event.sections.find((item) => item.label === '意义')?.value;
                              return (
                                <article
                                  key={event.id}
                                  className="museum-home__tab-card museum-home__event-chronology-card"
                                  data-testid="event-chronology-card"
                                >
                                  <p className="museum-home__dossier-range">{event.subtitle}</p>
                                  <h4>{event.title}</h4>
                                  <p className="museum-home__character-summary">{event.summary}</p>
                                  <div className="museum-home__chronology-mini-grid">
                                    <div>
                                      <span>参与人物</span>
                                      <strong>
                                        {participants.length ? (
                                          participants.map((participant) => (
                                            <button
                                              key={participant}
                                              type="button"
                                              className="museum-home__inline-jump"
                                              onClick={() => onNavigate('人物馆')}
                                              aria-label={`打开人物馆：${participant}`}
                                            >
                                              {participant}
                                            </button>
                                          ))
                                        ) : (
                                          '待补'
                                        )}
                                      </strong>
                                    </div>
                                    <div>
                                      <span>关联规则</span>
                                      <strong>{linkedRules.join(' / ') || '待补'}</strong>
                                    </div>
                                    <div>
                                      <span>后续流向</span>
                                      <strong>{linkedTruths.join(' / ') || '待补'}</strong>
                                    </div>
                                    {outcome ? (
                                      <div>
                                        <span>阶段后果</span>
                                        <strong>{outcome}</strong>
                                      </div>
                                    ) : null}
                                  </div>
                                </article>
                              );
                            })
                          ) : (
                            <div className="museum-home__event-chronology-empty">
                              <span>待继续补充该阶段的更多事件</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="museum-home__event-chronology-structures">
                        <h4>规则 / 真相 / 阵营</h4>
                        <div className="museum-home__event-chronology-structure-grid">
                          <div>
                            <span>规则</span>
                            <ul>
                              {section.rules.map((rule) => (
                                <li key={rule.id}>{rule.title}</li>
                              ))}
                              {!section.rules.length ? <li>待补</li> : null}
                            </ul>
                          </div>
                          <div>
                            <span>真相</span>
                            <ul>
                              {section.truths.map((truth) => (
                                <li key={truth.id}>{truth.title}</li>
                              ))}
                              {!section.truths.length ? <li>待补</li> : null}
                            </ul>
                          </div>
                          <div>
                            <span>阵营</span>
                            <ul>
                              {section.factions.map((faction) => (
                                <li key={faction.id}>{faction.title}</li>
                              ))}
                              {!section.factions.length ? <li>待补</li> : null}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="museum-home__event-outcomes">
            <article className="museum-home__event-impact">
              <div className="museum-home__event-impact-head">
                <h3>事件后果</h3>
                <div className="museum-home__event-impact-mark" aria-hidden="true">
                  <span>H</span>
                </div>
              </div>
              <div className="museum-home__tab-grid">
                <div className="museum-home__character-section">
                  <p className="museum-home__card-label">Character Evolution</p>
                  <p>第一间房之后，人物不再以“是否应该信任”来判断别人，而开始用“是否值得一起活下去”来重新分层。</p>
                </div>
                <div className="museum-home__character-section">
                  <p className="museum-home__card-label">Worldview Shift</p>
                  <p>终焉之地不再只是背景名词，规则开始像真正的世界壳层一样包裹所有选择和代价。</p>
                </div>
              </div>
            </article>

            <aside className="museum-home__curator-note">
              <p className="museum-home__branch-label">Curator Notes</p>
              <div className="museum-home__curator-note-body">
                <p>“这一局不是开场说明，而是整张关系网第一次被强制缠在一起。”</p>
                <p>“此处应连回人物馆与规则馆，作为第一批跳转入口。”</p>
                <p>— THE CURATOR</p>
              </div>
              <div className="museum-home__jump-links">
                <button type="button" className="museum-home__jump-button" onClick={() => onNavigate('人物馆')} aria-label="打开人物：齐夏">
                  人物：齐夏
                </button>
                <button type="button" className="museum-home__jump-button" onClick={() => onNavigate('世界观馆')} aria-label="打开世界观节点：终焉之地">
                  世界观：终焉之地
                </button>
              </div>
            </aside>
          </section>
        </section>
      ) : null}

      {activeView === '世界观馆' ? (
        <section className="museum-home__tab-page" id="世界观馆" data-testid="world-hall">
          <header className="museum-home__world-hero">
            <div className="museum-home__world-hero-copy">
              <p className="eyebrow">COSMO-001: LAYERS</p>
              <h2>世界观馆</h2>
              <p className="museum-home__tab-intro">
                欢迎来到归档中心。这里封存着《十日终焉》世界的最核心构造。在牛皮纸、折痕与删改之下，规则、结构与真相一层层压住人物命运。
              </p>
            </div>
            <div className="museum-home__world-hero-mark" aria-hidden="true">
              <span>WORLD</span>
            </div>
          </header>

          <section className="museum-home__world-epic">
            <div className="museum-home__world-epic-head">
              <div>
                <p className="eyebrow">WORLD MAP</p>
                <h3>世界分类图谱</h3>
              </div>
              <p>
                这里不是把设定拆碎，而是把整部作品的世界壳层、管理周期、权力分层和终局回收一次性摆出来，让读者先看见“它为什么这么大”，再去看“它为什么这么痛”。
              </p>
            </div>
            <div className="museum-home__world-epic-grid">
              <article className="museum-home__world-epic-card">
                <p className="museum-home__card-label">世界壳层</p>
                <h4>终焉之地不是地点，是覆盖一切的系统外壳</h4>
                <p>每个事件都不是孤立房间，而是在同一个巨大结构中被分层投放、分层管理、分层回收。</p>
              </article>
              <article className="museum-home__world-epic-card">
                <p className="museum-home__card-label">管理周期</p>
                <h4>十日循环把死亡、重投与失忆变成治理技术</h4>
                <p>人被不断刷新，却又不断在裂口里保留痕迹，世界因此显得残酷但持续可运行。</p>
              </article>
              <article className="museum-home__world-epic-card">
                <p className="museum-home__card-label">权力分层</p>
                <h4>天、地、人不是难度标签，而是距离真相的层级</h4>
                <p>越往上走，敌人越像制度，越接近终局，越接近世界真正的操盘方式。</p>
              </article>
              <article className="museum-home__world-epic-card">
                <p className="museum-home__card-label">终局回收</p>
                <h4>真相不是一个答案，而是一整套重新解释前文的工程</h4>
                <p>桃源、梦境、第二站、新世界这些节点，把整部作品的宏观尺度重新拉开。</p>
              </article>
            </div>
          </section>

          <section className="museum-home__world-layout">
            <aside className="museum-home__world-sidebar">
              <div className="museum-home__world-sidebar-head">
                <h3>三层境界</h3>
                <p>REF: LVL_ARCHIVE_03</p>
              </div>
              <nav className="museum-home__world-nav" aria-label="世界观层级">
                <a href="#world-rules" className="is-active">规则层</a>
                <a href="#world-structure">结构层</a>
                <a href="#world-truth">真相层</a>
              </nav>
            </aside>

            <div className="museum-home__world-main">
              <section className="museum-home__world-panel museum-home__world-panel--rules" id="world-rules">
                <div className="museum-home__world-panel-grid">
                  <div className="museum-home__world-copy">
                    <p className="eyebrow">RULE LAYER</p>
                    <h3>规则层</h3>
                    <p>回响、规则、信息差和生存压力共同构成第一层壳。理解这一层，人物为什么会彼此利用和试探就变得清楚。</p>
                    <div className="museum-home__world-protocols">
                      {ruleNodes.map((rule) => (
                        <div key={rule.id}>
                          <span>{rule.title}</span>
                          <strong>{rule.subtitle.toUpperCase()}</strong>
                        </div>
                      ))}
                      <div><span>PROTOCOL: ECHO_RESONANCE</span><strong>ACTIVE</strong></div>
                      <div><span>CONSTRAINT: TEN_DAY_LIMIT</span><strong>LOCKED</strong></div>
                    </div>
                  </div>
                  <div className="museum-home__world-diagram" aria-hidden="true">
                    <span>Rule Architecture Diagram Rev. 04</span>
                  </div>
                </div>
              </section>

              <section className="museum-home__world-panel museum-home__world-panel--structure" id="world-structure">
                <div className="museum-home__world-panel-head">
                  <h3>结构层</h3>
                  <p>The Structure Layer</p>
                </div>
                <div className="museum-home__world-structure-grid">
                  <div className="museum-home__world-structure-copy">
                    <div className="museum-home__world-structure-note">
                      <h4>回响的循环</h4>
                      <p>世界由重叠的时间切片构成。每一次死而复生、每一次回响显现，都在加固终焉之地这座巨大的监狱。</p>
                    </div>
                    <div className="museum-home__world-structure-path">
                      <h4>参与者路径</h4>
                      <ul>
                        {factionNodes.map((faction) => (
                          <li key={faction.id}>{faction.title}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="museum-home__world-blueprint" aria-hidden="true">
                    <div className="museum-home__world-blueprint-mark">CLASSIFIED: S-LEVEL</div>
                  </div>
                </div>
              </section>

              <section className="museum-home__world-panel museum-home__world-panel--truth" id="world-truth">
                <div className="museum-home__world-truth-head">
                  <h3>真相层</h3>
                  <p>CORE TRUTH PROGRESS: 34%</p>
                </div>
                <div className="museum-home__world-truth-grid">
                  {truthNodes.map((node, index) => (
                    <article
                      key={node.id}
                      className={`museum-home__world-truth-card ${index === 0 ? 'is-revealed' : ''} ${index === 1 ? 'is-redacted' : ''}`}
                    >
                      <h4>{node.title}</h4>
                      <p>{node.summary}</p>
                      {index === 0 ? <button type="button">Access Node</button> : null}
                      {index === 1 ? <span className="museum-home__world-redacted-mark">REDACTED</span> : null}
                    </article>
                  ))}
                  <article className="museum-home__world-truth-card is-locked">
                    <h4>Chrono Lock</h4>
                    <p>更深一层的真相仍然被时间机制锁住。</p>
                  </article>
                </div>
                <div className="museum-home__jump-links museum-home__jump-links--world">
                  <button type="button" className="museum-home__jump-button" onClick={() => onNavigate('关系馆')} aria-label="打开关系类型：共谋">
                    关系：共谋
                  </button>
                  <button type="button" className="museum-home__jump-button" onClick={() => onNavigate('事件馆')} aria-label="打开事件：列车与第二站">
                    事件：列车与第二站
                  </button>
                </div>
              </section>
            </div>
          </section>

          <section className="museum-home__world-chronicle">
            <div className="museum-home__section-heading">
              <p className="eyebrow">WORLD CHRONICLE</p>
              <h3>世界纪元带</h3>
            </div>
            <div className="museum-home__world-chronicle-rail">
              {timelineEvents.map((timelineEvent, index) => (
                <article key={timelineEvent.id} className={`museum-home__world-chronicle-node ${index % 2 === 0 ? 'is-left' : 'is-right'}`}>
                  <span className="museum-home__branch-label">{String(index + 1).padStart(2, '0')}</span>
                  <h4>{timelineEvent.label}</h4>
                  <p className="museum-home__world-chronicle-phase">{timelineEvent.phase}</p>
                  <p>{timelineEvent.detail}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="museum-home__world-network">
            <div className="museum-home__section-heading">
              <p className="eyebrow">INTERCONNECTED RECORDS</p>
              <h3>关联网路</h3>
            </div>
            <div className="museum-home__world-network-board">
              <div className="museum-home__world-network-grid">
                {worldviewConnections.map((connection, index) => (
                  <article
                    key={connection.id}
                    className={`museum-home__world-network-node ${
                      connection.sourceType === 'event' || connection.targetType === 'event'
                        ? 'is-event'
                        : connection.sourceType === 'character' || connection.targetType === 'character'
                          ? 'is-character'
                          : 'is-relic'
                    } ${index % 3 === 2 ? 'is-offset' : ''}`}
                  >
                    <p className="museum-home__branch-label">{connection.label}</p>
                    <h4>{connection.source}</h4>
                    <p>{connection.target}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <div className="museum-home__world-seal-wrap">
            <div className="museum-home__world-seal">
              <div>
                <span>APPROVED</span>
                <strong>档案封存</strong>
                <span>ARCHIVAL UNIT 09</span>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {activeView === '关系馆' ? (
        <section className="museum-home__tab-page" id="关系馆" data-testid="relation-hall">
          <section className="museum-home__relation-hall">
            <div className="museum-home__relation-smudge museum-home__relation-smudge--left" aria-hidden="true" />
            <div className="museum-home__relation-smudge museum-home__relation-smudge--right" aria-hidden="true" />

            <header className="museum-home__relation-header">
              <div className="museum-home__relation-header-copy">
                <h2>关系馆 (Relation Hall)</h2>
                <p>
                  在终焉里，信任从来不是自然产生的。关系馆关心的是人物之间如何在试探、保护、利用、共谋和背叛里被重新塑形。
                </p>
                <div className="museum-home__relation-badges">
                  <span>Subject: Interpersonal Entropy</span>
                  <span>Auth: Level 4 Required</span>
                </div>
              </div>
            </header>

            <div className="museum-home__relation-type-grid museum-home__relation-type-grid--refined">
              {relationGroups.slice(0, 8).map(({ type, samples }, index) => (
                <article key={type} className={`museum-home__relation-type-card museum-home__relation-type-card--${index === 1 ? 'danger' : 'plain'}`}>
                  <span className="museum-home__relation-ref">REF_0{index + 1}</span>
                  <h3>{type}</h3>
                  <p>
                    {type === '共谋'
                      ? '高压环境里最锋利的双向绑定。'
                      : type === '背叛'
                        ? '当关系崩裂时，生存逻辑会直接暴露。'
                        : '这种关系决定人物如何靠近、屏蔽或彼此改写。'}
                  </p>
                  <p className="museum-home__relation-samples">{samples.map((sample) => sample.title).join(' / ')}</p>
                </article>
              ))}
            </div>

            <section className="museum-home__relation-case museum-home__relation-case--featured">
              <div className="museum-home__relation-case-portrait museum-home__relation-case-portrait--featured" aria-hidden="true">
                <span>{featuredRelation.right}</span>
              </div>

              <div className="museum-home__relation-case-body museum-home__relation-case-body--featured">
                <div className="museum-home__relation-case-note">典型案例分析：{featuredRelation.label}</div>

                <div className="museum-home__relation-dual">
                  <div className="museum-home__relation-dual-name">
                    <strong>{featuredRelation.left}</strong>
                    <span>LEADER</span>
                  </div>
                  <div className="museum-home__relation-dual-link">
                    <span>{featuredRelation.label.toUpperCase()}</span>
                  </div>
                  <div className="museum-home__relation-dual-name">
                    <strong>{featuredRelation.right}</strong>
                    <span>ENFORCER</span>
                  </div>
                </div>

                <div className="museum-home__relation-evolution">
                  <p className="museum-home__card-label">进化路径</p>
                  <div className="museum-home__relation-evolution-track">
                    <div className="museum-home__relation-evolution-node">
                      <i />
                      <span>试探</span>
                    </div>
                    <div className="museum-home__relation-evolution-node is-core">
                      <i />
                      <span>协作</span>
                    </div>
                    <div className="museum-home__relation-evolution-node is-faded">
                      <i />
                      <span>疑虑</span>
                    </div>
                  </div>
                </div>

                <div className="museum-home__relation-info-grid">
                  <article className="museum-home__relation-info-card">
                    <p className="museum-home__card-label">心理基础</p>
                    <p>
                      关系先建立在风险共担和能力互补之上，而不是纯情感认同。越接近终焉核心，这种关系越容易被推到极限。
                    </p>
                  </article>
                  <article className="museum-home__relation-info-card">
                    <p className="museum-home__card-label">关联事件</p>
                    <ul>
                      {eventProfiles.slice(0, 3).map(({ event }) => (
                        <li key={event.id}>{event.title}</li>
                      ))}
                    </ul>
                  </article>
                </div>
              </div>
            </section>

            <div className="museum-home__relation-stamps">
              <div className="museum-home__relation-stamp museum-home__relation-stamp--auth">
                <span>AUTHENTIC ARCHIVE</span>
                <strong>CONFIRMED BY DEPT. RELATION</strong>
              </div>
              <div className="museum-home__relation-stamp museum-home__relation-stamp--redacted">
                <span>REDACTED FOR PUBLIC</span>
              </div>
            </div>

            <div className="museum-home__relation-list museum-home__relation-list--detailed">
              {relationGroups.map((group) => (
                <article key={group.type} className="museum-home__relation-card museum-home__relation-card--detailed">
                  <p className="museum-home__card-label">{group.type}</p>
                  <h3>{group.samples[0]?.title ?? '待补关系样本'}</h3>
                  <p>{group.samples.map((sample) => sample.title).join(' / ') || '这类关系还需要继续补样本。'}</p>
                  <div className="museum-home__jump-links">
                    <button type="button" className="museum-home__jump-button" onClick={() => onNavigate('人物馆')} aria-label={`打开人物馆条目：${group.samples[0]?.title ?? group.type}`}>
                      返回人物馆
                    </button>
                    <button type="button" className="museum-home__jump-button" onClick={() => onNavigate('事件馆')} aria-label={`打开事件馆条目：${group.type}`}>
                      查看关联事件
                    </button>
                  </div>
                </article>
              ))}
            </div>

            <div className="museum-home__relation-margin museum-home__relation-margin--left">
              * 观察记录：齐夏在对话里更常使用“稳定性”而不是“信任”。
            </div>
            <div className="museum-home__relation-margin museum-home__relation-margin--right">
              （死者的影子，终究会覆盖生者的脚步）
            </div>
          </section>
        </section>
      ) : null}
    </div>
  );
}
