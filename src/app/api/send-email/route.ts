import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { ticketNumber, title, description, priority, category, createdBy } = body

    const resendApiKey = process.env.RESEND_API_KEY
    
    if (!resendApiKey) {
      console.error('RESEND_API_KEY not found')
      return NextResponse.json({ success: false, error: 'API key not configured' })
    }

    const priorityLabel: Record<string, string> = {
      high: 'Alta 🔴',
      medium: 'Media 🟡', 
      low: 'Baja 🟢'
    }

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #3B82F6, #8B5CF6); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">🎫 IT Support - Nuevo Ticket</h1>
        </div>
        <div style="padding: 20px; background: white;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Ticket:</td>
              <td style="padding: 8px 0; font-weight: bold; color: #1e293b; font-size: 14px;">${ticketNumber}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Título:</td>
              <td style="padding: 8px 0; font-weight: bold; color: #1e293b; font-size: 14px;">${title}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Descripción:</td>
              <td style="padding: 8px 0; color: #475569; font-size: 14px;">${description}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Prioridad:</td>
              <td style="padding: 8px 0; font-size: 14px;">
                <span style="background: ${priority === 'high' ? '#fee2e2' : priority === 'medium' ? '#fef3c7' : '#dcfce7'}; 
                      color: ${priority === 'high' ? '#dc2626' : priority === 'medium' ? '#d97706' : '#16a34a'}; 
                      padding: 4px 12px; border-radius: 20px; font-weight: bold; font-size: 12px;">
                  ${priorityLabel[priority] || priority}
                </span>
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Categoría:</td>
              <td style="padding: 8px 0; color: #1e293b; font-size: 14px;">${category}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Creado por:</td>
              <td style="padding: 8px 0; color: #1e293b; font-size: 14px;">${createdBy}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Fecha:</td>
              <td style="padding: 8px 0; color: #1e293b; font-size: 14px;">${new Date().toLocaleString('es-ES')}</td>
            </tr>
          </table>
          
          <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center;">
            <p style="color: #64748b; font-size: 12px;">IT Support Hub - Sistema de Gestión de Tickets</p>
          </div>
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
        from: 'IT Support <helpdesk@idata.global>',
        to: ['helpdesk@idata.global'],
        subject: `🎫 Ticket: ${ticketNumber} - ${title}`,
        html: htmlContent
      })
    })

    const responseData = await response.json()
    
    if (!response.ok) {
      console.error('Resend error:', responseData)
      return NextResponse.json({ success: false, error: responseData })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Email error:', error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
