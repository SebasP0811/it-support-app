'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Bell, Ticket, CheckCircle, Clock, AlertCircle, RefreshCw } from 'lucide-react'

interface Notification {
  id: number
  ticket_id: number
  ticket_number: string
  title: string
  state: string
  priority: string
  created_by: string
  event_type: string
  old_value: string
  new_value: string
  created_at: string
}

interface NotificationBellProps {
  userName: string
  isAdmin: boolean
}

const stateLabels: Record<string, string> = {
  open: 'Abierto',
  inProgress: 'En Progreso',
  resolved: 'Resuelto',
  closed: 'Cerrado'
}

export default function NotificationBell({ userName, isAdmin }: NotificationBellProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [loading, setLoading] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (userName) {
      fetchNotifications()
      const interval = setInterval(fetchNotifications, 10000)
      return () => clearInterval(interval)
    }
  }, [userName, isAdmin])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      const url = `/api/notifications?userName=${encodeURIComponent(userName)}&isAdmin=${isAdmin}`
      const res = await fetch(url)
      const data = await res.json()
      
      if (Array.isArray(data) && data.length > 0) {
        setNotifications(data)
      }
    } catch (error) {
      console.error('Error fetching notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStateIcon = (state: string) => {
    switch (state) {
      case 'open': return <AlertCircle className="w-5 h-5 text-red-400" />
      case 'inProgress': return <Clock className="w-5 h-5 text-yellow-400" />
      case 'resolved': return <CheckCircle className="w-5 h-5 text-green-400" />
      case 'closed': return <CheckCircle className="w-5 h-5 text-blue-400" />
      default: return <Ticket className="w-5 h-5 text-slate-400" />
    }
  }

  const formatTime = (dateString: string) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    
    if (minutes < 1) return 'Ahora'
    if (minutes < 60) return `Hace ${minutes}m`
    if (hours < 24) return `Hace ${hours}h`
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
  }

  const getEventMessage = (notif: Notification) => {
    if (notif.event_type === 'state_change') {
      const oldLabel = stateLabels[notif.old_value] || notif.old_value || 'Abierto'
      const newLabel = stateLabels[notif.new_value] || notif.new_value || 'Nuevo'
      if (isAdmin) {
        return `Estado: ${oldLabel} → ${newLabel}`
      }
      return `Tu ticket cambió a: ${newLabel}`
    }
    return ''
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => {
          setShowDropdown(!showDropdown)
          if (!showDropdown) fetchNotifications()
        }}
        className="relative p-3 rounded-xl bg-slate-800 hover:bg-slate-700 transition"
      >
        <Bell className="w-5 h-5 text-slate-400" />
        {loading && (
          <RefreshCw className="w-4 h-4 text-blue-400 absolute top-1 right-1 animate-spin" />
        )}
        {notifications.length > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center font-bold text-white">
            {notifications.length > 9 ? '9+' : notifications.length}
          </span>
        )}
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-96 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-700 bg-slate-800 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm">Notificaciones</h3>
              <p className="text-xs text-slate-400">Cambios en tickets</p>
            </div>
            <button 
              onClick={fetchNotifications}
              className="p-2 hover:bg-slate-700 rounded-lg transition"
            >
              <RefreshCw className={`w-4 h-4 text-slate-400 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <Bell className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p className="text-sm text-slate-400">Sin notificaciones</p>
              </div>
            ) : (
              notifications.map((notif) => (
                <Link 
                  key={`${notif.id}-${notif.created_at}`}
                  href={`/tickets/${notif.ticket_id}`}
                  onClick={() => setShowDropdown(false)}
                  className="block px-4 py-4 hover:bg-slate-700/50 border-b border-slate-700/50 last:border-b-0 transition"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      {getStateIcon(notif.new_value || notif.state)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-xs text-slate-400">{notif.ticket_number}</span>
                        <span className="text-xs text-slate-500">{formatTime(notif.created_at)}</span>
                      </div>
                      <p className="text-sm font-medium truncate">{notif.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {getStateIcon(notif.old_value || 'open')}
                        <span className="text-xs text-slate-300">
                          {getEventMessage(notif)}
                        </span>
                      </div>
                      {isAdmin && (
                        <p className="text-xs text-slate-500 mt-1">
                          Por: {notif.created_by || 'Sistema'}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
          
          <div className="px-4 py-2 border-t border-slate-700 bg-slate-800/50">
            <button 
              onClick={() => setNotifications([])}
              className="text-xs text-slate-400 hover:text-slate-200"
            >
              Limpiar notificaciones
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
