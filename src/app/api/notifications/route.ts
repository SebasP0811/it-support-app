import { NextResponse } from 'next/server'
import pool from '@/lib/db'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userName = searchParams.get('userName')
    const isAdmin = searchParams.get('isAdmin') === 'true'

    let notifications: any[] = []

    if (isAdmin) {
      const result = await pool.query(`
        SELECT e.id, e.ticket_id, e.event_type, e.old_value, e.new_value, e.created_at, e.created_by,
               t.ticket_number, t.title, t.state, t.priority, t.created_by as ticket_creator
        FROM ticket_events e
        JOIN tickets t ON e.ticket_id = t.id
        ORDER BY e.created_at DESC
        LIMIT 20
      `)
      notifications = result.rows
    } else if (userName) {
      const result = await pool.query(`
        SELECT e.id, e.ticket_id, e.event_type, e.old_value, e.new_value, e.created_at, e.created_by,
               t.ticket_number, t.title, t.state, t.priority, t.created_by as ticket_creator
        FROM ticket_events e
        JOIN tickets t ON e.ticket_id = t.id
        WHERE t.created_by = $1
        ORDER BY e.created_at DESC
        LIMIT 20
      `, [userName])
      notifications = result.rows
    }

    return NextResponse.json(notifications)
  } catch (error) {
    console.error('Error fetching notifications:', error)
    return NextResponse.json([], { status: 200 })
  }
}
