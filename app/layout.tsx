import type React from "react"
import type { Metadata } from "next"
import { Creepster, Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const creepster = Creepster({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-creepster",
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "Rocktober Challenge | North YMCA",
  description: "Rules, FAQs, and climbing challenges for the North YMCA Rocktober Challenge.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${creepster.variable} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
