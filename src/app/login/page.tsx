'use client'
import { useState, useEffect } from 'react'
import { Headphones, User, Shield, ArrowRight, XCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

const ADMIN_USERS = ['helpdesk', 'jaime hernan valencia', 'johan sebastian rico alvarez']

export default function Login() {
  const [name, setName] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)
  const [savedName, setSavedName] = useState('')
  const [savedIsAdmin, setSavedIsAdmin] = useState(false)
  const [error, setError] = useState('')
  const [adminError, setAdminError] = useState('')
  const router = useRouter()

  useEffect(() => {
    const savedUserName = localStorage.getItem('userName')
    const savedAdminStatus = localStorage.getItem('isAdmin') === 'true'
    setSavedName(savedUserName || '')
    setSavedIsAdmin(savedAdminStatus)
    
    if (savedUserName) {
      setName(savedUserName)
      setIsAdmin(savedAdminStatus)
    }
  }, [])

  const isAdminUser = (userName: string) => {
    return ADMIN_USERS.includes(userName.toLowerCase().trim())
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    
    if (isAdmin && !isAdminUser(name)) {
      setAdminError('ACCESO DENEGADO: No tienes permisos de administrador')
      return
    }
    
    setError('')
    setAdminError('')
    localStorage.setItem('userName', name)
    localStorage.setItem('isAdmin', String(isAdmin))
    router.push('/dashboard')
  }

  const handleAdminToggle = (value: boolean) => {
    if (value && !isAdminUser(name)) {
      setAdminError('ACCESO DENEGADO: No tienes permisos de administrador')
      setIsAdmin(false)
    } else {
      setAdminError('')
      setIsAdmin(value)
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="card rounded-3xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Headphones className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2">IT Support Hub</h1>
          <p className="text-slate-400">Ingresa tu nombre para continuar</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Tu Nombre</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Juan Pérez"
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Tipo de Usuario</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => { setIsAdmin(false); setError('') }}
                className={`p-4 rounded-xl border-2 transition ${
                  !isAdmin 
                    ? 'border-blue-500 bg-blue-500/20 text-blue-400' 
                    : 'border-slate-700 bg-slate-800 text-slate-400 hover:border-slate-600'
                }`}
              >
                <User className="w-8 h-8 mx-auto mb-2" />
                <span className="font-medium">Usuario</span>
                <p className="text-xs mt-1 opacity-70">Crear tickets</p>
              </button>
              <button
                type="button"
                onClick={() => handleAdminToggle(true)}
                className={`p-4 rounded-xl border-2 transition ${
                  isAdmin 
                    ? 'border-purple-500 bg-purple-500/20 text-purple-400' 
                    : 'border-slate-700 bg-slate-800 text-slate-400 hover:border-slate-600'
                }`}
              >
                <Shield className="w-8 h-8 mx-auto mb-2" />
                <span className="font-medium">Administrador</span>
                <p className="text-xs mt-1 opacity-70">Gestionar todo</p>
              </button>
            </div>
            {adminError && (
              <div className="mt-4 p-4 bg-red-500/20 border border-red-500/50 rounded-xl">
                <div className="flex items-center gap-2 text-red-400">
                  <XCircle className="w-5 h-5" />
                  <span className="font-bold">{adminError}</span>
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full px-6 py-4 bg-blue-500 hover:bg-blue-600 rounded-xl font-medium flex items-center justify-center gap-2 transition"
          >
            Continuar
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>

        {savedName && (
          <div className="mt-6 pt-6 border-t border-slate-700">
            <p className="text-sm text-slate-400 text-center mb-3">
              Usuario guardado:
            </p>
            <div className="flex items-center justify-between bg-slate-800/50 rounded-xl px-4 py-3">
              <div>
                <p className="font-medium">{savedName}</p>
                <p className="text-sm text-slate-400">
                  {savedIsAdmin ? 'Administrador' : 'Usuario'}
                </p>
              </div>
              <button
                onClick={() => {
                  localStorage.removeItem('userName')
                  localStorage.removeItem('isAdmin')
                  setName('')
                  setSavedName('')
                  setSavedIsAdmin(false)
                }}
                className="text-sm text-red-400 hover:text-red-300"
              >
                Cambiar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
