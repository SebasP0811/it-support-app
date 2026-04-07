export const runtime = 'nodejs'
import { NextResponse } from 'next/server'
import pool from '@/lib/db'

export async function GET() {
  try {
    const result = await pool.query('SELECT * FROM categories ORDER BY name')
    return NextResponse.json(result.rows)
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json({ error: 'Error fetching categories' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, description } = body

    const result = await pool.query(`
      INSERT INTO categories (name, description)
      VALUES ($1, $2)
      RETURNING *
    `, [name, description || ''])

    return NextResponse.json(result.rows[0], { status: 201 })
  } catch (error) {
    console.error('Error creating category:', error)
    return NextResponse.json({ error: 'Error creating category' }, { status: 500 })
  }
}
