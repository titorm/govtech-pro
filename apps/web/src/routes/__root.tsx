import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { AuthProvider } from '@/lib/auth';
import { ErrorBoundary } from '@/components/ErrorBoundary';

export const Route = createRootRoute({
  component: () => (
    <AuthProvider>
      <ErrorBoundary>
        <div className="min-h-screen bg-gray-50">
          <Outlet />
        </div>
        {process.env.NODE_ENV === 'development' && <TanStackRouterDevtools />}
      </ErrorBoundary>
    </AuthProvider>
  ),
});