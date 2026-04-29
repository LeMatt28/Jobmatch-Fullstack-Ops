'use client'

import React from 'react'
import { DashboardLayout } from '@/components/layout/DashboardNav'
import { useAuth } from '@/features/auth/hooks/useAuth'

export default function DashboardGroupLayout({ children }: { children: React.ReactNode }) {
  const { user, isAdmin, logout } = useAuth()

  return (
    <DashboardLayout
      isAdmin={isAdmin}
      userName={user ? `${user.firstName} ${user.lastName}` : undefined}
      onLogout={logout}
    >
      {children}
    </DashboardLayout>
  )
}
