import type React from "react"
import type { Metadata } from "next"
import { Pixelify_Sans } from "next/font/google"
import { Analytics } from '@vercel/analytics/react'
import "./globals.css"
import { Suspense } from "react"

const pixelifySans = Pixelify_Sans({
  subsets: ["latin"],
  variable: "--font-pixelify-sans",
  weight: ["400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "Costanza - Aprenda a Programar de Forma Gamificada",
  description: "Plataforma de ensino gamificada para aprender programação de forma divertida e eficaz"
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${pixelifySans.variable} font-sans antialiased`}>
        <Suspense fallback={<div>Loading...</div>}>
          {children}
          <Analytics />
        </Suspense>
      </body>
    </html>
  )
}
