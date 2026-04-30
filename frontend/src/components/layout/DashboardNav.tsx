'use client'

import React from 'react'
import { Header } from './Header'
import { Footer } from './Footer'

export interface DashboardNavProps {
  isAdmin?: boolean
  userName?: string
  onLogout?: () => void
  children: React.ReactNode
}

export function DashboardLayout({ isAdmin = false, userName, onLogout, children }: DashboardNavProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header
        isAuthenticated
        isAdmin={isAdmin}
        userName={userName}
        onLogout={onLogout}
      />

      <main
        id="main-content"
        className="flex-1"
        tabIndex={-1}
      >
        <div className="page-container py-6 animate-fade-in">
          {children}
        </div>
      </main>

      <Footer />
    </div>
  )
}
