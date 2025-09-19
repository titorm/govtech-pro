import React from 'react';
import { Link } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import {
  ClipboardDocumentListIcon,
  DocumentTextIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/auth';
import { apiHelpers } from '@/lib/api';
import { formatNameForDisplay, formatDate } from '@govtech-pro/utils';

const quickActions = [
  {
    name: 'Novo Protocolo',
    description: 'Abrir uma nova solicitação',
    href: '/services',
    icon: ClipboardDocumentListIcon,
    color: 'bg-citizen-primary',
  },
  {
    name: 'Meus Protocolos',
    description: 'Ver protocolos em andamento',
    href: '/protocols',
    icon: DocumentTextIcon,
    color: 'bg-citizen-secondary',
  },
  {
    name: 'Rastrear Protocolo',
    description: 'Acompanhar andamento',
    href: '/track',
    icon: ClockIcon,
    color: 'bg-citizen-accent',
  },
];

export function DashboardPage() {
  const { user } = useAuth();

  // Fetch user's recent protocols
  const { data: protocols, isLoading } = useQuery({
    queryKey: ['protocols', 'recent'],
    queryFn: () => apiHelpers.getProtocols({ limit: 5 }),
  });

  const recentProtocols = protocols?.data?.data || [];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved':
      case 'completed':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'in_progress':
      case 'in_analysis':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
      case 'pending_info':
        return <ExclamationTriangleIcon className="h-5 w-5 text-orange-500" />;
      default:
        return <DocumentTextIcon className="h-5 w-5 text-blue-500" />;
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      received: 'Recebido',
      in_analysis: 'Em Análise',
      pending_info: 'Aguardando Informações',
      in_progress: 'Em Andamento',
      forwarded: 'Encaminhado',
      resolved: 'Resolvido',
      closed: 'Fechado',
      cancelled: 'Cancelado',
    };
    return labels[status] || status;
  };

  return (
    <div className="space-y-8">
      {/* Welcome section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-citizen-gradient rounded-xl p-6 text-white"
      >
        <h1 className="text-2xl font-bold mb-2">
          Bem-vindo(a), {user?.name ? formatNameForDisplay(user.name.split(' ')[0]) : 'Cidadão'}!
        </h1>
        <p className="text-white/90">
          Acesse todos os serviços públicos de forma digital e acompanhe seus protocolos em tempo real.
        </p>
      </motion.div>

      {/* Quick actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
            >
              <Link
                to={action.href}
                className="citizen-card hover:scale-105 transition-transform duration-200 block"
              >
                <div className="flex items-center space-x-4">
                  <div className={`${action.color} p-3 rounded-lg`}>
                    <action.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{action.name}</h3>
                    <p className="text-sm text-gray-600">{action.description}</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Recent protocols */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Protocolos Recentes</h2>
          <Link
            to="/_authenticated/protocols"
            className="text-sm font-medium text-citizen-primary hover:text-citizen-primary/80 transition-colors duration-200"
          >
            Ver todos →
          </Link>
        </div>

        <div className="citizen-card">
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="flex items-center space-x-4">
                    <div className="citizen-skeleton h-10 w-10 rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      <div className="citizen-skeleton-title"></div>
                      <div className="citizen-skeleton-text w-2/3"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : recentProtocols.length > 0 ? (
            <div className="space-y-4">
              {recentProtocols.map((protocol: any) => (
                <div key={protocol.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                  <div className="flex items-center space-x-4">
                    {getStatusIcon(protocol.status)}
                    <div>
                      <h3 className="font-medium text-gray-900">
                        Protocolo {protocol.number}
                      </h3>
                      <p className="text-sm text-gray-600 truncate max-w-md">
                        {protocol.subject}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDate(protocol.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`citizen-badge protocol-status-${protocol.status}`}>
                      {getStatusLabel(protocol.status)}
                    </span>
                    <Link
                      to="/_authenticated/protocols"
                      className="text-citizen-primary hover:text-citizen-primary/80 text-sm font-medium"
                    >
                      Ver detalhes
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum protocolo</h3>
              <p className="mt-1 text-sm text-gray-500">
                Você ainda não possui protocolos. Comece criando uma nova solicitação.
              </p>
              <div className="mt-6">
                <Link
                  to="/_authenticated/services"
                  className="citizen-button-primary"
                >
                  Criar primeiro protocolo
                </Link>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Help section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="bg-blue-50 rounded-xl p-6"
      >
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Precisa de ajuda?</h2>
        <p className="text-gray-600 mb-4">
          Nossa equipe está pronta para ajudar você a navegar pelos serviços públicos digitais.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href="/help"
            className="citizen-button-secondary text-center"
          >
            Central de Ajuda
          </a>
          <a
            href="https://wa.me/5511999999999"
            target="_blank"
            rel="noopener noreferrer"
            className="citizen-button-primary text-center"
          >
            WhatsApp Suporte
          </a>
        </div>
      </motion.div>
    </div>
  );
}