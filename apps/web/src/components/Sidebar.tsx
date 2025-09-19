import React from 'react';
import { Link, useLocation } from '@tanstack/react-router';
import { Dialog, Transition } from '@headlessui/react';
import {
  XMarkIcon,
  HomeIcon,
  DocumentTextIcon,
  ClipboardDocumentListIcon,
  UserIcon,
  CogIcon,
  QuestionMarkCircleIcon,
} from '@heroicons/react/24/outline';
import clsx from 'clsx';

interface SidebarProps {
  open?: boolean;
  onClose?: () => void;
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Serviços', href: '/services', icon: ClipboardDocumentListIcon },
  { name: 'Meus Protocolos', href: '/protocols', icon: DocumentTextIcon },
  { name: 'Meu Perfil', href: '/profile', icon: UserIcon },
];

const secondaryNavigation = [
  { name: 'Configurações', href: '/settings', icon: CogIcon },
  { name: 'Ajuda', href: '/help', icon: QuestionMarkCircleIcon },
];

export function Sidebar({ open, onClose }: SidebarProps) {
  const location = useLocation();

  const SidebarContent = () => (
    <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4">
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center">
        <img
          className="h-8 w-auto"
          src="/logo.svg"
          alt="GovTech Pro"
        />
        <span className="ml-2 text-lg font-semibold text-citizen-primary">
          Portal do Cidadão
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className={clsx(
                      location.pathname === item.href
                        ? 'bg-citizen-primary/10 text-citizen-primary border-r-2 border-citizen-primary'
                        : 'text-gray-700 hover:text-citizen-primary hover:bg-gray-50',
                      'group flex gap-x-3 rounded-l-md p-2 text-sm leading-6 font-medium transition-colors duration-200'
                    )}
                  >
                    <item.icon
                      className={clsx(
                        location.pathname === item.href
                          ? 'text-citizen-primary'
                          : 'text-gray-400 group-hover:text-citizen-primary',
                        'h-6 w-6 shrink-0'
                      )}
                    />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </li>

          {/* Secondary navigation */}
          <li className="mt-auto">
            <ul role="list" className="-mx-2 space-y-1">
              {secondaryNavigation.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className={clsx(
                      location.pathname === item.href
                        ? 'bg-gray-100 text-gray-900'
                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50',
                      'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-medium'
                    )}
                  >
                    <item.icon
                      className={clsx(
                        location.pathname === item.href
                          ? 'text-gray-900'
                          : 'text-gray-400 group-hover:text-gray-900',
                        'h-6 w-6 shrink-0'
                      )}
                    />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        </ul>
      </nav>

      {/* Footer info */}
      <div className="border-t border-gray-200 pt-4">
        <div className="text-xs text-gray-500 space-y-1">
          <p>GovTech Pro v1.0.0</p>
          <p>Modernizando a gestão pública</p>
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
            <div className="fixed inset-0 bg-gray-900/80" />
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
    <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6">
      <SidebarContent />
    </div>
  );
}