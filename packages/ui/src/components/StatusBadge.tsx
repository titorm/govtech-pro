import React from "react";
import { clsx } from "clsx";
import { ProtocolStatus, ServiceStatus } from "@govtech-pro/types";

export interface StatusBadgeProps {
  status: ProtocolStatus | ServiceStatus | string;
  size?: "sm" | "md" | "lg";
  variant?: "solid" | "outline" | "soft";
}

const statusConfig = {
  // Protocol statuses
  received: {
    label: "Recebido",
    color: "blue",
    icon: "📥",
  },
  in_analysis: {
    label: "Em Análise",
    color: "yellow",
    icon: "🔍",
  },
  pending_info: {
    label: "Aguardando Informações",
    color: "orange",
    icon: "⏳",
  },
  in_progress: {
    label: "Em Andamento",
    color: "purple",
    icon: "⚙️",
  },
  forwarded: {
    label: "Encaminhado",
    color: "indigo",
    icon: "↗️",
  },
  resolved: {
    label: "Resolvido",
    color: "green",
    icon: "✅",
  },
  closed: {
    label: "Fechado",
    color: "gray",
    icon: "🔒",
  },
  cancelled: {
    label: "Cancelado",
    color: "red",
    icon: "❌",
  },

  // Service statuses
  draft: {
    label: "Rascunho",
    color: "gray",
    icon: "📝",
  },
  submitted: {
    label: "Enviado",
    color: "blue",
    icon: "📤",
  },
  pending_documents: {
    label: "Aguardando Documentos",
    color: "orange",
    icon: "📄",
  },
  completed: {
    label: "Concluído",
    color: "green",
    icon: "✅",
  },
  rejected: {
    label: "Rejeitado",
    color: "red",
    icon: "❌",
  },
};

const colorVariants = {
  solid: {
    blue: "bg-blue-600 text-white",
    yellow: "bg-yellow-600 text-white",
    orange: "bg-orange-600 text-white",
    purple: "bg-purple-600 text-white",
    indigo: "bg-indigo-600 text-white",
    green: "bg-green-600 text-white",
    gray: "bg-gray-600 text-white",
    red: "bg-red-600 text-white",
  },
  outline: {
    blue: "border border-blue-600 text-blue-600",
    yellow: "border border-yellow-600 text-yellow-600",
    orange: "border border-orange-600 text-orange-600",
    purple: "border border-purple-600 text-purple-600",
    indigo: "border border-indigo-600 text-indigo-600",
    green: "border border-green-600 text-green-600",
    gray: "border border-gray-600 text-gray-600",
    red: "border border-red-600 text-red-600",
  },
  soft: {
    blue: "bg-blue-100 text-blue-800",
    yellow: "bg-yellow-100 text-yellow-800",
    orange: "bg-orange-100 text-orange-800",
    purple: "bg-purple-100 text-purple-800",
    indigo: "bg-indigo-100 text-indigo-800",
    green: "bg-green-100 text-green-800",
    gray: "bg-gray-100 text-gray-800",
    red: "bg-red-100 text-red-800",
  },
};

const sizeVariants = {
  sm: "px-2 py-1 text-xs",
  md: "px-2.5 py-1.5 text-sm",
  lg: "px-3 py-2 text-base",
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = "md",
  variant = "soft",
}) => {
  const config = statusConfig[status as keyof typeof statusConfig] || {
    label: status,
    color: "gray" as const,
    icon: "❓",
  };

  const badgeClasses = clsx(
    "inline-flex items-center font-medium rounded-full",
    sizeVariants[size],
    colorVariants[variant][config.color as keyof typeof colorVariants.solid]
  );

  return (
    <span className={badgeClasses}>
      <span className="mr-1" role="img" aria-label={config.label}>
        {config.icon}
      </span>
      {config.label}
    </span>
  );
};
