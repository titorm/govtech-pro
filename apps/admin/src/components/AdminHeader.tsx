import React from 'react';
import { Link } from '@tanstack/react-router';
import { 
  Bars3Icon, 
  BellIcon, 
  UserCircleIcon,
  ChevronDownIcon,
  CogIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';
import { Menu, Transition } from '@headlessui/react';
import { useAuth } from '@/lib/auth';
import { formatNameForDisplay } from '@govtech-pro/utils';
import clsx from 'clsx';

interface AdminHeaderProps {
  onMenuClick: () => void;
}

export function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  const { user, logout } = useAuth();

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      admin: 'Administrador',
      manager: 'Gestor',
      operator: 'Operador',
    };
    return labels[role] || role;
  };

  return (
    <header className="admin-header">
      <div className="flex h-16 justify-between items-center">
        {/* Mobile menu button */}
        <div className="flex items-center lg:hidden">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md p-2 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-admin-primary focus:ring-offset-2"
            onClick={onMenuClick}
          >
            <span className="sr-only">Abrir menu</span>
            <Bars3Icon className="h-6 w-6" />
          </button>
        </div>

        {/* Logo and title */}
        <div className="flex items-center">
          <Link to="/_authenticated/dashboard" className="flex items-center">
            <img
              className="h-8 w-auto"
              src="/logo.svg"
              alt="GovTech Pro"
            />
            <div className="ml-3 hidden sm:block">
              <span className="text-xl font-semibold text-admin-primary">
                GovTech Pro
              </span>
              <p className="text-sm text-neutral-600">
                Painel Administrativo
              </p>
            </div>
          </Link>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button
            type="button"
            className="relative rounded-full bg-white p-1 text-neutral-400 hover:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-admin-primary focus:ring-offset-2"
          >
            <span className="sr-only">Ver notificações</span>
            <BellIcon className="h-6 w-6" />
            {/* Notification badge */}
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              3
            </span>
          </button>

          {/* Profile dropdown */}
          <Menu as="div" className="relative">
            <div>
              <Menu.Button className="flex items-center rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-admin-primary focus:ring-offset-2">
                <span className="sr-only">Abrir menu do usuário</span>
                <div className="flex items-center space-x-3">
                  <UserCircleIcon className="h-8 w-8 text-neutral-400" />
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium text-neutral-900">
                      {user?.name ? formatNameForDisplay(user.name) : 'Usuário'}
                    </p>
                    <p className="text-xs text-neutral-500">
                      {user?.role ? getRoleLabel(user.role) : 'Carregando...'}
                    </p>
                  </div>
                  <ChevronDownIcon className="h-4 w-4 text-neutral-400" />
                </div>
              </Menu.Button>
            </div>
            
            <Transition
              as={React.Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <Menu.Item>
                  {({ active }) => (
                    <Link
                      to="/_authenticated/settings"
                      className={clsx(
                        active ? 'bg-neutral-100' : '',
                        'flex items-center px-4 py-2 text-sm text-neutral-700'
                      )}
                    >
                      <CogIcon className="h-4 w-4 mr-3" />
                      Configurações
                    </Link>
                  )}
                </Menu.Item>
                
                <div className="border-t border-neutral-100 my-1" />
                
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={logout}
                      className={clsx(
                        active ? 'bg-neutral-100' : '',
                        'flex items-center w-full text-left px-4 py-2 text-sm text-neutral-700'
                      )}
                    >
                      <ArrowRightOnRectangleIcon className="h-4 w-4 mr-3" />
                      Sair
                    </button>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>
    </header>
  );
}