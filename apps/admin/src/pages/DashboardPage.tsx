import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  UsersIcon,
  DocumentTextIcon,
  ClipboardDocumentListIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import { useAuth } from '@/lib/auth';
import { adminApiHelpers } from '@/lib/api';
import { formatNameForDisplay, formatDate } from '@govtech-pro/utils';

// Mock data for charts (replace with real API data)
const protocolsByStatusData = [
  { name: 'Recebidos', value: 45, color: '#3b82f6' },
  { name: 'Em Análise', value: 32, color: '#f59e0b' },
  { name: 'Em Andamento', value: 28, color: '#8b5cf6' },
  { name: 'Resolvidos', value: 95, color: '#10b981' },
];

const monthlyProtocolsData = [
  { month: 'Jan', protocols: 65 },
  { month: 'Fev', protocols: 78 },
  { month: 'Mar', protocols: 90 },
  { month: 'Abr', protocols: 85 },
  { month: 'Mai', protocols: 102 },
  { month: 'Jun', protocols: 120 },
];

export function DashboardPage() {
  const { user } = useAuth();

  // Fetch dashboard metrics
  const { data: metrics, isLoading } = useQuery({
    queryKey: ['dashboard-metrics'],
    queryFn: () => adminApiHelpers.getDashboardMetrics(),
  });

  const dashboardData = metrics?.data?.data || {};

  const MetricCard = ({ 
    title, 
    value, 
    change, 
    changeType, 
    icon: Icon, 
    color 
  }: {
    title: string;
    value: string | number;
    change?: string;
    changeType?: 'positive' | 'negative' | 'neutral';
    icon: React.ElementType;
    color: string;
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="metric-card"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="metric-label">{title}</p>
          <p className="metric-value">{value}</p>
          {change && (
            <div className="flex items-center mt-1">
              {changeType === 'positive' && <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />}
              {changeType === 'negative' && <ArrowTrendingDownIcon className="h-4 w-4 text-red-500 mr-1" />}
              <span className={`metric-change-${changeType}`}>
                {change}
              </span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-8">
      {/* Welcome section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="admin-card p-6 bg-gradient-to-r from-admin-primary to-admin-secondary text-white">
          <h1 className="text-2xl font-bold mb-2">
            Bem-vindo(a), {user?.name ? formatNameForDisplay(user.name.split(' ')[0]) : 'Administrador'}!
          </h1>
          <p className="text-white/90">
            Painel de controle para gestão dos serviços públicos digitais.
          </p>
          <div className="mt-4 flex items-center text-sm text-white/80">
            <ClockIcon className="h-4 w-4 mr-2" />
            Última atualização: {formatDate(new Date())}
          </div>
        </div>
      </motion.div>

      {/* Metrics cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total de Protocolos"
          value={dashboardData.metrics?.totalProtocols || 0}
          change="+12% este mês"
          changeType="positive"
          icon={DocumentTextIcon}
          color="bg-blue-500"
        />
        <MetricCard
          title="Usuários Ativos"
          value={dashboardData.metrics?.activeUsers || 0}
          change="+8% este mês"
          changeType="positive"
          icon={UsersIcon}
          color="bg-green-500"
        />
        <MetricCard
          title="Serviços Disponíveis"
          value="24"
          change="2 novos"
          changeType="positive"
          icon={ClipboardDocumentListIcon}
          color="bg-purple-500"
        />
        <MetricCard
          title="Taxa de Resolução"
          value="94%"
          change="+2% este mês"
          changeType="positive"
          icon={ChartBarIcon}
          color="bg-orange-500"
        />
      </div>

      {/* Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Protocols by status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="admin-card"
        >
          <div className="admin-card-header">
            <h3 className="text-lg font-semibold text-neutral-900">
              Protocolos por Status
            </h3>
          </div>
          <div className="admin-card-body">
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={protocolsByStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {protocolsByStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="chart-legend">
              {protocolsByStatusData.map((item, index) => (
                <div key={index} className="chart-legend-item">
                  <div 
                    className="chart-legend-color" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span>{item.name}: {item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Monthly protocols trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="admin-card"
        >
          <div className="admin-card-header">
            <h3 className="text-lg font-semibold text-neutral-900">
              Protocolos por Mês
            </h3>
          </div>
          <div className="admin-card-body">
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyProtocolsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="protocols" 
                    stroke="#1e40af" 
                    strokeWidth={3}
                    dot={{ fill: '#1e40af', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recent activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="admin-card"
      >
        <div className="admin-card-header">
          <h3 className="text-lg font-semibold text-neutral-900">
            Atividade Recente
          </h3>
        </div>
        <div className="admin-card-body">
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="flex items-center space-x-4">
                    <div className="admin-skeleton h-10 w-10 rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      <div className="admin-skeleton-title"></div>
                      <div className="admin-skeleton-text w-2/3"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : dashboardData.recentProtocols?.length > 0 ? (
            <div className="space-y-4">
              {dashboardData.recentProtocols.map((protocol: any) => (
                <div key={protocol.id} className="flex items-center justify-between p-4 border border-neutral-100 rounded-lg hover:bg-neutral-50 transition-colors duration-200">
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 rounded-full bg-admin-primary/10 flex items-center justify-center">
                      <DocumentTextIcon className="h-5 w-5 text-admin-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium text-neutral-900">
                        Protocolo {protocol.number}
                      </h4>
                      <p className="text-sm text-neutral-600 truncate max-w-md">
                        {protocol.subject}
                      </p>
                      <p className="text-xs text-neutral-500">
                        {formatDate(protocol.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`admin-badge admin-badge-${protocol.status === 'resolved' ? 'success' : protocol.status === 'in_progress' ? 'warning' : 'info'}`}>
                      {protocol.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <DocumentTextIcon className="mx-auto h-12 w-12 text-neutral-400" />
              <h3 className="mt-2 text-sm font-medium text-neutral-900">Nenhuma atividade recente</h3>
              <p className="mt-1 text-sm text-neutral-500">
                As atividades recentes aparecerão aqui.
              </p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Quick actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <div className="admin-card p-6 text-center">
          <UsersIcon className="mx-auto h-8 w-8 text-admin-primary mb-4" />
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">
            Gerenciar Usuários
          </h3>
          <p className="text-sm text-neutral-600 mb-4">
            Visualize e gerencie todos os usuários do sistema.
          </p>
          <button className="admin-button-primary w-full">
            Acessar Usuários
          </button>
        </div>

        <div className="admin-card p-6 text-center">
          <ChartBarIcon className="mx-auto h-8 w-8 text-admin-primary mb-4" />
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">
            Relatórios
          </h3>
          <p className="text-sm text-neutral-600 mb-4">
            Gere relatórios detalhados para análise e compliance.
          </p>
          <button className="admin-button-primary w-full">
            Ver Relatórios
          </button>
        </div>

        <div className="admin-card p-6 text-center">
          <ClipboardDocumentListIcon className="mx-auto h-8 w-8 text-admin-primary mb-4" />
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">
            Configurar Serviços
          </h3>
          <p className="text-sm text-neutral-600 mb-4">
            Configure e gerencie os serviços públicos disponíveis.
          </p>
          <button className="admin-button-primary w-full">
            Gerenciar Serviços
          </button>
        </div>
      </motion.div>
    </div>
  );
}