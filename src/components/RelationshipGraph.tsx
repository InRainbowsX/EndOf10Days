import { useEffect, useRef, useState } from 'react';
import type { ArchiveNode, ArchiveNodeType } from '../archiveData';
import { archiveEdges } from '../archiveData';
import { getConnectedNodes, getNodeById } from '../archiveGraph';

type RelationshipGraphProps = {
  nodes: ArchiveNode[];
  activeNodeId: string;
  onSelectNode: (nodeId: string) => void;
};

const typeLabels: Record<ArchiveNodeType, string> = {
  character: '人物',
  event: '事件',
  rule: '规则',
  truth: '真相',
  faction: '阵营',
};

const nodePositions: Record<string, { x: number; y: number }> = {
  qixia: { x: 47, y: 47 },
  linqin: { x: 24, y: 24 },
  qiaojiajin: { x: 22, y: 72 },
  chenjunnan: { x: 72, y: 24 },
  tiantian: { x: 74, y: 69 },
  hanyimo: { x: 12, y: 50 },
  'first-room': { x: 48, y: 15 },
  'false-alliance-event': { x: 58, y: 82 },
  endland: { x: 82, y: 48 },
  rules: { x: 63, y: 53 },
  'survival-alliance': { x: 35, y: 88 },
};

export function RelationshipGraph({
  nodes,
  activeNodeId,
  onSelectNode,
}: RelationshipGraphProps) {
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const dragState = useRef<{ startX: number; startY: number; originX: number; originY: number } | null>(
    null,
  );

  const focusNodeId = hoveredNodeId ?? activeNodeId;
  const activeEdges = archiveEdges.filter(
    (edge) => edge.source === focusNodeId || edge.target === focusNodeId,
  );
  const activeNeighborIds = new Set(
    activeEdges.flatMap((edge) => [edge.source, edge.target]),
  );
  const focusNode = getNodeById(focusNodeId);
  const relatedNodes = getConnectedNodes(focusNodeId).slice(0, 5);
  const focusPosition = nodePositions[focusNodeId] ?? { x: 50, y: 50 };
  const hoverCardPosition = {
    left:
      focusPosition.x > 62
        ? `calc(${focusPosition.x}% - 250px)`
        : `calc(${focusPosition.x}% + 28px)`,
    top:
      focusPosition.y > 72
        ? `calc(${focusPosition.y}% - 184px)`
        : `calc(${focusPosition.y}% - 12px)`,
  };

  useEffect(() => {
    function handleMouseMove(event: MouseEvent) {
      if (!dragState.current) {
        return;
      }

      const deltaX = event.clientX - dragState.current.startX;
      const deltaY = event.clientY - dragState.current.startY;
      setOffset({
        x: dragState.current.originX + deltaX,
        y: dragState.current.originY + deltaY,
      });
    }

    function handleMouseUp() {
      dragState.current = null;
    }

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  function clampScale(nextScale: number) {
    return Math.min(1.9, Math.max(0.68, Number(nextScale.toFixed(2))));
  }

  return (
    <section className="graph-panel" aria-labelledby="graph-heading">
      <div className="panel-header">
        <p className="eyebrow">NETWORK MAP</p>
        <div className="graph-panel__headline">
          <h2 id="graph-heading">终焉大网主控台</h2>
          <p className="graph-meta">人物、事件、规则、真相在同一张网里自由漫游</p>
        </div>
      </div>
      <div
        className="network-canvas"
        data-testid="network-canvas"
        onWheel={(event) => {
          event.preventDefault();
          const delta = event.deltaY < 0 ? 0.12 : -0.12;
          setScale((current) => clampScale(current + delta));
        }}
        onDoubleClick={() => {
          setScale(1);
          setOffset({ x: 0, y: 0 });
        }}
      >
        <div
          className="network-viewport"
          data-testid="network-viewport"
          style={{ transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})` }}
          onMouseDown={(event) => {
            dragState.current = {
              startX: event.clientX,
              startY: event.clientY,
              originX: offset.x,
              originY: offset.y,
            };
          }}
        >
          <svg
            className="network-links"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            {archiveEdges
              .filter(
                (edge) =>
                  nodes.some((node) => node.id === edge.source) &&
                  nodes.some((node) => node.id === edge.target),
              )
              .map((edge) => {
                const source = nodePositions[edge.source];
                const target = nodePositions[edge.target];
                const isActive = edge.source === focusNodeId || edge.target === focusNodeId;

                return (
                  <line
                    key={`${edge.source}-${edge.target}`}
                    data-testid={isActive ? 'network-link-active' : 'network-link'}
                    className={`network-link ${isActive ? 'is-active' : ''}`}
                    x1={source.x}
                    y1={source.y}
                    x2={target.x}
                    y2={target.y}
                  />
                );
              })}
          </svg>

          <div className="graph-cluster" role="list" aria-label="终焉网络节点">
            {nodes.map((node) => (
              <div key={node.id} role="listitem">
                <button
                  type="button"
                  className={`graph-node graph-node--${node.type} ${
                    node.id === focusNodeId ? 'is-active' : ''
                  }`}
                  onClick={() => {
                    setHoveredNodeId(node.id);
                    onSelectNode(node.id);
                  }}
                  onMouseEnter={() => setHoveredNodeId(node.id)}
                  onMouseLeave={() => setHoveredNodeId((current) => (current === node.id ? null : current))}
                  aria-pressed={node.id === focusNodeId}
                  aria-label={node.title}
                  data-testid={
                    node.id === focusNodeId || activeNeighborIds.has(node.id)
                      ? 'network-node-active'
                      : 'network-node'
                  }
                  style={{
                    left: `${nodePositions[node.id]?.x ?? 50}%`,
                    top: `${nodePositions[node.id]?.y ?? 50}%`,
                  }}
                >
                  <span className="graph-node__eyebrow">{typeLabels[node.type]}</span>
                  <span className="graph-node__name">{node.title}</span>
                  <span className="graph-node__title">{node.subtitle}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
        <aside
          className={`hover-card ${hoveredNodeId ? 'is-visible' : 'is-dormant'}`}
          aria-live="polite"
          data-testid="hover-card"
          style={hoverCardPosition}
        >
          <p className="hover-card__type">{typeLabels[focusNode.type]}</p>
          <h3>{focusNode.title}</h3>
          <p className="hover-card__subtitle">{focusNode.subtitle}</p>
          <p className="hover-card__summary">{focusNode.summary}</p>
          <div className="hover-card__links">
            {relatedNodes.map(({ edge, node }) => (
              <button
                key={`${focusNode.id}-${edge.label}-${node.id}`}
                type="button"
                className="hover-card__chip"
                onClick={() => {
                  setHoveredNodeId(node.id);
                  onSelectNode(node.id);
                }}
                aria-label={node.title}
              >
                <span>{edge.label}</span>
                <strong>{node.title}</strong>
              </button>
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
}
