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
  Grid,
  List,
  User,
  Clock,
  RefreshCw
} from 'lucide-react'
import { useState, useEffect } from 'react'
import TicketModal from '@/components/TicketModal'
import NotificationBell from '@/components/NotificationBell'

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
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [userName, setUserName] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const fetchTickets = async () => {
    try {
      const savedName = localStorage.getItem('userName') || ''
      const adminStatus = localStorage.getItem('isAdmin') === 'true'
      
      let url = '/api/tickets'
      if (savedName && !adminStatus) {
        url += `?userName=${encodeURIComponent(savedName)}&isAdmin=false`
      } else if (savedName && adminStatus) {
        url += `?isAdmin=true`
      }
      
      const res = await fetch(url)
      const data = await res.json()
      setTickets(data)
      setFilteredTickets(data)
    } catch (error) {
      console.error('Error fetching tickets:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const savedName = localStorage.getItem('userName') || ''
    const adminStatus = localStorage.getItem('isAdmin') === 'true'
    setUserName(savedName)
    setIsAdmin(adminStatus)
    fetchTickets()
  }, [])

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredTickets(tickets)
    } else {
      const filtered = tickets.filter(ticket => 
        ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.ticket_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.category_name.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredTickets(filtered)
    }
  }, [searchQuery, tickets])

  const handleCreateTicket = async (ticket: {
    title: string
    description: string
    priority: string
    category_id: number
    category_name: string
    created_by: string
  }) => {
    try {
      const res = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ticket)
      })
      if (res.ok) {
        const newTicket = await res.json()
        // Enviar correo de notificación
        fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ticketNumber: newTicket.ticket_number,
            title: ticket.title,
            description: ticket.description,
            priority: ticket.priority,
            category: ticket.category_name,
            createdBy: ticket.created_by
          })
        })
        fetchTickets()
      }
    } catch (error) {
      console.error('Error creating ticket:', error)
    }
  }

  const ticketsByState = {
    open: filteredTickets.filter(t => t.state === 'open'),
    inProgress: filteredTickets.filter(t => t.state === 'inProgress'),
    resolved: filteredTickets.filter(t => t.state === 'resolved'),
    closed: filteredTickets.filter(t => t.state === 'closed'),
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
        <Link href="/login" className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Headphones className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg">IT Support</h1>
            <p className="text-xs text-slate-400">Support Hub</p>
          </div>
        </Link>

        <nav className="flex-1 space-y-2">
          <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-800 transition">
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </Link>
          <Link href="/tickets" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
            <Ticket className="w-5 h-5" />
            Tickets
          </Link>
        </nav>

        <div className="pt-6 border-t border-slate-700/50">
          <Link href="/login" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-800 transition">
            <Settings className="w-5 h-5" />
            Cambiar Usuario
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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar tickets..."
                className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-300 placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button onClick={fetchTickets} className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 transition">
              <RefreshCw className="w-5 h-5 text-slate-400" />
            </button>
            <NotificationBell userName={userName} isAdmin={isAdmin} />
            <div className="flex items-center gap-3 pl-4 border-l border-slate-700">
              <div className="text-right">
                <p className="font-medium">{userName}</p>
                <p className="text-sm text-slate-400">{isAdmin ? 'Administrador' : 'Usuario'}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold">
                {userName ? userName.charAt(0).toUpperCase() : 'U'}
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
              <p className="text-slate-400">
                {searchQuery ? `${filteredTickets.length} resultados` : `${filteredTickets.length} tickets totales`}
              </p>
            </div>
            <div className="flex items-center gap-3">
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
          ) : filteredTickets.length === 0 ? (
            <div className="card rounded-2xl p-12 text-center">
              <Ticket className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">
                {searchQuery ? 'No se encontraron tickets' : 'No hay tickets'}
              </h3>
              <p className="text-slate-400 mb-6">
                {searchQuery ? 'Intenta con otra búsqueda' : 'Crea tu primer ticket'}
              </p>
              {!searchQuery && (
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-xl font-medium inline-flex items-center gap-2 transition"
                >
                  <Plus className="w-5 h-5" />
                  Nuevo Ticket
                </button>
              )}
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
                        <th className="text-left px-6 py-4 font-medium text-slate-400">Fecha</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/50">
                      {filteredTickets.map((ticket) => (
                        <tr key={ticket.id} className="hover:bg-slate-800/30 transition">
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
