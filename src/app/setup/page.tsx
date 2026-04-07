'use client'
import { useEffect, useState } from 'react'
import pool from '@/lib/db'
import Link from 'next/link'

export default function Setup() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('Inicializando base de datos...')

  useEffect(() => {
    initializeDatabase()
  }, [])

  const initializeDatabase = async () => {
    try {
      const schema = `
        CREATE TABLE IF NOT EXISTS categories (
          id SERIAL PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          description TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS technicians (
          id SERIAL PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          role VARCHAR(50) DEFAULT 'technician',
          avatar_color VARCHAR(20) DEFAULT '#3B82F6',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS tickets (
          id SERIAL PRIMARY KEY,
          ticket_number VARCHAR(20) UNIQUE NOT NULL,
          title VARCHAR(255) NOT NULL,
          description TEXT,
          priority VARCHAR(20) DEFAULT 'medium',
          state VARCHAR(20) DEFAULT 'open',
          category_id INTEGER REFERENCES categories(id),
          technician_id INTEGER REFERENCES technicians(id),
          created_by VARCHAR(100),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        INSERT INTO categories (name, description) VALUES 
          ('Soporte General', 'Problemas generales de soporte técnico'),
          ('Hardware', 'Problemas con equipos físicos'),
          ('Software', 'Problemas con aplicaciones'),
          ('Redes', 'Problemas de conectividad'),
          ('Seguridad', 'Incidentes de seguridad'),
          ('Base de Datos', 'Problemas con bases de datos'),
          ('Servidores', 'Problemas con servidores'),
          ('Accesos', 'Solicitudes de acceso')
        ON CONFLICT DO NOTHING;

        INSERT INTO technicians (name, email, role) VALUES 
          ('Carlos García', 'carlos@empresa.com', 'admin'),
          ('María López', 'maria@empresa.com', 'technician'),
          ('Luis Rodríguez', 'luis@empresa.com', 'technician'),
          ('Ana Martínez', 'ana@empresa.com', 'technician')
        ON CONFLICT DO NOTHING;
      `

      await pool.query(schema)
      setStatus('success')
      setMessage('¡Base de datos inicializada correctamente!')
    } catch (error) {
      console.error('Error:', error)
      setStatus('error')
      setMessage('Error al inicializar: ' + String(error))
    }
  }

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
