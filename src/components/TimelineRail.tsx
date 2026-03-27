import type { TimelineEvent } from '../archiveData';

type TimelineRailProps = {
  events: TimelineEvent[];
  activeEventId: string;
  onSelectEvent: (eventId: string) => void;
};

export function TimelineRail({ events, activeEventId, onSelectEvent }: TimelineRailProps) {
  const activeEvent = events.find((event) => event.id === activeEventId) ?? events[0];

  return (
    <section className="timeline-panel" aria-labelledby="timeline-heading">
      <div className="panel-header">
        <p className="eyebrow">TIME RAIL</p>
        <h2 id="timeline-heading">阶段回廊</h2>
      </div>
      <div className="timeline-events">
        {events.map((event) => (
          <button
            key={event.id}
            type="button"
            className={`timeline-chip ${event.id === activeEventId ? 'is-active' : ''}`}
            onClick={() => onSelectEvent(event.id)}
            aria-pressed={event.id === activeEventId}
            aria-label={event.label}
          >
            <span>{event.label}</span>
            <small>{event.phase}</small>
          </button>
        ))}
      </div>
      <p className="timeline-detail">{activeEvent.detail}</p>
    </section>
  );
}
