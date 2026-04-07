import { NextResponse } from 'next/server'
import pool from '@/lib/db'

export async function GET() {
  try {
    const result = await pool.query('SELECT * FROM technicians ORDER BY name')
    return NextResponse.json(result.rows)
  } catch (error) {
    console.error('Error fetching technicians:', error)
    return NextResponse.json({ error: 'Error fetching technicians' }, { status: 500 })
  }
}
