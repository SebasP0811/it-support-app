'use client'
import { useState, useEffect, use } from 'react'
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
  ArrowLeft,
  Clock,
  User,
  AlertCircle,
  MessageSquare,
  Send,
  CheckCircle
} from 'lucide-react'

interface TicketDetail {
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
  updated_at: string
}

interface Comment {
  id: number
  author: string
  content: string
  created_at: string
}

interface Technician {
  id: number
  name: string
}

export default function TicketDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const [ticket, setTicket] = useState<TicketDetail | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [technicians, setTechnicians] = useState<Technician[]>([])
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(true)
  const [userName, setUserName] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const savedName = localStorage.getItem('userName') || ''
    const adminStatus = localStorage.getItem('isAdmin') === 'true'
    setUserName(savedName)
    setIsAdmin(adminStatus)
    fetchData()
    fetchComments()
    fetchTechnicians()
  }, [resolvedParams.id])

  const fetchData = async () => {
    try {
      const res = await fetch(`/api/tickets/${resolvedParams.id}`)
      if (res.ok) {
        const data = await res.json()
        setTicket(data)
      }
    } catch (error) {
      console.error('Error fetching ticket:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/tickets/${resolvedParams.id}/comments`)
      if (res.ok) {
        const data = await res.json()
        setComments(data)
      }
    } catch (error) {
      console.error('Error fetching comments:', error)
    }
  }

  const fetchTechnicians = async () => {
    try {
      const res = await fetch('/api/technicians')
      if (res.ok) {
        const data = await res.json()
        setTechnicians(data)
      }
    } catch (error) {
      console.error('Error fetching technicians:', error)
    }
  }

  const handleAddComment = async () => {
    if (!newComment.trim() || !userName) return
    
    try {
      await fetch(`/api/tickets/${resolvedParams.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ author: userName, content: newComment })
      })
      setNewComment('')
      fetchComments()
    } catch (error) {
      console.error('Error adding comment:', error)
    }
  }

  const handleUpdateTicket = async (field: string, value: string | number) => {
    try {
      await fetch('/api/tickets', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: ticket?.id, [field]: value })
      })
      fetchData()
    } catch (error) {
      console.error('Error updating ticket:', error)
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500/20 text-red-400 border border-red-500/30'
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
      case 'low': return 'bg-green-500/20 text-green-400 border border-green-500/30'
      default: return 'bg-slate-500/20 text-slate-400'
    }
  }

  const getStateBadge = (state: string) => {
    switch (state) {
      case 'open': return 'bg-red-500/20 text-red-400 border border-red-500/30'
      case 'inProgress': return 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
      case 'resolved': return 'bg-green-500/20 text-green-400 border border-green-500/30'
      case 'closed': return 'bg-slate-500/20 text-slate-400 border border-slate-500/30'
      default: return 'bg-slate-500/20 text-slate-400'
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric',
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!ticket) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Ticket no encontrado</h2>
          <Link href="/tickets" className="text-blue-400 hover:text-blue-300">
            ← Volver a tickets
          </Link>
        </div>
      </div>
    )
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
          <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-800 transition">
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </Link>
          <Link href="/tickets" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
            <Ticket className="w-5 h-5" />
            Tickets
          </Link>
          <Link href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-800 transition">
            <BarChart3 className="w-5 h-5" />
            Reportes
          </Link>
        </nav>

        <div className="pt-6 border-t border-slate-700/50">
          <Link href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-800 transition">
            <Settings className="w-5 h-5" />
            Configuración
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        <header className="h-20 border-b border-slate-700/50 px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/tickets" className="p-2 hover:bg-slate-800 rounded-lg transition">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="font-bold">{ticket.ticket_number}</h1>
              <p className="text-sm text-slate-400">{ticket.title}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-medium">{userName || 'Usuario'}</p>
              <p className="text-sm text-slate-400">{isAdmin ? 'Administrador' : 'Usuario'}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold">
              {userName ? userName.charAt(0).toUpperCase() : 'U'}
            </div>
          </div>
        </header>

        <div className="p-8">
          <div className="grid grid-cols-3 gap-6">
            {/* Ticket Info */}
            <div className="col-span-2 space-y-6">
              <div className="card rounded-2xl p-6">
                <h2 className="text-xl font-bold mb-4">Detalles del Ticket</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-slate-400">Título</label>
                    <p className="font-medium">{ticket.title}</p>
                  </div>
                  <div>
                    <label className="text-sm text-slate-400">Descripción</label>
                    <p className="text-slate-300 whitespace-pre-wrap">{ticket.description}</p>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm text-slate-400">Categoría</label>
                      <p className="font-medium">{ticket.category_name}</p>
                    </div>
                    <div>
                      <label className="text-sm text-slate-400">Creado por</label>
                      <p className="font-medium">{ticket.created_by}</p>
                    </div>
                    <div>
                      <label className="text-sm text-slate-400">Fecha</label>
                      <p className="font-medium">{formatDate(ticket.created_at)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Comments */}
              <div className="card rounded-2xl p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Comentarios ({comments.length})
                </h2>
                
                <div className="space-y-4 mb-6">
                  {comments.map((comment) => (
                    <div key={comment.id} className="bg-slate-800/50 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium flex items-center gap-2">
                          <User className="w-4 h-4 text-slate-400" />
                          {comment.author}
                        </span>
                        <span className="text-sm text-slate-500">{formatDate(comment.created_at)}</span>
                      </div>
                      <p className="text-slate-300">{comment.content}</p>
                    </div>
                  ))}
                  {comments.length === 0 && (
                    <p className="text-slate-400 text-center py-4">No hay comentarios aún</p>
                  )}
                </div>

                {/* Add Comment */}
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Escribe un comentario..."
                    className="flex-1 px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                  />
                  <button
                    onClick={handleAddComment}
                    className="px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-xl font-medium transition"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Sidebar Actions */}
            <div className="space-y-6">
              {/* Status Control */}
              <div className="card rounded-2xl p-6">
                <h3 className="font-bold mb-4">Estado del Ticket</h3>
                <div className="space-y-2">
                  {['open', 'inProgress', 'resolved', 'closed'].map((state) => (
                    <button
                      key={state}
                      onClick={() => handleUpdateTicket('state', state)}
                      className={`w-full px-4 py-3 rounded-xl text-left font-medium transition ${
                        ticket.state === state 
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {state === 'open' && <span className="flex items-center gap-2"><AlertCircle className="w-4 h-4 text-red-400" /> Abierto</span>}
                      {state === 'inProgress' && <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-yellow-400" /> En Progreso</span>}
                      {state === 'resolved' && <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-400" /> Resuelto</span>}
                      {state === 'closed' && <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-slate-400" /> Cerrado</span>}
                    </button>
                  ))}
                </div>
              </div>

              {/* Priority Control */}
              <div className="card rounded-2xl p-6">
                <h3 className="font-bold mb-4">Prioridad</h3>
                <div className="space-y-2">
                  {[
                    { value: 'high', label: 'Alta', color: 'red' },
                    { value: 'medium', label: 'Media', color: 'yellow' },
                    { value: 'low', label: 'Baja', color: 'green' }
                  ].map((p) => (
                    <button
                      key={p.value}
                      onClick={() => handleUpdateTicket('priority', p.value)}
                      className={`w-full px-4 py-3 rounded-xl text-left font-medium transition ${
                        ticket.priority === p.value 
                          ? `bg-${p.color}-500/20 text-${p.color}-400 border border-${p.color}-500/30` 
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Technician Assignment */}
              <div className="card rounded-2xl p-6">
                <h3 className="font-bold mb-4">Asignar Técnico</h3>
                <select
                  value={ticket.technician_name ? technicians.find(t => t.name === ticket.technician_name)?.id || '' : ''}
                  onChange={(e) => handleUpdateTicket('technician_id', parseInt(e.target.value))}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 focus:outline-none focus:border-blue-500"
                >
                  <option value="">Sin asignar</option>
                  {technicians.map((tech) => (
                    <option key={tech.id} value={tech.id}>{tech.name}</option>
                  ))}
                </select>
                {ticket.technician_name && (
                  <p className="mt-2 text-sm text-slate-400">Asignado a: {ticket.technician_name}</p>
                )}
              </div>

              {/* Info */}
              <div className="card rounded-2xl p-6">
                <h3 className="font-bold mb-4">Información</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Ticket:</span>
                    <span className="font-mono">{ticket.ticket_number}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Prioridad:</span>
                    <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getPriorityBadge(ticket.priority)}`}>
                      {ticket.priority === 'high' ? 'Alta' : ticket.priority === 'medium' ? 'Media' : 'Baja'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Estado:</span>
                    <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getStateBadge(ticket.state)}`}>
                      {ticket.state === 'open' ? 'Abierto' : ticket.state === 'inProgress' ? 'En Progreso' : ticket.state === 'resolved' ? 'Resuelto' : 'Cerrado'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
