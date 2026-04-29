'use client'

import React, { useState } from 'react'
import { Menu } from 'lucide-react'
import { Header } from './Header'
import { Sidebar } from './Sidebar'
import { Button } from '@/components/ui/button'

export interface DashboardNavProps {
  isAdmin?: boolean
  userName?: string
  onLogout?: () => void
  children: React.ReactNode
}

export function DashboardLayout({ isAdmin = false, userName, onLogout, children }: DashboardNavProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <Header
        isAuthenticated
        isAdmin={isAdmin}
        userName={userName}
        onLogout={onLogout}
      />

      <div className="flex">
        {/* Mobile sidebar toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="fixed bottom-4 left-4 z-50 lg:hidden shadow-card border border-border bg-surface"
          onClick={() => setSidebarOpen(true)}
          aria-label="Ouvrir la navigation"
          aria-controls="sidebar"
          aria-expanded={sidebarOpen}
        >
          <Menu className="h-5 w-5" />
        </Button>

        <Sidebar
          isAdmin={isAdmin}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main content */}
        <main
          id="main-content"
          className="flex-1 lg:ml-64 min-h-[calc(100vh-4rem)]"
          tabIndex={-1}
        >
          <div className="page-container py-6 animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
