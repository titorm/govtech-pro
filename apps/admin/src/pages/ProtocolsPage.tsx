import React from 'react';
import { motion } from 'framer-motion';
import { DocumentTextIcon, FunnelIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export function ProtocolsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="admin-header-title">Gestão de Protocolos</h1>
          <p className="admin-header-subtitle">
            Gerencie todos os protocolos do sistema
          </p>
        </div>
        <div className="flex space-x-3">
          <button className="admin-button-secondary flex items-center">
            <FunnelIcon className="h-4 w-4 mr-2" />
            Filtros
          </button>
          <button className="admin-button-primary">
            Exportar Relatório
          </button>
        </div>
      </motion.div>

      {/* Search and filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="admin-card p-6"
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
            <input
              type="text"
              placeholder="Buscar por número, assunto ou solicitante..."
              className="admin-input pl-10"
            />
          </div>
          <select className="admin-select">
            <option value="">Todos os status</option>
            <option value="received">Recebidos</option>
            <option value="in_analysis">Em Análise</option>
            <option value="in_progress">Em Andamento</option>
            <option value="resolved">Resolvidos</option>
          </select>
          <select className="admin-select">
            <option value="">Todas as prioridades</option>
            <option value="low">Baixa</option>
            <option value="normal">Normal</option>
            <option value="high">Alta</option>
            <option value="urgent">Urgente</option>
          </select>
        </div>
      </motion.div>

      {/* Protocols table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="admin-card"
      >
        <div className="admin-card-header">
          <h3 className="text-lg font-semibold text-neutral-900">
            Lista de Protocolos
          </h3>
        </div>
        <div className="admin-card-body p-0">
          <div className="text-center py-12">
            <DocumentTextIcon className="mx-auto h-12 w-12 text-neutral-400" />
            <h3 className="mt-2 text-lg font-semibold text-neutral-900">
              Em Desenvolvimento
            </h3>
            <p className="mt-1 text-neutral-600">
              A gestão de protocolos está sendo desenvolvida. Em breve você poderá:
            </p>
            <div className="mt-4 space-y-2 text-sm text-neutral-500">
              <p>• Visualizar todos os protocolos em uma tabela interativa</p>
              <p>• Filtrar por status, prioridade, departamento e data</p>
              <p>• Atualizar status e atribuir responsáveis</p>
              <p>• Adicionar respostas e documentos</p>
              <p>• Exportar relatórios detalhados</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}