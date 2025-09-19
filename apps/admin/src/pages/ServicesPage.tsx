import React from 'react';
import { motion } from 'framer-motion';
import { ClipboardDocumentListIcon } from '@heroicons/react/24/outline';

export function ServicesPage() {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <ClipboardDocumentListIcon className="mx-auto h-12 w-12 text-admin-primary" />
        <h1 className="mt-4 text-3xl font-bold text-neutral-900">
          Gestão de Serviços
        </h1>
        <p className="mt-2 text-lg text-neutral-600">
          Configure e gerencie os serviços públicos disponíveis
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="admin-card text-center py-12"
      >
        <h2 className="text-xl font-semibold text-neutral-900 mb-4">
          Em Desenvolvimento
        </h2>
        <p className="text-neutral-600 mb-6">
          A gestão de serviços está sendo desenvolvida.
        </p>
      </motion.div>
    </div>
  );
}