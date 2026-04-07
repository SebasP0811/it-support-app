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
  RefreshCw
} from 'lucide-react'
import { useState, useEffect } from 'react'
import TicketModal from '@/components/TicketModal'

interface Ticket {
  id: number
  ticket_number: string
  title: string
  priority: string
  state: string
  created_at: string
}

interface UserStats {
  total: number
  open: number
  inProgress: number
  resolved: number
  critical: number
}

export default function Dashboard() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([])
  const [stats, setStats] = useState<UserStats | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [userName, setUserName] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const savedName = localStorage.getItem('userName') || ''
    const adminStatus = localStorage.getItem('isAdmin') === 'true'
    setUserName(savedName)
    setIsAdmin(adminStatus)
  }, [])

  const fetchData = async () => {
    try {
      const savedName = localStorage.getItem('userName') || ''
      const adminStatus = localStorage.getItem('isAdmin') === 'true'
      
      let ticketsUrl = '/api/tickets'
      if (savedName && !adminStatus) {
        ticketsUrl += `?userName=${encodeURIComponent(savedName)}&isAdmin=false`
      } else if (savedName && adminStatus) {
        ticketsUrl += `?isAdmin=true`
      }
      
      const [ticketsRes] = await Promise.all([
        fetch(ticketsUrl)
      ])
      const ticketsData = await ticketsRes.json()
      setTickets(ticketsData)
      setFilteredTickets(ticketsData)
      
      // Calcular stats del usuario
      const userTickets = ticketsData
      const userStats: UserStats = {
        total: userTickets.length,
        open: userTickets.filter((t: Ticket) => t.state === 'open').length,
        inProgress: userTickets.filter((t: Ticket) => t.state === 'inProgress').length,
        resolved: userTickets.filter((t: Ticket) => t.state === 'resolved').length,
        critical: userTickets.filter((t: Ticket) => t.priority === 'high' && t.state === 'open').length
      }
      setStats(userStats)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const savedName = localStorage.getItem('userName') || ''
    const adminStatus = localStorage.getItem('isAdmin') === 'true'
    setUserName(savedName)
    setIsAdmin(adminStatus)
    fetchData()
  }, [])

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredTickets(tickets)
    } else {
      const filtered = tickets.filter(ticket => 
        ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.ticket_number.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredTickets(filtered)
    }
  }, [searchQuery, tickets])

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
        fetchData()
      }
    } catch (error) {
      console.error('Error creating ticket:', error)
    }
  }

  const getPriorityClass = (priority: string) => {
    switch (priority) {
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
  }

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
          <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </Link>
          <Link href="/tickets" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-800 transition">
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
            <button onClick={fetchData} className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 transition">
              <RefreshCw className="w-5 h-5 text-slate-400" />
            </button>
            <button className="relative p-3 rounded-xl bg-slate-800 hover:bg-slate-700 transition">
              <Bell className="w-5 h-5 text-slate-400" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
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

        {/* Dashboard Content */}
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
              <p className="text-slate-400">Resumen de tus tickets</p>
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-xl font-medium flex items-center gap-2 transition"
            >
              <Plus className="w-5 h-5" />
              Nuevo Ticket
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="card rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                      <Ticket className="w-6 h-6 text-blue-400" />
                    </div>
                  </div>
                  <h3 className="text-3xl font-bold mb-1">{stats?.total || 0}</h3>
                  <p className="text-slate-400">Total Tickets</p>
                </div>

                <div className="card rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
                      <XCircle className="w-6 h-6 text-red-400" />
                    </div>
                  </div>
                  <h3 className="text-3xl font-bold mb-1">{stats?.open || 0}</h3>
                  <p className="text-slate-400">Abiertos</p>
                </div>

                <div className="card rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                      <Clock className="w-6 h-6 text-yellow-400" />
                    </div>
                  </div>
                  <h3 className="text-3xl font-bold mb-1">{stats?.inProgress || 0}</h3>
                  <p className="text-slate-400">En Progreso</p>
                </div>

                <div className="card rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-green-400" />
                    </div>
                  </div>
                  <h3 className="text-3xl font-bold mb-1">{stats?.resolved || 0}</h3>
                  <p className="text-slate-400">Resueltos</p>
                </div>
              </div>

              {/* Recent Tickets */}
              <div className="card rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">
                    {searchQuery ? `Resultados (${filteredTickets.length})` : 'Tickets Recientes'}
                  </h2>
                  <Link href="/tickets" className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                    Ver todos →
                  </Link>
                </div>
                <div className="space-y-3">
                  {filteredTickets.length === 0 ? (
                    <p className="text-slate-400 text-center py-8">
                      {searchQuery ? 'No se encontraron tickets' : 'No hay tickets aún'}
                    </p>
                  ) : (
                    filteredTickets.slice(0, 5).map((ticket) => (
                      <Link 
                        key={ticket.id}
                        href={`/tickets/${ticket.id}`}
                        className={`ticket-card rounded-xl p-4 block ${getPriorityClass(ticket.priority)}`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-slate-200">{ticket.title}</p>
                            <p className="text-sm text-slate-400">{ticket.ticket_number}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`px-3 py-1 rounded-lg text-sm font-medium ${getStatusBadge(ticket.state)}`}>
                              {getStateLabel(ticket.state)}
                            </span>
                            <span className="text-slate-500 text-sm">{formatDate(ticket.created_at)}</span>
                          </div>
                        </div>
                      </Link>
                    ))
                  )}
                </div>
              </div>
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
