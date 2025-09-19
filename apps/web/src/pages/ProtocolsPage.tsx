import React from 'react';
import { motion } from 'framer-motion';
import { DocumentTextIcon } from '@heroicons/react/24/outline';

export function ProtocolsPage() {
  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <DocumentTextIcon className="mx-auto h-12 w-12 text-citizen-primary" />
        <h1 className="mt-4 text-3xl font-bold text-gray-900">
          Meus Protocolos
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          Acompanhe todas as suas solicitações em andamento
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="citizen-card text-center py-12"
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Em Desenvolvimento
        </h2>
        <p className="text-gray-600 mb-6">
          A página de protocolos está sendo desenvolvida. Em breve você poderá visualizar e gerenciar todos os seus protocolos.
        </p>
        <div className="space-y-2 text-sm text-gray-500">
          <p>• Visualizar protocolos em andamento</p>
          <p>• Acompanhar status em tempo real</p>
          <p>• Adicionar documentos complementares</p>
          <p>• Histórico completo de interações</p>
        </div>
      </motion.div>
    </div>
  );
}