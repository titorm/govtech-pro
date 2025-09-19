import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { EyeIcon, EyeSlashIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/lib/auth';
import { validateCPF, formatCPF } from '@govtech-pro/utils';

const loginSchema = z.object({
  cpf: z.string().refine(validateCPF, 'CPF inválido'),
  password: z.string().min(8, 'Senha deve ter pelo menos 8 caracteres'),
});

type LoginForm = z.infer<typeof loginSchema>;

export function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const [showPassword, setShowPassword] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const cpfValue = watch('cpf');

  // Format CPF as user types
  React.useEffect(() => {
    if (cpfValue) {
      const formatted = formatCPF(cpfValue);
      if (formatted !== cpfValue) {
        setValue('cpf', formatted);
      }
    }
  }, [cpfValue, setValue]);

  const onSubmit = async (data: LoginForm) => {
    try {
      await login(data.cpf, data.password);
      navigate({ to: '/_authenticated/dashboard' });
    } catch (error) {
      // Error is handled by the auth context
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-admin-primary/10 mb-6">
              <ShieldCheckIcon className="h-8 w-8 text-admin-primary" />
            </div>
            
            <img
              className="mx-auto h-10 w-auto mb-4"
              src="/logo.svg"
              alt="GovTech Pro"
            />
            
            <h2 className="text-3xl font-bold text-neutral-900">
              Painel Administrativo
            </h2>
            <p className="mt-2 text-sm text-neutral-600">
              Acesso restrito para administradores, gestores e operadores
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="admin-card p-8"
        >
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="admin-form-group">
              <label htmlFor="cpf" className="admin-form-label">
                CPF
              </label>
              <input
                {...register('cpf')}
                type="text"
                autoComplete="username"
                placeholder="000.000.000-00"
                className={`admin-input ${errors.cpf ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
              />
              {errors.cpf && (
                <p className="admin-form-error">{errors.cpf.message}</p>
              )}
            </div>

            <div className="admin-form-group">
              <label htmlFor="password" className="admin-form-label">
                Senha
              </label>
              <div className="relative">
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Digite sua senha"
                  className={`admin-input pr-10 ${errors.password ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-neutral-400" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-neutral-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="admin-form-error">{errors.password.message}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="admin-checkbox"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-neutral-900">
                  Lembrar de mim
                </label>
              </div>

              <div className="text-sm">
                <a
                  href="/forgot-password"
                  className="font-medium text-admin-primary hover:text-admin-primary/80 transition-colors duration-200"
                >
                  Esqueceu a senha?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="admin-button-primary w-full flex justify-center items-center py-3"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Entrando...
                  </>
                ) : (
                  'Entrar no Sistema'
                )}
              </button>
            </div>
          </form>

          {/* Security notice */}
          <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-md">
            <div className="flex">
              <ShieldCheckIcon className="h-5 w-5 text-amber-400 mr-2 mt-0.5 shrink-0" />
              <div className="text-sm">
                <p className="text-amber-800 font-medium">Acesso Seguro</p>
                <p className="text-amber-700 mt-1">
                  Este sistema é monitorado. Todas as ações são registradas para auditoria.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Help section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <p className="text-sm text-neutral-600">
            Problemas para acessar?{' '}
            <a
              href="mailto:suporte@govtech-pro.com.br"
              className="font-medium text-admin-primary hover:text-admin-primary/80 transition-colors duration-200"
            >
              Contate o suporte técnico
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
}