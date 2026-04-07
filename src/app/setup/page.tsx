'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function Setup() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('Inicializando base de datos...')

  useEffect(() => {
    fetch('/api/init', { method: 'POST' })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setStatus('error')
          setMessage(data.error)
        } else {
          setStatus('success')
          setMessage('¡Base de datos inicializada correctamente!')
        }
      })
      .catch(err => {
        setStatus('error')
        setMessage('Error: ' + err.message)
      })
  }, [])

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="card rounded-2xl p-8 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold mb-6">Configuración de Base de Datos</h1>
        
        <div className="mb-6">
          {status === 'loading' && (
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          )}
          {status === 'success' && (
            <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}
          {status === 'error' && (
            <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          )}
        </div>

        <p className={`mb-6 ${status === 'error' ? 'text-red-400' : 'text-slate-400'}`}>
          {message}
        </p>

        {status === 'success' && (
          <Link 
            href="/"
            className="inline-block px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-xl font-medium transition"
          >
            Ir a la aplicación →
          </Link>
        )}
      </div>
    </div>
  )
}
