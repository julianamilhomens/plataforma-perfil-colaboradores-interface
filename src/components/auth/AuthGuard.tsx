'use client'

import React, { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { UserRole } from '@/types'
import { Loader2, Users } from 'lucide-react'

interface AuthGuardProps {
  children: React.ReactNode
  requiredRole?: UserRole
  redirectTo?: string
}

export default function AuthGuard({ 
  children, 
  requiredRole, 
  redirectTo = '/login' 
}: AuthGuardProps) {
  const { isAuthenticated, user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!loading) {
      // Se não está autenticado, redireciona para login
      if (!isAuthenticated) {
        router.push(redirectTo)
        return
      }

      // Se tem role específico requerido, verifica permissão
      if (requiredRole && user?.role !== requiredRole) {
        // Redireciona para página não autorizada ou dashboard
        router.push('/dashboard')
        return
      }
    }
  }, [isAuthenticated, user, loading, requiredRole, router, redirectTo])

  // Mostra loading enquanto verifica autenticação
  if (loading) {
    return <LoadingScreen />
  }

  // Se não está autenticado, mostra loading (redirecionamento em andamento)
  if (!isAuthenticated) {
    return <LoadingScreen />
  }

  // Se tem role específico requerido e usuário não tem permissão
  if (requiredRole && user?.role !== requiredRole) {
    return <UnauthorizedScreen />
  }

  // Se tudo OK, renderiza children
  return <>{children}</>
}

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <div className="mx-auto h-16 w-16 bg-primary-600 rounded-full flex items-center justify-center mb-4 animate-pulse-soft">
          <Users className="h-8 w-8 text-white" />
        </div>
        
        <div className="flex items-center justify-center space-x-2">
          <Loader2 className="h-5 w-5 animate-spin text-primary-600" />
          <span className="text-gray-600 font-medium">
            Verificando acesso...
          </span>
        </div>
        
        <p className="mt-2 text-sm text-gray-500">
          Por favor, aguarde
        </p>
      </div>
    </div>
  )
}

function UnauthorizedScreen() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
        <div className="mx-auto h-12 w-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <svg 
            className="h-6 w-6 text-red-600" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" 
            />
          </svg>
        </div>
        
        <h1 className="text-xl font-semibold text-gray-900 mb-2">
          Acesso Negado
        </h1>
        
        <p className="text-gray-600 mb-6">
          Você não tem permissão para acessar esta página.
        </p>
        
        <button
          onClick={() => router.push('/dashboard')}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Voltar ao Dashboard
        </button>
      </div>
    </div>
  )
}

// Hook para verificar permissões
export function usePermissions() {
  const { user, isManager } = useAuth()

  const can = {
    // Permissões de usuários
    createUser: isManager,
    updateUser: (userId?: string) => isManager || user?.id === userId,
    deleteUser: isManager,
    viewUserDetails: true,
    viewUserSalary: isManager, // Apenas gestores veem dados sensíveis

    // Permissões de projetos
    createProject: isManager,
    updateProject: isManager,
    deleteProject: isManager,
    viewProjects: true,
    assignUsers: isManager,

    // Permissões gerais
    accessReports: isManager,
    manageSettings: isManager,
  }

  return {
    can,
    isManager,
    user
  }
}