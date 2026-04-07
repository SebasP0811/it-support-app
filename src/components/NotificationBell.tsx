'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Bell, Ticket, CheckCircle, Clock, AlertCircle } from 'lucide-react'

interface Notification {
  id: number
  ticket_number: string
  title: string
  state: string
  priority: string
  created_by: string
  updated_at: string
  created_at: string
}

interface NotificationBellProps {
  userName: string
  isAdmin: boolean
}

export default function NotificationBell({ userName, isAdmin }: NotificationBellProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [hasNew, setHasNew] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const lastCheckRef = useRef<string>(new Date().toISOString())

  useEffect(() => {
    fetchNotifications()
    const interval = setInterval(fetchNotifications, 15000)
    return () => clearInterval(interval)
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
      const lastCheck = lastCheckRef.current
      const url = `/api/notifications?userName=${encodeURIComponent(userName)}&isAdmin=${isAdmin}&lastCheck=${encodeURIComponent(lastCheck)}`
      const res = await fetch(url)
      const data = await res.json()
      
      if (Array.isArray(data) && data.length > 0) {
        const newNotifications = data.filter((n: Notification) => 
          new Date(n.updated_at) > new Date(lastCheck)
        )
        if (newNotifications.length > 0) {
          setNotifications(prev => [...newNotifications, ...prev].slice(0, 10))
          setHasNew(true)
        }
      }
      lastCheckRef.current = new Date().toISOString()
    } catch (error) {
      console.error('Error fetching notifications:', error)
    }
  }

  const getStateIcon = (state: string) => {
    switch (state) {
      case 'open': return <AlertCircle className="w-4 h-4 text-red-400" />
      case 'inProgress': return <Clock className="w-4 h-4 text-yellow-400" />
      case 'resolved': return <CheckCircle className="w-4 h-4 text-green-400" />
      default: return <Ticket className="w-4 h-4 text-slate-400" />
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

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500/20 text-red-400'
      case 'medium': return 'bg-yellow-500/20 text-yellow-400'
      case 'low': return 'bg-green-500/20 text-green-400'
      default: return 'bg-slate-500/20 text-slate-400'
    }
  }

  const formatTime = (dateString: string) => {
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

  const handleBellClick = () => {
    setShowDropdown(!showDropdown)
    if (!showDropdown) {
      setHasNew(false)
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={handleBellClick}
        className="relative p-3 rounded-xl bg-slate-800 hover:bg-slate-700 transition"
      >
        <Bell className="w-5 h-5 text-slate-400" />
        {hasNew && (
          <span className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
        )}
        {notifications.length > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full text-xs flex items-center justify-center font-bold text-white">
            {notifications.length > 9 ? '9+' : notifications.length}
          </span>
        )}
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-80 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-700 bg-slate-800">
            <h3 className="font-bold text-sm">Notificaciones</h3>
            <p className="text-xs text-slate-400">
              {isAdmin ? 'Nuevos tickets creados' : 'Actualizaciones de tus tickets'}
            </p>
          </div>
          
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <Bell className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p className="text-sm text-slate-400">Sin notificaciones nuevas</p>
              </div>
            ) : (
              notifications.map((notif) => (
                <Link 
                  key={`${notif.id}-${notif.updated_at}`}
                  href={`/tickets/${notif.id}`}
                  onClick={() => setShowDropdown(false)}
                  className="block px-4 py-3 hover:bg-slate-700/50 border-b border-slate-700/50 last:border-b-0 transition"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      {getStateIcon(notif.state)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-xs text-slate-400">{notif.ticket_number}</span>
                        <span className="text-xs text-slate-500">{formatTime(notif.updated_at)}</span>
                      </div>
                      <p className="text-sm font-medium truncate">{notif.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${getPriorityBadge(notif.priority)}`}>
                          {notif.priority === 'high' ? 'Alta' : notif.priority === 'medium' ? 'Media' : 'Baja'}
                        </span>
                        <span className="text-xs text-slate-400">
                          {isAdmin ? `Por: ${notif.created_by}` : getStateLabel(notif.state)}
                        </span>
                      </div>
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
              Marcar todo como visto
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
