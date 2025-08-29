'use client'

import React from 'react'
import { useAuth } from '@/contexts/AuthContext'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { Users, FolderOpen, Clock, CheckCircle, TrendingUp } from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  const { user, isManager } = useAuth()

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Olá, {user?.name?.split(' ')[0]}! 👋
              </h1>
              <p className="mt-1 text-gray-600">
                {isManager 
                  ? 'Gerencie sua equipe e projetos' 
                  : 'Acompanhe seus projetos e colaboradores'
                }
              </p>
            </div>
            <div className="text-right text-sm text-gray-500">
              <p>Hoje, {new Date().toLocaleDateString('pt-BR', {
                weekday: 'long',
                day: 'numeric',
                month: 'long'
              })}</p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total de Colaboradores"
            value="12"
            subtitle="3 novos este mês"
            icon={Users}
            color="bg-blue-500"
            href="/dashboard/colaboradores"
          />
          
          <StatCard
            title="Projetos Ativos"
            value="8"
            subtitle="2 em planejamento"
            icon={FolderOpen}
            color="bg-green-500"
            href="/dashboard/projetos"
          />
          
          <StatCard
            title="Em Desenvolvimento"
            value="5"
            subtitle="67% do total"
            icon={Clock}
            color="bg-yellow-500"
            href="/dashboard/projetos"
          />
          
          <StatCard
            title="Concluídos"
            value="15"
            subtitle="94% de sucesso"
            icon={CheckCircle}
            color="bg-purple-500"
            href="/dashboard/projetos"
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Atividades Recentes
              </h2>
              <TrendingUp className="h-5 w-5 text-gray-400" />
            </div>
            
            <div className="space-y-4">
              <ActivityItem
                title="Nova alocação no projeto Sistema de Vendas"
                time="há 2 horas"
                type="project"
              />
              
              <ActivityItem
                title="João Frontend atualizou seu perfil"
                time="há 4 horas"
                type="user"
              />
              
              <ActivityItem
                title="Projeto App Mobile movido para desenvolvimento"
                time="há 1 dia"
                type="project"
              />
              
              <ActivityItem
                title="Maria Backend adicionada ao projeto"
                time="há 2 dias"
                type="user"
              />
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              <Link 
                href="/dashboard/atividades"
                className="text-sm text-primary-600 hover:text-primary-800 font-medium"
              >
                Ver todas as atividades →
              </Link>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Ações Rápidas
            </h2>
            
            <div className="space-y-3">
              {isManager && (
                <>
                  <QuickActionButton
                    title="Adicionar Colaborador"
                    description="Cadastrar novo membro da equipe"
                    href="/dashboard/colaboradores/novo"
                    icon={Users}
                    color="text-blue-600"
                  />
                  
                  <QuickActionButton
                    title="Criar Projeto"
                    description="Iniciar um novo projeto"
                    href="/dashboard/projetos/novo"
                    icon={FolderOpen}
                    color="text-green-600"
                  />
                </>
              )}
              
              <QuickActionButton
                title="Meu Perfil"
                description="Visualizar e editar informações"
                href="/dashboard/perfil"
                icon={Users}
                color="text-purple-600"
              />
              
              <QuickActionButton
                title="Ver Projetos"
                description="Acompanhar projetos em andamento"
                href="/dashboard/projetos"
                icon={Clock}
                color="text-orange-600"
              />
            </div>
          </div>
        </div>

        {/* Recent Projects or Team Overview */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {isManager ? 'Visão Geral da Equipe' : 'Meus Projetos'}
          </h2>
          
          {isManager ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <TeamOverviewCard
                title="Frontend"
                count={3}
                members={['João', 'Ana', 'Carlos']}
                color="bg-blue-100 text-blue-800"
              />
              
              <TeamOverviewCard
                title="Backend"
                count={2}
                members={['Maria', 'Ana']}
                color="bg-green-100 text-green-800"
              />
              
              <TeamOverviewCard
                title="Design"
                count={1}
                members={['Pedro']}
                color="bg-purple-100 text-purple-800"
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ProjectCard
                name="Sistema de Vendas"
                status="Desenvolvimento"
                progress={65}
                role="Desenvolvedor Frontend"
              />
              
              <ProjectCard
                name="App Mobile"
                status="Planejamento"
                progress={20}
                role="Desenvolvedor Fullstack"
              />
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

// Componentes auxiliares

interface StatCardProps {
  title: string
  value: string
  subtitle: string
  icon: React.ComponentType<any>
  color: string
  href: string
}

function StatCard({ title, value, subtitle, icon: Icon, color, href }: StatCardProps) {
  return (
    <Link href={href} className="block">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          </div>
          <div className={`p-3 rounded-full ${color}`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>
      </div>
    </Link>
  )
}

interface ActivityItemProps {
  title: string
  time: string
  type: 'user' | 'project'
}

function ActivityItem({ title, time, type }: ActivityItemProps) {
  const bgColor = type === 'user' ? 'bg-blue-100' : 'bg-green-100'
  const textColor = type === 'user' ? 'text-blue-600' : 'text-green-600'
  const Icon = type === 'user' ? Users : FolderOpen

  return (
    <div className="flex items-start space-x-3">
      <div className={`p-1 rounded-full ${bgColor} ${textColor}`}>
        <Icon className="h-3 w-3" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-900">{title}</p>
        <p className="text-xs text-gray-500">{time}</p>
      </div>
    </div>
  )
}

interface QuickActionButtonProps {
  title: string
  description: string
  href: string
  icon: React.ComponentType<any>
  color: string
}

function QuickActionButton({ title, description, href, icon: Icon, color }: QuickActionButtonProps) {
  return (
    <Link href={href} className="block">
      <div className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors">
        <div className={`p-2 rounded-lg bg-gray-100 ${color}`}>
          <Icon className="h-4 w-4" />
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium text-gray-900">{title}</p>
          <p className="text-xs text-gray-500">{description}</p>
        </div>
      </div>
    </Link>
  )
}

interface TeamOverviewCardProps {
  title: string
  count: number
  members: string[]
  color: string
}

function TeamOverviewCard({ title, count, members, color }: TeamOverviewCardProps) {
  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}>
          {title}
        </span>
        <span className="text-sm font-semibold text-gray-900">
          {count} {count === 1 ? 'pessoa' : 'pessoas'}
        </span>
      </div>
      <div className="text-sm text-gray-600">
        {members.join(', ')}
      </div>
    </div>
  )
}

interface ProjectCardProps {
  name: string
  status: string
  progress: number
  role: string
}

function ProjectCard({ name, status, progress, role }: ProjectCardProps) {
  const statusColors = {
    'Desenvolvimento': 'bg-blue-100 text-blue-800',
    'Planejamento': 'bg-yellow-100 text-yellow-800',
    'Concluído': 'bg-green-100 text-green-800'
  }

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-gray-900">{name}</h3>
          <p className="text-sm text-gray-600">{role}</p>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}`}>
          {status}
        </span>
      </div>
      
      <div className="mt-3">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-600">Progresso</span>
          <span className="font-medium text-gray-900">{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-primary-600 h-2 rounded-full" 
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  )
}