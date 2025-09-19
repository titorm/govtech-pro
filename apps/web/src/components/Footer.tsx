import React from 'react';
import { Link } from '@tanstack/react-router';

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Left side - Logo and description */}
          <div className="flex items-center space-x-4">
            <img
              className="h-6 w-auto"
              src="/logo.svg"
              alt="GovTech Pro"
            />
            <div className="text-sm text-gray-600">
              <p>Portal do Cidadão - GovTech Pro</p>
              <p>Modernizando a gestão pública brasileira</p>
            </div>
          </div>

          {/* Center - Links */}
          <div className="flex flex-wrap justify-center space-x-6 text-sm">
            <Link
              to="/track"
              className="text-gray-600 hover:text-citizen-primary transition-colors duration-200"
            >
              Rastrear Protocolo
            </Link>
            <a
              href="/privacy"
              className="text-gray-600 hover:text-citizen-primary transition-colors duration-200"
            >
              Privacidade
            </a>
            <a
              href="/terms"
              className="text-gray-600 hover:text-citizen-primary transition-colors duration-200"
            >
              Termos de Uso
            </a>
            <a
              href="/accessibility"
              className="text-gray-600 hover:text-citizen-primary transition-colors duration-200"
            >
              Acessibilidade
            </a>
            <a
              href="/help"
              className="text-gray-600 hover:text-citizen-primary transition-colors duration-200"
            >
              Ajuda
            </a>
          </div>

          {/* Right side - Gov.br and compliance */}
          <div className="flex flex-col items-center md:items-end space-y-2">
            <div className="flex items-center space-x-2">
              <img
                src="/govbr-logo.svg"
                alt="Gov.br"
                className="h-4 w-auto"
              />
              <span className="text-xs text-gray-500">Integração Gov.br</span>
            </div>
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <span>LGPD Compliant</span>
              <span>•</span>
              <span>ICP-Brasil</span>
              <span>•</span>
              <span>TCU/TCE</span>
            </div>
          </div>
        </div>

        {/* Bottom row - Copyright and version */}
        <div className="mt-6 pt-4 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
          <p>
            © {new Date().getFullYear()} GovTech Pro. Todos os direitos reservados.
          </p>
          <div className="flex items-center space-x-4 mt-2 md:mt-0">
            <span>Versão 1.0.0</span>
            <span>•</span>
            <span>Última atualização: {new Date().toLocaleDateString('pt-BR')}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}