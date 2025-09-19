import React from 'react';
import { Link, useLocation } from '@tanstack/react-router';
import { Dialog, Transition } from '@headlessui/react';
import {
  XMarkIcon,
  HomeIcon,
  DocumentTextIcon,
  UsersIcon,
  ClipboardDocumentListIcon,
  ChartBarIcon,
  CogIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '@/lib/auth';
import clsx from 'clsx';

interface AdminSidebarProps {
  open?: boolean;
  onClose?: () => void;
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon, roles: ['admin', 'manager', 'operator'] },
  { name: 'Protocolos', href: '/protocols', icon: DocumentTextIcon, roles: ['admin', 'manager', 'operator'] },
  { name: 'Usuários', href: '/users', icon: UsersIcon, roles: ['admin', 'manager'] },
  { name: 'Serviços', href: '/services', icon: ClipboardDocumentListIcon, roles: ['admin', 'manager'] },
  { name: 'Relatórios', href: '/reports', icon: ChartBarIcon, roles: ['admin', 'manager'] },
];

const adminNavigation = [
  { name: 'Configurações', href: '/settings', icon: CogIcon, roles: ['admin'] },
  { name: 'Auditoria', href: '/audit', icon: ShieldCheckIcon, roles: ['admin'] },
  { name: 'Sistema', href: '/system', icon: ExclamationTriangleIcon, roles: ['admin'] },
];

export function AdminSidebar({ open, onClose }: AdminSidebarProps) {
  const location = useLocation();
  const { user } = useAuth();

  const canAccess = (roles: string[]) => {
    return user?.role && roles.includes(user.role);
  };

  const SidebarContent = () => (
    <div className="admin-sidebar flex grow flex-col gap-y-5 overflow-y-auto px-6 pb-4">
      {/* Logo */}
      <div className="admin-sidebar-header">
        <div className="flex items-center">
          <img
            className="h-8 w-auto"
            src="/logo.svg"
            alt="GovTech Pro"
          />
          <div className="ml-3">
            <span className="text-lg font-semibold text-admin-primary">
              GovTech Pro
            </span>
            <p className="text-xs text-neutral-600">
              Painel Administrativo
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          {/* Main navigation */}
          <li>
            <ul role="list" className="admin-sidebar-nav">
              {navigation.map((item) => {
                if (!canAccess(item.roles)) return null;
                
                return (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className={clsx(
                        location.pathname === item.href
                          ? 'admin-sidebar-item-active'
                          : 'admin-sidebar-item-inactive'
                      )}
                    >
                      <item.icon className="h-5 w-5 mr-3 shrink-0" />
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </li>

          {/* Admin navigation */}
          {user?.role === 'admin' && (
            <li>
              <div className="text-xs font-semibold leading-6 text-neutral-400 uppercase tracking-wider mb-2 px-3">
                Administração
              </div>
              <ul role="list" className="admin-sidebar-nav">
                {adminNavigation.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className={clsx(
                        location.pathname === item.href
                          ? 'admin-sidebar-item-active'
                          : 'admin-sidebar-item-inactive'
                      )}
                    >
                      <item.icon className="h-5 w-5 mr-3 shrink-0" />
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          )}

          {/* User info */}
          <li className="mt-auto">
            <div className="border-t border-neutral-200 pt-4">
              <div className="flex items-center space-x-3 px-3 py-2">
                <div className="h-8 w-8 rounded-full bg-admin-primary/10 flex items-center justify-center">
                  <span className="text-sm font-medium text-admin-primary">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-neutral-900 truncate">
                    {user?.name || 'Usuário'}
                  </p>
                  <p className="text-xs text-neutral-500">
                    {user?.role === 'admin' && 'Administrador'}
                    {user?.role === 'manager' && 'Gestor'}
                    {user?.role === 'operator' && 'Operador'}
                  </p>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </nav>

      {/* Footer info */}
      <div className="border-t border-neutral-200 pt-4">
        <div className="text-xs text-neutral-500 space-y-1 px-3">
          <p>GovTech Pro Admin v1.0.0</p>
          <p>Sistema de Gestão Pública</p>
          <div className="flex items-center space-x-2 mt-2">
            <div className="h-2 w-2 bg-green-400 rounded-full"></div>
            <span>Sistema Online</span>
          </div>
        </div>
      </div>
    </div>
  );

  if (open !== undefined) {
    // Mobile sidebar
    return (
      <Transition.Root show={open} as={React.Fragment}>
        <Dialog as="div" className="relative z-50 lg:hidden" onClose={onClose!}>
          <Transition.Child
            as={React.Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-neutral-900/80" />
          </Transition.Child>

          <div className="fixed inset-0 flex">
            <Transition.Child
              as={React.Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                <Transition.Child
                  as={React.Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                    <button
                      type="button"
                      className="-m-2.5 p-2.5"
                      onClick={onClose}
                    >
                      <span className="sr-only">Fechar sidebar</span>
                      <XMarkIcon className="h-6 w-6 text-white" />
                    </button>
                  </div>
                </Transition.Child>
                
                <SidebarContent />
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    );
  }

  // Desktop sidebar
  return (
    <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-neutral-200 bg-white px-6">
      <SidebarContent />
    </div>
  );
}