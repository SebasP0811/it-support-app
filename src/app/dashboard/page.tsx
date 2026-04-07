'use client'
import Link from 'next/link'
import { 
  LayoutDashboard, 
  Ticket, 
  BarChart3, 
  Settings,
  Headphones,
  Bell,
  Search,
  Plus,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'
import { useState } from 'react'
import TicketModal from '@/components/TicketModal'

interface Ticket {
  id: string
  title: string
  description: string
  priority: string
  category: string
  state: 'open' | 'inProgress' | 'resolved' | 'closed'
  assignee: string
  created: string
}

export default function Dashboard() {
  const [tickets, setTickets] = useState<Ticket[]>([
    { id: 'TKT-001', title: 'Error crítico en servidor principal', description: '', priority: 'high', category: 'servidor', state: 'open', assignee: 'Carlos G.', created: '5 min' },
    { id: 'TKT-002', title: 'Solicitud de acceso VPN', description: '', priority: 'medium', category: 'acceso', state: 'inProgress', assignee: 'María L.', created: '1 hora' },
    { id: 'TKT-003', title: 'Problema con impresoras red', description: '', priority: 'low', category: 'hardware', state: 'resolved', assignee: 'Luis R.', created: '2 horas' },
    { id: 'TKT-004', title: 'Actualización Windows Server', description: '', priority: 'high', category: 'servidor', state: 'open', assignee: 'Ana M.', created: '30 min' },
    { id: 'TKT-005', title: 'Backup no completado', description: '', priority: 'medium', category: 'bd', state: 'inProgress', assignee: 'Carlos G.', created: '3 horas' },
  ])

  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleCreateTicket = (ticket: {
    title: string
    description: string
    priority: string
    category: string
  }) => {
    const newTicket: Ticket = {
      id: `TKT-${(tickets.length + 1).toString().padStart(3, '0')}`,
      ...ticket,
      state: 'open',
      assignee: 'Sin asignar',
      created: 'Ahora'
    }
    setTickets([newTicket, ...tickets])
  }

  const openTickets = tickets.filter(t => t.state === 'open').length
  const inProgressTickets = tickets.filter(t => t.state === 'inProgress').length
  const resolvedTickets = tickets.filter(t => t.state === 'resolved' || t.state === 'closed').length
  const criticalTickets = tickets.filter(t => t.priority === 'high' && t.state === 'open').length

  const getPriorityClass = (status: string) => {
    switch (status) {
      case 'high': return 'priority-high'
      case 'medium': return 'priority-medium'
      case 'low': return 'priority-low'
      default: return ''
    }
  }

  const getStatusBadge = (state: string) => {
    switch (state) {
      case 'open': return 'bg-red-500/20 text-red-400 border border-red-500/30'
      case 'inProgress': return 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
      case 'resolved': return 'bg-green-500/20 text-green-400 border border-green-500/30'
      case 'closed': return 'bg-slate-500/20 text-slate-400 border border-slate-500/30'
      default: return 'bg-slate-500/20 text-slate-400 border border-slate-500/30'
    }
  }

  const getStateLabel = (state: string) => {
    switch (state) {
      case 'open': return 'Abierto'
      case 'inProgress': return 'En Progreso'
      case 'resolved': return 'Resuelto'
      case 'closed': return 'Cerrado'
      default: return state
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 sidebar border-r border-slate-700/50 p-6 flex flex-col">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Headphones className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg">IT Support</h1>
            <p className="text-xs text-slate-400">Support Hub</p>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          <Link 
            href="/dashboard"
            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30"
          >
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </Link>
          <Link 
            href="/tickets"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-800 transition"
          >
            <Ticket className="w-5 h-5" />
            Tickets
          </Link>
          <Link 
            href="#"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-800 transition"
          >
            <BarChart3 className="w-5 h-5" />
            Reportes
          </Link>
        </nav>

        <div className="pt-6 border-t border-slate-700/50">
          <Link 
            href="#"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-800 transition"
          >
            <Settings className="w-5 h-5" />
            Configuración
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        {/* Header */}
        <header className="h-20 border-b border-slate-700/50 px-8 flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1 max-w-xl">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                type="text"
                placeholder="Buscar tickets, clientes..."
                className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-300 placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="relative p-3 rounded-xl bg-slate-800 hover:bg-slate-700 transition">
              <Bell className="w-5 h-5 text-slate-400" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-slate-700">
              <div className="text-right">
                <p className="font-medium">Carlos García</p>
                <p className="text-sm text-slate-400">Admin</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold">
                CG
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
              <p className="text-slate-400">Resumen general del sistema de soporte</p>
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-xl font-medium flex items-center gap-2 transition"
            >
              <Plus className="w-5 h-5" />
              Nuevo Ticket
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="card rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <Ticket className="w-6 h-6 text-blue-400" />
                </div>
                <div className="flex items-center gap-1 text-green-400 text-sm">
                  <ArrowUpRight className="w-4 h-4" />
                  +12%
                </div>
              </div>
              <h3 className="text-3xl font-bold mb-1">{openTickets}</h3>
              <p className="text-slate-400">Tickets Activos</p>
              <div className="mt-4 h-2 bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(openTickets / tickets.length) * 100}%` }}></div>
              </div>
            </div>

            <div className="card rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-purple-400" />
                </div>
                <div className="flex items-center gap-1 text-yellow-400 text-sm">
                  <ArrowDownRight className="w-4 h-4" />
                  -8%
                </div>
              </div>
              <h3 className="text-3xl font-bold mb-1">{inProgressTickets}</h3>
              <p className="text-slate-400">En Progreso</p>
              <div className="mt-4 h-2 bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full" style={{ width: `${(inProgressTickets / tickets.length) * 100}%` }}></div>
              </div>
            </div>

            <div className="card rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                </div>
                <div className="flex items-center gap-1 text-green-400 text-sm">
                  <ArrowUpRight className="w-4 h-4" />
                  +15%
                </div>
              </div>
              <h3 className="text-3xl font-bold mb-1">{resolvedTickets}</h3>
              <p className="text-slate-400">Resueltos</p>
              <div className="mt-4 h-2 bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full" style={{ width: `${(resolvedTickets / tickets.length) * 100}%` }}></div>
              </div>
            </div>

            <div className="card rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
                  <XCircle className="w-6 h-6 text-red-400" />
                </div>
                <div className="flex items-center gap-1 text-red-400 text-sm">
                  <ArrowDownRight className="w-4 h-4" />
                  -3%
                </div>
              </div>
              <h3 className="text-3xl font-bold mb-1">{criticalTickets}</h3>
              <p className="text-slate-400">Críticos</p>
              <div className="mt-4 h-2 bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-red-500 rounded-full" style={{ width: `${(criticalTickets / openTickets) * 100 || 0}%` }}></div>
              </div>
            </div>
          </div>

          {/* Recent Tickets */}
          <div className="card rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Tickets Recientes</h2>
              <Link href="/tickets" className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                Ver todos →
              </Link>
            </div>
            <div className="space-y-3">
              {tickets.slice(0, 5).map((ticket) => (
                <div 
                  key={ticket.id}
                  className={`ticket-card rounded-xl p-4 ${getPriorityClass(ticket.priority)}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="font-medium text-slate-200">{ticket.title}</p>
                        <p className="text-sm text-slate-400">{ticket.id}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-lg text-sm font-medium ${getStatusBadge(ticket.state)}`}>
                        {getStateLabel(ticket.state)}
                      </span>
                      <span className="text-slate-500 text-sm">{ticket.created}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Charts Placeholder */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
            <div className="card rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-6">Tendencia de Tickets</h2>
              <div className="h-64 flex items-center justify-center bg-slate-800/30 rounded-xl">
                <div className="text-center">
                  <TrendingUp className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                  <p className="text-slate-400">Gráfico de tendencias</p>
                </div>
              </div>
            </div>

            <div className="card rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-6">Tickets por Categoría</h2>
              <div className="h-64 flex items-center justify-center bg-slate-800/30 rounded-xl">
                <div className="text-center">
                  <BarChart3 className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                  <p className="text-slate-400">Distribución por categoría</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <TicketModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateTicket}
      />
    </div>
  )
}
