import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  beforeLoad: () => {
    // Always redirect to dashboard - auth will be handled by the authenticated route
    throw redirect({
      to: '/_authenticated/dashboard',
    });
  },
});