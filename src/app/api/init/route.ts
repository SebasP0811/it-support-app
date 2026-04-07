export const runtime = 'nodejs'
import { NextResponse } from 'next/server'
import pool from '@/lib/db'

export async function POST() {
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
    return NextResponse.json({ message: 'Database initialized successfully' })
  } catch (error) {
    console.error('Error initializing database:', error)
    return NextResponse.json({ error: 'Error initializing database', details: String(error) }, { status: 500 })
  }
}
