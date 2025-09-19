import { createFileRoute, redirect, Outlet } from '@tanstack/react-router';
import { AdminLayout } from '@/components/AdminLayout';
import { useAuth } from '@/lib/auth';

function AuthenticatedAdminLayout() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-admin-primary"></div>
      </div>
    );
  }

  if (!user) {
    throw redirect({
      to: '/login',
    });
  }

  // Check if user has admin privileges
  if (!['admin', 'manager', 'operator'].includes(user.role)) {
    throw new Error('Acesso negado. Você não tem permissão para acessar o painel administrativo.');
  }

  return (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  );
}

export const Route = createFileRoute('/_authenticated')({
  component: AuthenticatedAdminLayout,
});