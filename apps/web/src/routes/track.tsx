import { createFileRoute } from '@tanstack/react-router';
import { TrackProtocolPage } from '@/pages/TrackProtocolPage';

export const Route = createFileRoute('/track')({
  component: TrackProtocolPage,
});