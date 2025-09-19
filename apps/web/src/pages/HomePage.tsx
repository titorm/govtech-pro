import React from 'react';
import { Link } from '@tanstack/react-router';
import {
  ClipboardDocumentListIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
  ClockIcon,
  UserGroupIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

const features = [
  {
    name: 'Serviços Digitais',
    description: 'Acesse todos os serviços públicos de forma digital, sem sair de casa.',
    icon: ClipboardDocumentListIcon,
  },
  {
    name: 'Protocolo Digital',
    description: 'Acompanhe seus pedidos em tempo real com nosso sistema de protocolos.',
    icon: DocumentTextIcon,
  },
  {
    name: 'Segurança Gov.br',
    description: 'Autenticação segura integrada com a plataforma Gov.br do governo federal.',
    icon: ShieldCheckIcon,
  },
  {
    name: 'Atendimento 24/7',
    description: 'Serviços disponíveis 24 horas por dia, 7 dias por semana.',
    icon: ClockIcon,
  },
  {
    name: 'Suporte Especializado',
    description: 'Equipe especializada para ajudar você em todas as etapas.',
    icon: UserGroupIcon,
  },
  {
    name: 'Transparência Total',
    description: 'Acompanhe o andamento de seus processos com total transparência.',
    icon: ChartBarIcon,
  },
];

const stats = [
  { name: 'Serviços Disponíveis', value: '50+' },
  { name: 'Protocolos Processados', value: '10.000+' },
  { name: 'Cidadãos Atendidos', value: '5.000+' },
  { name: 'Satisfação', value: '98%' },
];

export function HomePage() {
  return (
    <div className="bg-white">
      {/* Hero section */}
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
          aria-hidden="true"
        >
          <div
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-citizen-primary to-citizen-secondary opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          />
        </div>

        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <div className="hidden sm:mb-8 sm:flex sm:justify-center">
            <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
              Modernizando a gestão pública brasileira.{' '}
              <Link to="/" className="font-semibold text-citizen-primary">
                <span className="absolute inset-0" aria-hidden="true" />
                Saiba mais <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </div>

          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl"
            >
              Portal do Cidadão
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mt-6 text-lg leading-8 text-gray-600"
            >
              Acesse serviços públicos de forma digital, rápida e segura. 
              Tudo que você precisa em um só lugar, com a praticidade que você merece.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-10 flex items-center justify-center gap-x-6"
            >
              <Link
                to="/register"
                className="citizen-button-primary"
              >
                Criar Conta
              </Link>
              
              <Link
                to="/login"
                className="text-sm font-semibold leading-6 text-gray-900 hover:text-citizen-primary transition-colors duration-200"
              >
                Já tenho conta <span aria-hidden="true">→</span>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-8"
            >
              <Link
                to="/track"
                className="inline-flex items-center text-sm font-medium text-citizen-primary hover:text-citizen-primary/80 transition-colors duration-200"
              >
                <DocumentTextIcon className="h-4 w-4 mr-2" />
                Rastrear protocolo sem login
              </Link>
            </motion.div>
          </div>
        </div>

        <div
          className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
          aria-hidden="true"
        >
          <div
            className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-citizen-secondary to-citizen-accent opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          />
        </div>
      </div>

      {/* Stats section */}
      <div className="bg-citizen-gradient py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <dl className="grid grid-cols-1 gap-x-8 gap-y-16 text-center lg:grid-cols-4">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="mx-auto flex max-w-xs flex-col gap-y-4"
              >
                <dt className="text-base leading-7 text-white/80">{stat.name}</dt>
                <dd className="order-first text-3xl font-semibold tracking-tight text-white sm:text-5xl">
                  {stat.value}
                </dd>
              </motion.div>
            ))}
          </dl>
        </div>
      </div>

      {/* Features section */}
      <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-citizen-primary">
              Serviços Digitais
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Tudo que você precisa em um só lugar
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Nossa plataforma oferece uma experiência completa e integrada para 
              acessar todos os serviços públicos municipais de forma digital.
            </p>
          </div>

          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="relative pl-16"
                >
                  <dt className="text-base font-semibold leading-7 text-gray-900">
                    <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-citizen-primary">
                      <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                    </div>
                    {feature.name}
                  </dt>
                  <dd className="mt-2 text-base leading-7 text-gray-600">
                    {feature.description}
                  </dd>
                </motion.div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* CTA section */}
      <div className="bg-citizen-gradient-light">
        <div className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Pronto para começar?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-600">
              Crie sua conta agora e tenha acesso a todos os serviços públicos 
              de forma digital e segura.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                to="/register"
                className="citizen-button-primary"
              >
                Criar Conta Gratuita
              </Link>
              <Link
                to="/_authenticated/services"
                className="citizen-button-secondary"
              >
                Ver Serviços Disponíveis
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}