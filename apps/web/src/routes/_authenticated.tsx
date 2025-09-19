import { createFileRoute, redirect, Outlet } from '@tanstack/react-router';
import { Layout } from '@/components/Layout';
import { useAuth } from '@/lib/auth';

function AuthenticatedLayout() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-citizen-primary"></div>
      </div>
    );
  }

  if (!user) {
    throw redirect({
      to: '/login',
    });
  }

  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}

export const Route = createFileRoute('/_authenticated')({
  component: AuthenticatedLayout,
});