export const runtime = 'nodejs'
import { NextResponse } from 'next/server'
import pool from '@/lib/db'

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT * FROM technicians 
      WHERE email IN ('helpdesk@idata.global', 'johan@idata.global', 'jaime@idata.global')
      ORDER BY name
    `)
    return NextResponse.json(result.rows || [])
  } catch (error) {
    console.error('Error fetching technicians:', error)
    return NextResponse.json([], { status: 200 })
  }
}
