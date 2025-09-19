import React from 'react';
import { motion } from 'framer-motion';
import { UsersIcon, UserPlusIcon, FunnelIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export function UsersPage() {
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
          <h1 className="admin-header-title">Gestão de Usuários</h1>
          <p className="admin-header-subtitle">
            Gerencie usuários, permissões e acessos
          </p>
        </div>
        <div className="flex space-x-3">
          <button className="admin-button-secondary flex items-center">
            <FunnelIcon className="h-4 w-4 mr-2" />
            Filtros
          </button>
          <button className="admin-button-primary flex items-center">
            <UserPlusIcon className="h-4 w-4 mr-2" />
            Novo Usuário
          </button>
        </div>
      </motion.div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="metric-card"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="metric-label">Total de Usuários</p>
              <p className="metric-value">1,234</p>
            </div>
            <div className="p-3 rounded-lg bg-blue-500">
              <UsersIcon className="h-6 w-6 text-white" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="metric-card"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="metric-label">Usuários Ativos</p>
              <p className="metric-value">1,180</p>
            </div>
            <div className="p-3 rounded-lg bg-green-500">
              <UsersIcon className="h-6 w-6 text-white" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="metric-card"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="metric-label">Novos Este Mês</p>
              <p className="metric-value">87</p>
            </div>
            <div className="p-3 rounded-lg bg-purple-500">
              <UserPlusIcon className="h-6 w-6 text-white" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="metric-card"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="metric-label">Administradores</p>
              <p className="metric-value">12</p>
            </div>
            <div className="p-3 rounded-lg bg-orange-500">
              <UsersIcon className="h-6 w-6 text-white" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Search and filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="admin-card p-6"
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
            <input
              type="text"
              placeholder="Buscar por nome, email ou CPF..."
              className="admin-input pl-10"
            />
          </div>
          <select className="admin-select">
            <option value="">Todos os status</option>
            <option value="active">Ativo</option>
            <option value="inactive">Inativo</option>
            <option value="suspended">Suspenso</option>
          </select>
          <select className="admin-select">
            <option value="">Todas as funções</option>
            <option value="citizen">Cidadão</option>
            <option value="operator">Operador</option>
            <option value="manager">Gestor</option>
            <option value="admin">Administrador</option>
          </select>
        </div>
      </motion.div>

      {/* Users table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="admin-card"
      >
        <div className="admin-card-header">
          <h3 className="text-lg font-semibold text-neutral-900">
            Lista de Usuários
          </h3>
        </div>
        <div className="admin-card-body p-0">
          <div className="text-center py-12">
            <UsersIcon className="mx-auto h-12 w-12 text-neutral-400" />
            <h3 className="mt-2 text-lg font-semibold text-neutral-900">
              Em Desenvolvimento
            </h3>
            <p className="mt-1 text-neutral-600">
              A gestão de usuários está sendo desenvolvida. Em breve você poderá:
            </p>
            <div className="mt-4 space-y-2 text-sm text-neutral-500">
              <p>• Visualizar todos os usuários em uma tabela interativa</p>
              <p>• Filtrar por status, função e data de cadastro</p>
              <p>• Alterar status e permissões de usuários</p>
              <p>• Criar novos usuários administrativos</p>
              <p>• Exportar relatórios de usuários</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}