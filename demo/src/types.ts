export type HallType = 'timeline' | 'event' | 'worldview' | 'relation';

export interface Participant {
  id: string;
  name: string;
  role: string;
  status: 'active' | 'unknown' | 'deceased';
}

export interface EventNode {
  id: string;
  title: string;
  description: string;
  date: string;
  type: string;
}

export interface WorldLayer {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  metadata?: Record<string, string>;
  imageUrl?: string;
}
