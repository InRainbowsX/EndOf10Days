import { render, screen, within } from '@testing-library/react';
import App from './App';
import { archiveEdges, archiveNodes, timelineEvents } from './archiveData';

describe('Event hall timeline', () => {
  it('renders the timeline phases in chronological order', () => {
    render(<App initialView="事件馆" />);

    const hall = screen.getByTestId('event-hall');
    const phaseLabels = timelineEvents.map((event) => event.phase);
    const renderedLabels = phaseLabels.map((label) => within(hall).getAllByText(label)[0].textContent);

    expect(renderedLabels).toEqual(phaseLabels);
  });

  it('renders a chronology step for each timeline phase', () => {
    render(<App initialView="事件馆" />);

    const phaseSteps = screen.getAllByTestId('event-chronology-step');
    const renderedIds = phaseSteps.map((step) => step.getAttribute('data-phase-id'));

    expect(renderedIds).toEqual(timelineEvents.map((event) => event.id));
  });

  it('renders every event profile in the chronology details', () => {
    render(<App initialView="事件馆" />);

    const hall = screen.getByTestId('event-hall');
    const chronologyCards = within(hall).getAllByTestId('event-chronology-card');
    const eventNodeCount = archiveNodes.filter((node) => node.type === 'event').length;

    expect(chronologyCards.length).toBe(eventNodeCount);
  });

  it('links every event to at least one character', () => {
    const eventNodes = archiveNodes.filter((node) => node.type === 'event');
    const characterIds = new Set(archiveNodes.filter((node) => node.type === 'character').map((node) => node.id));

    eventNodes.forEach((event) => {
      const hasCharacterLink = archiveEdges.some((edge) => {
        return (
          (edge.source === event.id && characterIds.has(edge.target)) ||
          (edge.target === event.id && characterIds.has(edge.source))
        );
      });

      expect(hasCharacterLink).toBe(true);
    });
  });

  it('ensures each event surfaces a causal section (后果/结果/意义)', () => {
    const eventNodes = archiveNodes.filter((node) => node.type === 'event');

    eventNodes.forEach((event) => {
      const hasCausalSection = event.sections.some((section) => ['后果', '结果', '意义'].includes(section.label));

      expect(hasCausalSection).toBe(true);
    });
  });

  it('captures concrete novel anchor events beyond the abstract phase summaries', () => {
    const eventTitles = new Set(archiveNodes.filter((node) => node.type === 'event').map((node) => node.title));

    [
      '鼠类游戏',
      '极道现身',
      '诡异的天堂口',
      '云瑶的回响',
      '生肖飞升对赌合同',
      '人猴游戏',
      '家人扩张',
      '白羊之路',
      '中间站',
      '赢法',
      '如何获胜',
      '离析',
      '生生不息',
    ].forEach((title) => {
      expect(eventTitles.has(title)).toBe(true);
    });
  });
});
