'use client'
import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

interface TicketModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (ticket: {
    title: string
    description: string
    priority: string
    category_id: number
    created_by: string
  }) => void
}

interface Category {
  id: number
  name: string
}

export default function TicketModal({ isOpen, onClose, onSubmit }: TicketModalProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState('medium')
  const [categoryId, setCategoryId] = useState(1)
  const [createdBy, setCreatedBy] = useState('')
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    if (isOpen) {
      const savedName = localStorage.getItem('userName') || ''
      setCreatedBy(savedName)
      fetchCategories()
    }
  }, [isOpen])

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories')
      const data = await res.json()
      setCategories(data)
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const userName = createdBy || 'Usuario'
    localStorage.setItem('userName', userName)
    onSubmit({ title, description, priority, category_id: categoryId, created_by: userName })
    setTitle('')
    setDescription('')
    setPriority('medium')
    setCategoryId(1)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="card rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-auto">
        <div className="p-6 border-b border-slate-700 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Crear Nuevo Ticket</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-700 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Título del Ticket *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Error en servidor principal"
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Descripción *</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe el problema en detalle..."
              rows={5}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Prioridad</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 focus:outline-none focus:border-blue-500"
              >
                <option value="low">Baja</option>
                <option value="medium">Media</option>
                <option value="high">Alta</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Categoría</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(parseInt(e.target.value))}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 focus:outline-none focus:border-blue-500"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Tu Nombre (se guardará para futuros tickets)</label>
            <input
              type="text"
              value={createdBy}
              onChange={(e) => setCreatedBy(e.target.value)}
              placeholder="Ej: Juan Pérez"
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-xl font-medium transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-xl font-medium transition"
            >
              Crear Ticket
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
