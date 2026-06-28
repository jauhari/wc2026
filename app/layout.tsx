import { Geist, Geist_Mono } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"
import { AppSidebar } from "@/components/app-sidebar"
import { AppHeader } from "@/components/app-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Toaster } from "@/components/ui/sonner"
import { CloudflareAnalytics } from "@/components/cloudflare-analytics"

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata = {
  title: "World Cup 2026 Monitor — WE ARE 26",
  description:
    "Pantau Piala Dunia 2026: hasil pertandingan, klasemen, jadwal, bagan, dan statistik. Tuan rumah USA, Kanada & Meksiko.",
  applicationName: "WC 2026 Monitor",
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/apple-icon.svg", type: "image/svg+xml", sizes: "180x180" }],
  },
  appleWebApp: {
    capable: true,
    title: "WC 2026",
    statusBarStyle: "default",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="id"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, "font-sans", geist.variable)}
    >
      <body>
        <ThemeProvider>
          <TooltipProvider>
            <SidebarProvider>
              <AppSidebar />
              <SidebarInset>
                <AppHeader />
                <main className="flex-1">{children}</main>
              </SidebarInset>
            </SidebarProvider>
            <Toaster richColors position="top-right" />
          </TooltipProvider>
          <CloudflareAnalytics />
        </ThemeProvider>
      </body>
    </html>
  )
}
