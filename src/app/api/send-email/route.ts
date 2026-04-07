import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { ticketNumber, title, description, priority, category, createdBy } = body

    const priorityLabel: Record<string, string> = {
      high: 'Alta',
      medium: 'Media', 
      low: 'Baja'
    }

    const resendApiKey = process.env.RESEND_API_KEY
    
    if (!resendApiKey) {
      console.log('Email not sent - RESEND_API_KEY not configured')
      return NextResponse.json({ success: false, message: 'Email service not configured' })
    }

    const htmlContent = `
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
              <td style="padding: 10px 0;">
                <span style="background: ${priority === 'high' ? '#fee2e2' : priority === 'medium' ? '#fef3c7' : '#dcfce7'}; color: ${priority === 'high' ? '#dc2626' : priority === 'medium' ? '#d97706' : '#16a34a'}; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold;">
                  ${priorityLabel[priority] || priority}
                </span>
              </td>
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
        </div>
      </div>
    `

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'IT Support <onboarding@resend.dev>',
        to: ['helpdesk@idata.global'],
        subject: `🎫 Nuevo Ticket: ${ticketNumber} - ${title}`,
        html: htmlContent
      })
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('Resend error:', error)
      return NextResponse.json({ success: false, error })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error sending email:', error)
    return NextResponse.json({ error: 'Error sending email' }, { status: 500 })
  }
}
