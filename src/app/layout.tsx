import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'IT Support Hub',
  description: 'Sistema de soporte técnico y gestión de tickets',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className="antialiased">{children}</body>
    </html>
  )
}
