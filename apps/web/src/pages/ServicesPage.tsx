import React from 'react';
import { motion } from 'framer-motion';
import { ClipboardDocumentListIcon } from '@heroicons/react/24/outline';

export function ServicesPage() {
  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <ClipboardDocumentListIcon className="mx-auto h-12 w-12 text-citizen-primary" />
        <h1 className="mt-4 text-3xl font-bold text-gray-900">
          Serviços Públicos
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          Acesse todos os serviços disponíveis de forma digital
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
          A página de serviços está sendo desenvolvida. Em breve você poderá acessar todos os serviços públicos digitais.
        </p>
        <div className="space-y-2 text-sm text-gray-500">
          <p>• Alvará de Funcionamento</p>
          <p>• Certidão Negativa de Débitos</p>
          <p>• Licenças e Permissões</p>
          <p>• E muito mais...</p>
        </div>
      </motion.div>
    </div>
  );
}