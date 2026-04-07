import { NextResponse } from 'next/server'
import pool from '@/lib/db'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userName = searchParams.get('userName')
    const isAdmin = searchParams.get('isAdmin') === 'true'
    const lastCheck = searchParams.get('lastCheck')

    let query = `
      SELECT t.id, t.ticket_number, t.title, t.state, t.priority, t.created_at, t.updated_at, t.created_by
      FROM tickets t
    `

    const conditions: string[] = []
    const params: string[] = []

    if (userName && !isAdmin) {
      conditions.push(`t.created_by = $${params.length + 1}`)
      params.push(userName)
    }

    if (lastCheck) {
      conditions.push(`t.updated_at > $${params.length + 1}`)
      params.push(lastCheck)
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`
    }

    query += ` ORDER BY t.updated_at DESC LIMIT 20`

    const result = await pool.query(query, params)
    
    return NextResponse.json(result.rows)
  } catch (error) {
    console.error('Error fetching notifications:', error)
    return NextResponse.json({ error: 'Error fetching notifications' }, { status: 500 })
  }
}
