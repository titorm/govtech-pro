import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { MagnifyingGlassIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { apiHelpers } from '@/lib/api';
import { formatDate } from '@govtech-pro/utils';
import toast from 'react-hot-toast';

const trackSchema = z.object({
  protocolNumber: z.string().min(1, 'Número do protocolo é obrigatório'),
});

type TrackForm = z.infer<typeof trackSchema>;

export function TrackProtocolPage() {
  const [protocol, setProtocol] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TrackForm>({
    resolver: zodResolver(trackSchema),
  });

  const onSubmit = async (data: TrackForm) => {
    try {
      setIsLoading(true);
      const response = await apiHelpers.trackProtocol(data.protocolNumber);
      
      if (response.data.success) {
        setProtocol(response.data.data);
      }
    } catch (error: any) {
      const message = error.response?.data?.error || 'Protocolo não encontrado';
      toast.error(message);
      setProtocol(null);
    } finally {
      setIsLoading(false);
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
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <DocumentTextIcon className="mx-auto h-12 w-12 text-citizen-primary" />
          <h1 className="mt-4 text-3xl font-bold text-gray-900">
            Rastrear Protocolo
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Acompanhe o andamento da sua solicitação em tempo real
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="citizen-card mb-8"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="protocolNumber" className="block text-sm font-medium text-gray-700 mb-2">
                Número do Protocolo
              </label>
              <div className="flex space-x-3">
                <input
                  {...register('protocolNumber')}
                  type="text"
                  placeholder="Ex: 2024.123456.789"
                  className={`citizen-input flex-1 ${errors.protocolNumber ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="citizen-button-primary flex items-center"
                >
                  {isLoading ? (
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <MagnifyingGlassIcon className="h-5 w-5" />
                  )}
                  <span className="ml-2">Buscar</span>
                </button>
              </div>
              {errors.protocolNumber && (
                <p className="mt-1 text-sm text-red-600">{errors.protocolNumber.message}</p>
              )}
            </div>
          </form>
        </motion.div>

        {protocol && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {/* Protocol info */}
            <div className="citizen-card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Protocolo {protocol.protocol.number}
                </h2>
                <span className={`citizen-badge protocol-status-${protocol.protocol.status}`}>
                  {getStatusLabel(protocol.protocol.status)}
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-700">Assunto</h3>
                  <p className="mt-1 text-sm text-gray-900">{protocol.protocol.subject}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-700">Prioridade</h3>
                  <p className="mt-1 text-sm text-gray-900 capitalize">{protocol.protocol.priority}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-700">Data de Criação</h3>
                  <p className="mt-1 text-sm text-gray-900">{formatDate(protocol.protocol.createdAt)}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-700">Última Atualização</h3>
                  <p className="mt-1 text-sm text-gray-900">{formatDate(protocol.protocol.updatedAt)}</p>
                </div>
              </div>
            </div>

            {/* Responses */}
            {protocol.responses && protocol.responses.length > 0 && (
              <div className="citizen-card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Atualizações do Protocolo
                </h3>
                <div className="space-y-4">
                  {protocol.responses.map((response: any) => (
                    <div key={response.id} className="border-l-4 border-citizen-primary pl-4">
                      <p className="text-sm text-gray-900">{response.message}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDate(response.createdAt)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Help section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 text-center"
        >
          <p className="text-sm text-gray-600 mb-4">
            Não encontrou seu protocolo ou precisa de mais informações?
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <a
              href="/help"
              className="citizen-button-secondary"
            >
              Central de Ajuda
            </a>
            <a
              href="https://wa.me/5511999999999"
              target="_blank"
              rel="noopener noreferrer"
              className="citizen-button-primary"
            >
              Falar no WhatsApp
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}