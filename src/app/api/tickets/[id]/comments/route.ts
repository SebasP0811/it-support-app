import { NextResponse } from 'next/server'
import pool from '@/lib/db'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const result = await pool.query(`
      SELECT * FROM ticket_comments 
      WHERE ticket_id = $1 
      ORDER BY created_at ASC
    `, [id])
    
    return NextResponse.json(result.rows)
  } catch (error) {
    console.error('Error fetching comments:', error)
    return NextResponse.json({ error: 'Error fetching comments' }, { status: 500 })
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { author, content } = body

    if (!content || !content.trim()) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 })
    }

    const result = await pool.query(`
      INSERT INTO ticket_comments (ticket_id, author, content)
      VALUES ($1, $2, $3)
      RETURNING *
    `, [id, author || 'Anonymous', content.trim()])

    return NextResponse.json(result.rows[0], { status: 201 })
  } catch (error) {
    console.error('Error creating comment:', error)
    return NextResponse.json({ error: 'Error creating comment', details: String(error) }, { status: 500 })
  }
}
