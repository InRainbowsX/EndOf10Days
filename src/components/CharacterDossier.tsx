import type { ArchiveNode } from '../archiveData';

type CharacterDossierProps = {
  node: ArchiveNode;
  relatedNodes: Array<{
    edgeLabel: string;
    node: ArchiveNode;
  }>;
  onSelectNode: (nodeId: string) => void;
  trail: ArchiveNode[];
};

const typeCopy = {
  character: '人物档案',
  event: '事件档案',
  rule: '规则档案',
  truth: '真相档案',
  faction: '网络档案',
} as const;

export function CharacterDossier({
  node,
  relatedNodes,
  onSelectNode,
  trail,
}: CharacterDossierProps) {
  return (
    <aside className="dossier-panel" aria-labelledby="dossier-heading">
      <p className="eyebrow">{typeCopy[node.type]}</p>
      <h2 id="dossier-heading">{node.title}</h2>
      <p className="dossier-title">{node.subtitle}</p>
      <p className="dossier-summary">{node.summary}</p>

      <dl className="dossier-metadata">
        {node.sections.map((section) => (
          <div key={section.label}>
            <dt>{section.label}</dt>
            <dd>{section.value}</dd>
          </div>
        ))}
      </dl>

      <section className="related-panel" aria-labelledby="related-heading">
        <h3 id="related-heading">关联节点</h3>
        <div className="related-list">
          {relatedNodes.map(({ edgeLabel, node: relatedNode }) => (
            <button
              key={`${edgeLabel}-${relatedNode.id}`}
              type="button"
              className="related-chip"
              onClick={() => onSelectNode(relatedNode.id)}
              aria-label={relatedNode.title}
            >
              <span className="related-chip__label">{edgeLabel}</span>
              <span className="related-chip__title">{relatedNode.title}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="trail-panel" aria-labelledby="trail-heading">
        <h3 id="trail-heading">探索轨迹</h3>
        <div className="trail-list">
          {trail.map((trailNode) => (
            <button
              key={trailNode.id}
              type="button"
              className={`trail-chip ${trailNode.id === node.id ? 'is-active' : ''}`}
              onClick={() => onSelectNode(trailNode.id)}
              aria-label={`轨迹 ${trailNode.title}`}
            >
              {trailNode.title}
            </button>
          ))}
        </div>
      </section>
    </aside>
  );
}
