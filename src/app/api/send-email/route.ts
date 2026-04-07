import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { ticketNumber, title, description, priority, category, createdBy } = body

    const priorityLabel = {
      high: '🔴 Alta',
      medium: '🟡 Media', 
      low: '🟢 Baja'
    }

    await resend.emails.send({
      from: 'IT Support <noreply@resend.dev>',
      to: 'helpdesk@idata.global',
      subject: `🎫 Nuevo Ticket: ${ticketNumber} - ${title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%); padding: 20px; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">🎫 Nuevo Ticket Creado</h1>
          </div>
          <div style="background: #f8fafc; padding: 20px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 10px 10px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; color: #64748b; width: 120px;">Ticket:</td>
                <td style="padding: 10px 0; font-weight: bold; color: #1e293b;">${ticketNumber}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #64748b;">Título:</td>
                <td style="padding: 10px 0; font-weight: bold; color: #1e293b;">${title}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #64748b;">Descripción:</td>
                <td style="padding: 10px 0; color: #475569;">${description}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #64748b;">Prioridad:</td>
                <td style="padding: 10px 0;"><span style="background: ${priority === 'high' ? '#fee2e2' : priority === 'medium' ? '#fef3c7' : '#dcfce7'}; color: ${priority === 'high' ? '#dc2626' : priority === 'medium' ? '#d97706' : '#16a34a'}; padding: 4px 12px; border-radius: 20px; font-size: 12px;">${priorityLabel[priority as keyof typeof priorityLabel] || priority}</span></td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #64748b;">Categoría:</td>
                <td style="padding: 10px 0; color: #1e293b;">${category}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #64748b;">Creado por:</td>
                <td style="padding: 10px 0; color: #1e293b;">${createdBy}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #64748b;">Fecha:</td>
                <td style="padding: 10px 0; color: #1e293b;">${new Date().toLocaleString('es-ES')}</td>
              </tr>
            </table>
            
            <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
              <a href="${process.env.NEXT_PUBLIC_URL || 'https://it-support-app.vercel.app'}/tickets/${ticketId}" style="display: inline-block; background: #3B82F6; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">Ver Ticket →</a>
            </div>
          </div>
        </div>
      `
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error sending email:', error)
    return NextResponse.json({ error: 'Error sending email' }, { status: 500 })
  }
}
