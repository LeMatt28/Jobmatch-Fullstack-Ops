'use client'

import React from 'react'
import { DashboardLayout } from '@/components/layout/DashboardNav'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { LoadingPage } from '@/components/common/LoadingSpinner'
import { ROUTES } from '@/lib/constants/routes'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isAdmin, isAuthenticated, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) { router.replace(ROUTES.login); return }
    if (!isAdmin) router.replace(ROUTES.dashboard)
  }, [isAuthenticated, isAdmin, router])

  if (!isAuthenticated || !isAdmin) return <LoadingPage />

  return (
    <DashboardLayout
      isAdmin
      userName={user ? `${user.firstName} ${user.lastName}` : undefined}
      onLogout={logout}
    >
      {children}
    </DashboardLayout>
  )
}
