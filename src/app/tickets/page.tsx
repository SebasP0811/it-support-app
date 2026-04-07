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
  Filter,
  Grid,
  List,
  User,
  Clock,
  RefreshCw
} from 'lucide-react'
import { useState, useEffect } from 'react'
import TicketModal from '@/components/TicketModal'

interface Ticket {
  id: number
  ticket_number: string
  title: string
  description: string
  priority: string
  state: string
  category_name: string
  technician_name: string
  created_by: string
  created_at: string
}

export default function Tickets() {
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)

  const fetchTickets = async () => {
    try {
      const res = await fetch('/api/tickets')
      const data = await res.json()
      setTickets(data)
    } catch (error) {
      console.error('Error fetching tickets:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTickets()
  }, [])

  const handleCreateTicket = async (ticket: {
    title: string
    description: string
    priority: string
    category_id: number
    created_by: string
  }) => {
    try {
      const res = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ticket)
      })
      if (res.ok) {
        fetchTickets()
      }
    } catch (error) {
      console.error('Error creating ticket:', error)
    }
  }

  const handleUpdateTicket = async (id: number, state: string) => {
    try {
      await fetch('/api/tickets', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, state })
      })
      fetchTickets()
    } catch (error) {
      console.error('Error updating ticket:', error)
    }
  }

  const ticketsByState = {
    open: tickets.filter(t => t.state === 'open'),
    inProgress: tickets.filter(t => t.state === 'inProgress'),
    resolved: tickets.filter(t => t.state === 'resolved'),
    closed: tickets.filter(t => t.state === 'closed'),
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500/20 text-red-400 border border-red-500/30'
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
      case 'low': return 'bg-green-500/20 text-green-400 border border-green-500/30'
      default: return 'bg-slate-500/20 text-slate-400'
    }
  }

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high': return 'Alta'
      case 'medium': return 'Media'
      case 'low': return 'Baja'
      default: return priority
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
  }

  const renderTicketCard = (ticket: Ticket) => (
    <Link 
      key={ticket.id}
      href={`/tickets/${ticket.id}`}
      className={`ticket-card rounded-xl p-4 block ${
        ticket.priority === 'high' ? 'priority-high' : 
        ticket.priority === 'medium' ? 'priority-medium' : 'priority-low'
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <span className="text-xs font-mono text-slate-500">{ticket.ticket_number}</span>
        <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getPriorityBadge(ticket.priority)}`}>
          {getPriorityLabel(ticket.priority)}
        </span>
      </div>
      <h4 className="font-medium text-slate-200 mb-2 line-clamp-2">{ticket.title}</h4>
      <p className="text-xs text-slate-500 mb-3">{ticket.category_name}</p>
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2 text-slate-400">
          <User className="w-4 h-4" />
          {ticket.technician_name || 'Sin asignar'}
        </div>
        <div className="flex items-center gap-1 text-slate-500">
          <Clock className="w-4 h-4" />
          {formatDate(ticket.created_at)}
        </div>
      </div>
    </Link>
  )

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
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-800 transition"
          >
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </Link>
          <Link 
            href="/tickets"
            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30"
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
                placeholder="Buscar tickets..."
                className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-300 placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={fetchTickets}
              className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 transition"
            >
              <RefreshCw className="w-5 h-5 text-slate-400" />
            </button>
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

        {/* Tickets Content */}
        <div className="p-8">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Tickets</h1>
              <p className="text-slate-400">{tickets.length} tickets totales</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl flex items-center gap-2 transition">
                <Filter className="w-4 h-4" />
                Filtros
              </button>
              <div className="flex bg-slate-800 rounded-xl p-1">
                <button 
                  onClick={() => setViewMode('kanban')}
                  className={`p-2 rounded-lg transition ${viewMode === 'kanban' ? 'bg-blue-500 text-white' : 'text-slate-400'}`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'text-slate-400'}`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-xl font-medium flex items-center gap-2 transition"
              >
                <Plus className="w-5 h-5" />
                Nuevo Ticket
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              {/* Kanban Board */}
              {viewMode === 'kanban' && (
                <div className="grid grid-cols-4 gap-6">
                  <div className="kanban-column rounded-2xl p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <h3 className="font-bold">Abiertos</h3>
                      </div>
                      <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded-lg text-sm font-medium">
                        {ticketsByState.open.length}
                      </span>
                    </div>
                    <div className="space-y-3">
                      {ticketsByState.open.map(renderTicketCard)}
                    </div>
                  </div>

                  <div className="kanban-column rounded-2xl p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <h3 className="font-bold">En Progreso</h3>
                      </div>
                      <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-lg text-sm font-medium">
                        {ticketsByState.inProgress.length}
                      </span>
                    </div>
                    <div className="space-y-3">
                      {ticketsByState.inProgress.map(renderTicketCard)}
                    </div>
                  </div>

                  <div className="kanban-column rounded-2xl p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <h3 className="font-bold">Resueltos</h3>
                      </div>
                      <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-lg text-sm font-medium">
                        {ticketsByState.resolved.length}
                      </span>
                    </div>
                    <div className="space-y-3">
                      {ticketsByState.resolved.map(renderTicketCard)}
                    </div>
                  </div>

                  <div className="kanban-column rounded-2xl p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-slate-500 rounded-full"></div>
                        <h3 className="font-bold">Cerrados</h3>
                      </div>
                      <span className="px-2 py-1 bg-slate-500/20 text-slate-400 rounded-lg text-sm font-medium">
                        {ticketsByState.closed.length}
                      </span>
                    </div>
                    <div className="space-y-3">
                      {ticketsByState.closed.map(renderTicketCard)}
                    </div>
                  </div>
                </div>
              )}

              {/* List View */}
              {viewMode === 'list' && (
                <div className="card rounded-2xl overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-slate-800/50">
                      <tr>
                        <th className="text-left px-6 py-4 font-medium text-slate-400">ID</th>
                        <th className="text-left px-6 py-4 font-medium text-slate-400">Título</th>
                        <th className="text-left px-6 py-4 font-medium text-slate-400">Categoría</th>
                        <th className="text-left px-6 py-4 font-medium text-slate-400">Prioridad</th>
                        <th className="text-left px-6 py-4 font-medium text-slate-400">Estado</th>
                        <th className="text-left px-6 py-4 font-medium text-slate-400">Asignado</th>
                        <th className="text-left px-6 py-4 font-medium text-slate-400">Fecha</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/50">
                      {tickets.map((ticket) => (
                        <tr key={ticket.id} className="hover:bg-slate-800/30 transition cursor-pointer">
                          <td className="px-6 py-4 font-mono text-slate-400"><Link href={`/tickets/${ticket.id}`}>{ticket.ticket_number}</Link></td>
                          <td className="px-6 py-4 font-medium"><Link href={`/tickets/${ticket.id}`}>{ticket.title}</Link></td>
                          <td className="px-6 py-4 text-slate-400">{ticket.category_name}</td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-lg text-sm font-medium ${getPriorityBadge(ticket.priority)}`}>
                              {getPriorityLabel(ticket.priority)}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-slate-400">
                            {ticket.state === 'open' ? 'Abierto' : 
                             ticket.state === 'inProgress' ? 'En Progreso' : 
                             ticket.state === 'resolved' ? 'Resuelto' : 'Cerrado'}
                          </td>
                          <td className="px-6 py-4 text-slate-400">{ticket.technician_name || 'Sin asignar'}</td>
                          <td className="px-6 py-4 text-slate-500">{formatDate(ticket.created_at)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
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
