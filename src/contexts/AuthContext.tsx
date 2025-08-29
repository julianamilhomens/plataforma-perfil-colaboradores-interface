'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, LoginCredentials, AuthUser } from '@/types'
import { api } from '@/lib/api'
import { useRouter } from 'next/navigation'

interface AuthContextType {
  user: User | null
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => void
  loading: boolean
  isAuthenticated: boolean
  isManager: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const TOKEN_KEY = 'auth_token'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const isAuthenticated = !!user
  const isManager = user?.role === 'MANAGER'

  // Carregar usuário do token ao inicializar
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = getStoredToken()
        if (token) {
          api.setAuthToken(token)
          const response = await api.get('/auth/validate')
          if (response.data.success) {
            setUser(response.data.data.user)
          } else {
            removeStoredToken()
          }
        }
      } catch (error) {
        console.error('Erro ao validar token:', error)
        removeStoredToken()
      } finally {
        setLoading(false)
      }
    }

    initAuth()
  }, [])

  const login = async (credentials: LoginCredentials) => {
    try {
      setLoading(true)
      const response = await api.post('/auth/login', credentials)
      
      if (response.data.success) {
        const authData: AuthUser = response.data.data
        
        // Salvar token
        storeToken(authData.token)
        api.setAuthToken(authData.token)
        
        // Salvar usuário
        setUser(authData.user)
        
        // Redirecionar para dashboard
        router.push('/dashboard')
      } else {
        throw new Error(response.data.message || 'Erro no login')
      }
    } catch (error: any) {
      throw new Error(
        error.response?.data?.error || 
        error.message || 
        'Erro ao fazer login'
      )
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    // Remover token
    removeStoredToken()
    api.removeAuthToken()
    
    // Limpar usuário
    setUser(null)
    
    // Redirecionar para login
    router.push('/login')
  }

  // Funções auxiliares para localStorage
  const storeToken = (token: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(TOKEN_KEY, token)
    }
  }

  const getStoredToken = (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(TOKEN_KEY)
    }
    return null
  }

  const removeStoredToken = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_KEY)
    }
  }

  const value: AuthContextType = {
    user,
    login,
    logout,
    loading,
    isAuthenticated,
    isManager
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}