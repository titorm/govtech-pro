import React from 'react';

export function AdminFooter() {
  return (
    <footer className="bg-white border-t border-neutral-200 mt-auto">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
          {/* Left side - Copyright */}
          <div className="text-sm text-neutral-600">
            © {new Date().getFullYear()} GovTech Pro. Todos os direitos reservados.
          </div>

          {/* Center - Links */}
          <div className="flex space-x-6 text-sm">
            <a
              href="/privacy"
              className="text-neutral-600 hover:text-admin-primary transition-colors duration-200"
            >
              Privacidade
            </a>
            <a
              href="/terms"
              className="text-neutral-600 hover:text-admin-primary transition-colors duration-200"
            >
              Termos de Uso
            </a>
            <a
              href="/support"
              className="text-neutral-600 hover:text-admin-primary transition-colors duration-200"
            >
              Suporte
            </a>
          </div>

          {/* Right side - Version and status */}
          <div className="flex items-center space-x-4 text-sm text-neutral-500">
            <span>v1.0.0</span>
            <span>•</span>
            <div className="flex items-center space-x-1">
              <div className="h-2 w-2 bg-green-400 rounded-full"></div>
              <span>Sistema Online</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}