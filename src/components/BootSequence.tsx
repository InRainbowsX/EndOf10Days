type BootSequenceProps = {
  onComplete: () => void;
};

const statusRows = [
  ['系统编号', 'EO10-RTR-01'],
  ['存活样本', '06 / 06'],
  ['异常波动', '高'],
];

export function BootSequence({ onComplete }: BootSequenceProps) {
  return (
    <section className="boot-panel" aria-label="终焉接入面板">
      <p className="eyebrow">ARCHIVE WAKEUP</p>
      <h1>正在接入终焉档案</h1>
      <p className="boot-copy">系统正在校准第一间房的共犯结构、幸存样本与异常关系脉冲。</p>
      <dl className="status-grid">
        {statusRows.map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
      <button type="button" className="primary-action" onClick={onComplete}>
        跳过接入
      </button>
    </section>
  );
}
