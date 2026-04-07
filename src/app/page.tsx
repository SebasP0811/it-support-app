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
  HeadphonesIcon,
  Users
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

export default function Home() {
  const [tickets, setTickets] = useState<Ticket[]>([
    { id: 'TKT-001', title: 'Error crítico en servidor principal', description: '', priority: 'high', category: 'servidor', state: 'open', assignee: 'Carlos G.', created: '5 min' },
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

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 sidebar border-r border-slate-700/50 p-6 flex flex-col">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <HeadphonesIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg">IT Support</h1>
            <p className="text-xs text-slate-400">Support Hub</p>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          <Link 
            href="/dashboard"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-800 transition"
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

        {/* Hero Section */}
        <div className="p-8">
          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-3xl p-12 border border-blue-500/20 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-4xl font-bold mb-4">
                  Bienvenido al Panel de{' '}
                  <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Soporte TI
                  </span>
                </h2>
                <p className="text-slate-400 text-lg max-w-xl mb-8">
                  Gestiona tickets, estadísticas y clientes en un solo lugar. 
                  Sistema moderno de soporte técnico con dashboard en tiempo real.
                </p>
                <div className="flex gap-4">
                  <button 
                    onClick={() => setIsModalOpen(true)}
                    className="px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-xl font-medium flex items-center gap-2 transition"
                  >
                    <Plus className="w-5 h-5" />
                    Nuevo Ticket
                  </button>
                  <Link 
                    href="/dashboard"
                    className="px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-xl font-medium transition"
                  >
                    Ver Dashboard
                  </Link>
                </div>
              </div>
              <div className="hidden lg:block">
                <div className="w-48 h-48 bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-3xl flex items-center justify-center backdrop-blur-sm border border-white/10">
                  <HeadphonesIcon className="w-24 h-24 text-blue-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="stat-card rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <Ticket className="w-6 h-6 text-blue-400" />
                </div>
                <span className="text-green-400 text-sm font-medium">+12%</span>
              </div>
              <h3 className="text-3xl font-bold mb-1">{tickets.length}</h3>
              <p className="text-slate-400">Tickets Activos</p>
            </div>
            <div className="stat-card rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-400" />
                </div>
                <span className="text-green-400 text-sm font-medium">+8%</span>
              </div>
              <h3 className="text-3xl font-bold mb-1">0</h3>
              <p className="text-slate-400">Clientes</p>
            </div>
            <div className="stat-card rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-green-400" />
                </div>
                <span className="text-green-400 text-sm font-medium">+5%</span>
              </div>
              <h3 className="text-3xl font-bold mb-1">94%</h3>
              <p className="text-slate-400">Resueltos</p>
            </div>
            <div className="stat-card rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                  <HeadphonesIcon className="w-6 h-6 text-yellow-400" />
                </div>
                <span className="text-yellow-400 text-sm font-medium">En línea</span>
              </div>
              <h3 className="text-3xl font-bold mb-1">24/7</h3>
              <p className="text-slate-400">Soporte</p>
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
