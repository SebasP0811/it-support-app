import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { ticketNumber, title, description, priority, category, createdBy } = body

    console.log('=== EMAIL REQUEST ===')
    console.log('Ticket:', ticketNumber)
    console.log('Title:', title)

    const resendApiKey = process.env.RESEND_API_KEY
    console.log('API Key exists:', !!resendApiKey)
    
    if (!resendApiKey) {
      console.error('RESEND_API_KEY not found')
      return NextResponse.json({ success: false, error: 'API key not configured' })
    }

    const priorityLabel: Record<string, string> = {
      high: 'Alta',
      medium: 'Media', 
      low: 'Baja'
    }

    const htmlContent = `
      <h1>🎫 Nuevo Ticket: ${ticketNumber}</h1>
      <p><strong>Título:</strong> ${title}</p>
      <p><strong>Descripción:</strong> ${description}</p>
      <p><strong>Prioridad:</strong> ${priorityLabel[priority] || priority}</p>
      <p><strong>Categoría:</strong> ${category}</p>
      <p><strong>Creado por:</strong> ${createdBy}</p>
      <p><strong>Fecha:</strong> ${new Date().toLocaleString('es-ES')}</p>
    `

    console.log('Sending to Resend...')

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'onboarding@resend.dev',
        to: ['helpdesk@idata.global'],
        subject: `Ticket: ${ticketNumber} - ${title}`,
        html: htmlContent
      })
    })

    const responseData = await response.text()
    console.log('Resend response status:', response.status)
    console.log('Resend response:', responseData)

    if (!response.ok) {
      return NextResponse.json({ success: false, error: responseData, status: response.status })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Email error:', error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
