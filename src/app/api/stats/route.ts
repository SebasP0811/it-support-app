export const runtime = 'nodejs'
import { NextResponse } from 'next/server'
import pool from '@/lib/db'

export async function GET() {
  try {
    const totalResult = await pool.query('SELECT COUNT(*) FROM tickets')
    const openResult = await pool.query("SELECT COUNT(*) FROM tickets WHERE state = 'open'")
    const inProgressResult = await pool.query("SELECT COUNT(*) FROM tickets WHERE state = 'inProgress'")
    const resolvedResult = await pool.query("SELECT COUNT(*) FROM tickets WHERE state IN ('resolved', 'closed')")
    const criticalResult = await pool.query("SELECT COUNT(*) FROM tickets WHERE priority = 'high' AND state = 'open'")

    const byCategoryResult = await pool.query(`
      SELECT c.name, COUNT(t.id) as count
      FROM categories c
      LEFT JOIN tickets t ON c.id = t.category_id
      GROUP BY c.id, c.name
      ORDER BY count DESC
    `)

    const byPriorityResult = await pool.query(`
      SELECT priority, COUNT(*) as count
      FROM tickets
      GROUP BY priority
    `)

    return NextResponse.json({
      total: parseInt(totalResult.rows[0].count),
      open: parseInt(openResult.rows[0].count),
      inProgress: parseInt(inProgressResult.rows[0].count),
      resolved: parseInt(resolvedResult.rows[0].count),
      critical: parseInt(criticalResult.rows[0].count),
      byCategory: byCategoryResult.rows,
      byPriority: byPriorityResult.rows
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json({ error: 'Error fetching stats' }, { status: 500 })
  }
}
