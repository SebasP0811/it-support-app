import { NextResponse } from 'next/server'
import pool from '@/lib/db'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const result = await pool.query(`
      SELECT t.*, c.name as category_name, tech.name as technician_name
      FROM tickets t
      LEFT JOIN categories c ON t.category_id = c.id
      LEFT JOIN technicians tech ON t.technician_id = tech.id
      WHERE t.id = $1
    `, [id])
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 })
    }
    
    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error('Error fetching ticket:', error)
    return NextResponse.json({ error: 'Error fetching ticket' }, { status: 500 })
  }
}
