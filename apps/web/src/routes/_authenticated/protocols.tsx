import { createFileRoute } from '@tanstack/react-router';
import { ProtocolsPage } from '@/pages/ProtocolsPage';

export const Route = createFileRoute('/_authenticated/protocols')({
  component: ProtocolsPage,
});