'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { 
  Users, 
  FolderOpen, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Home,
  User,
  ChevronRight
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/Button'
import { UserRole, BreadcrumbItem } from '@/types'
import { getInitials, generateColor } from '@/lib/utils'

interface DashboardLayoutProps {
  children: React.ReactNode
  breadcrumbs?: BreadcrumbItem[]
}

export default function DashboardLayout({ children, breadcrumbs = [] }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, logout, isManager } = useAuth()
  const pathname = usePathname()
  const router = useRouter()

  const navigation = [
    { 
      name: 'Dashboard', 
      href: '/dashboard', 
      icon: Home, 
      permissions: [UserRole.NORMAL, UserRole.MANAGER] 
    },
    { 
      name: 'Colaboradores', 
      href: '/dashboard/colaboradores', 
      icon: Users, 
      permissions: [UserRole.NORMAL, UserRole.MANAGER] 
    },
    { 
      name: 'Projetos', 
      href: '/dashboard/projetos', 
      icon: FolderOpen, 
      permissions: [UserRole.NORMAL, UserRole.MANAGER] 
    },
    { 
      name: 'Meu Perfil', 
      href: '/dashboard/perfil', 
      icon: User, 
      permissions: [UserRole.NORMAL, UserRole.MANAGER] 
    }
  ]

  const filteredNavigation = navigation.filter(item => 
    item.permissions.includes(user?.role as UserRole)
  )

  const handleLogout = () => {
    logout()
  }

  const closeSidebar = () => setSidebarOpen(false)

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* Sidebar para mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 flex z-40 md:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={closeSidebar} />
          
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white shadow-xl">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                onClick={closeSidebar}
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              >
                <X className="h-6 w-6 text-white" />
              </button>
            </div>
            
            <SidebarContent 
              navigation={filteredNavigation}
              pathname={pathname}
              user={user}
              onLogout={handleLogout}
              onItemClick={closeSidebar}
            />
          </div>
        </div>
      )}

      {/* Sidebar para desktop */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <SidebarContent 
            navigation={filteredNavigation}
            pathname={pathname}
            user={user}
            onLogout={handleLogout}
          />
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        {/* Header */}
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-white shadow border-b border-gray-200">
          <button
            onClick={() => setSidebarOpen(true)}
            className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 md:hidden"
          >
            <Menu className="h-6 w-6" />
          </button>
          
          <div className="flex-1 px-4 flex justify-between items-center">
            {/* Breadcrumbs */}
            <div className="flex items-center space-x-2 text-sm">
              {breadcrumbs.length > 0 ? (
                <nav className="flex" aria-label="Breadcrumb">
                  <ol className="flex items-center space-x-2">
                    {breadcrumbs.map((item, index) => (
                      <li key={index} className="flex items-center">
                        {index > 0 && (
                          <ChevronRight className="h-4 w-4 text-gray-400 mr-2" />
                        )}
                        {item.href ? (
                          <Link 
                            href={item.href}
                            className="text-gray-500 hover:text-gray-700 font-medium"
                          >
                            {item.label}
                          </Link>
                        ) : (
                          <span className="text-gray-900 font-medium">
                            {item.label}
                          </span>
                        )}
                      </li>
                    ))}
                  </ol>
                </nav>
              ) : (
                <h1 className="text-xl font-semibold text-gray-900">
                  Dashboard
                </h1>
              )}
            </div>

            {/* User menu */}
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500">
                  {isManager ? 'Gestor' : 'Colaborador'}
                </p>
              </div>
              
              <div className={`h-8 w-8 rounded-full ${generateColor(user.name)} flex items-center justify-center text-white text-sm font-medium`}>
                {getInitials(user.name)}
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

interface SidebarContentProps {
  navigation: any[]
  pathname: string
  user: any
  onLogout: () => void
  onItemClick?: () => void
}

function SidebarContent({ navigation, pathname, user, onLogout, onItemClick }: SidebarContentProps) {
  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      {/* Logo */}
      <div className="flex items-center h-16 px-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <Users className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">
            Colaboradores
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="mt-5 flex-1 px-2 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onItemClick}
              className={`
                group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors
                ${isActive 
                  ? 'bg-primary-100 text-primary-900 border-r-2 border-primary-600' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }
              `}
            >
              <Icon 
                className={`
                  mr-3 h-5 w-5 flex-shrink-0
                  ${isActive ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-500'}
                `} 
              />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* User section */}
      <div className="flex-shrink-0 border-t border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`h-8 w-8 rounded-full ${generateColor(user.name)} flex items-center justify-center text-white text-sm font-medium`}>
              {getInitials(user.name)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user.name}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user.email}
              </p>
            </div>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={onLogout}
            className="p-2"
            title="Sair"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}