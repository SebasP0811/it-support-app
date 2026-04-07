import { NextResponse } from 'next/server'
import pool from '@/lib/db'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userName = searchParams.get('userName')
    const isAdmin = searchParams.get('isAdmin') === 'true'

    let query = `
      SELECT t.*, c.name as category_name, tech.name as technician_name
      FROM tickets t
      LEFT JOIN categories c ON t.category_id = c.id
      LEFT JOIN technicians tech ON t.technician_id = tech.id
    `

    if (userName && !isAdmin) {
      query += ` WHERE t.created_by = $1`
      query += ` ORDER BY t.created_at DESC`
      const result = await pool.query(query, [userName])
      return NextResponse.json(result.rows)
    }

    query += ` ORDER BY t.created_at DESC`
    const result = await pool.query(query)
    return NextResponse.json(result.rows)
  } catch (error) {
    console.error('Error fetching tickets:', error)
    return NextResponse.json({ error: 'Error fetching tickets' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, description, priority, category_id, created_by } = body

    const countResult = await pool.query('SELECT COUNT(*) FROM tickets')
    const count = parseInt(countResult.rows[0].count) + 1
    const ticketNumber = `TKT-${count.toString().padStart(4, '0')}`

    const result = await pool.query(`
      INSERT INTO tickets (ticket_number, title, description, priority, category_id, created_by, state)
      VALUES ($1, $2, $3, $4, $5, $6, 'open')
      RETURNING *
    `, [ticketNumber, title, description || '', priority || 'medium', category_id || 1, created_by || 'Usuario'])

    return NextResponse.json(result.rows[0], { status: 201 })
  } catch (error) {
    console.error('Error creating ticket:', error)
    return NextResponse.json({ error: 'Error creating ticket' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, state, technician_id, priority } = body

    const result = await pool.query(`
      UPDATE tickets 
      SET state = COALESCE($2, state),
          technician_id = COALESCE($3, technician_id),
          priority = COALESCE($4, priority),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `, [id, state, technician_id, priority])

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error('Error updating ticket:', error)
    return NextResponse.json({ error: 'Error updating ticket' }, { status: 500 })
  }
}
