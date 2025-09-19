import React from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error?: Error; resetError: () => void }>;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Admin Error caught by boundary:', error, errorInfo);
    
    // Log to monitoring service in production
    if (import.meta.env.PROD) {
      // TODO: Send to Sentry or other monitoring service
    }
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error} resetError={this.resetError} />;
      }

      return <DefaultErrorFallback error={this.state.error} resetError={this.resetError} />;
    }

    return this.props.children;
  }
}

function DefaultErrorFallback({ error, resetError }: { error?: Error; resetError: () => void }) {
  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full admin-card p-8 text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
          <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
        </div>
        
        <h1 className="text-lg font-semibold text-neutral-900 mb-2">
          Erro no Sistema Administrativo
        </h1>
        
        <p className="text-neutral-600 mb-6">
          Ocorreu um erro inesperado no painel administrativo. Nossa equipe técnica foi notificada.
        </p>
        
        {import.meta.env.DEV && error && (
          <details className="text-left mb-4 p-3 bg-neutral-100 rounded text-sm">
            <summary className="cursor-pointer font-medium text-neutral-700 mb-2">
              Detalhes técnicos (desenvolvimento)
            </summary>
            <pre className="whitespace-pre-wrap text-red-600 text-xs">
              {error.message}
              {error.stack && `\n\n${error.stack}`}
            </pre>
          </details>
        )}
        
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={resetError}
            className="admin-button-primary flex-1"
          >
            Tentar Novamente
          </button>
          
          <button
            onClick={() => window.location.href = '/dashboard'}
            className="admin-button-secondary flex-1"
          >
            Ir para Dashboard
          </button>
        </div>
        
        <p className="text-xs text-neutral-500 mt-4">
          Se o problema persistir, contate o suporte técnico.
        </p>
      </div>
    </div>
  );
}