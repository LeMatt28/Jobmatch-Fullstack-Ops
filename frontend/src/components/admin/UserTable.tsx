'use client'

import React, { useState } from 'react'
import { Shield, Ban, Trash2, MoreHorizontal, UserCheck } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogFooter, DialogDescription,
} from '@/components/ui/dialog'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { Pagination } from '@/components/common/Pagination'
import { useAdminUsers } from '@/features/admin/hooks/useAdminUsers'
import type { AdminUser } from '@/features/admin/types/admin.types'
import { cn } from '@/lib/utils/cn'
import { formatDistanceToNow, parseISO } from 'date-fns'
import { fr } from 'date-fns/locale'

const STATUS_BADGE: Record<AdminUser['status'], { variant: 'success' | 'destructive' | 'warning'; label: string }> = {
  active:    { variant: 'success',     label: 'Actif' },
  suspended: { variant: 'destructive', label: 'Suspendu' },
  pending:   { variant: 'warning',     label: 'En attente' },
}

export function UserTable() {
  const [page, setPage] = useState(1)
  const [confirmDelete, setConfirmDelete] = useState<AdminUser | null>(null)
  const { users, totalPages, isLoading, updateStatus, deleteUser, isUpdating } = useAdminUsers(page)

  const handleDelete = () => {
    if (!confirmDelete) return
    deleteUser(confirmDelete.id)
    setConfirmDelete(null)
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Shield className="h-4 w-4 text-primary" aria-hidden="true" />
            Gestion des utilisateurs
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex h-40 items-center justify-center">
              <LoadingSpinner />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm" aria-label="Liste des utilisateurs">
                <thead>
                  <tr className="border-b border-border text-left">
                    {['Utilisateur', 'Rôle', 'Statut', 'Inscrit', 'Dernière connexion', 'Actions'].map((h) => (
                      <th key={h} scope="col" className="pb-3 pr-4 text-xs font-semibold uppercase tracking-wider text-text-disabled">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {users.map((user) => {
                    const status = STATUS_BADGE[user.status]
                    return (
                      <tr key={user.id} className="hover:bg-muted/50 transition-colors">
                        <td className="py-3 pr-4">
                          <div>
                            <p className="font-medium text-text-primary">{user.firstName} {user.lastName}</p>
                            <p className="text-xs text-text-secondary">{user.email}</p>
                          </div>
                        </td>
                        <td className="py-3 pr-4">
                          <Badge variant={user.role === 'admin' ? 'accent' : 'ghost'}>
                            {user.role === 'admin' ? 'Admin' : 'Utilisateur'}
                          </Badge>
                        </td>
                        <td className="py-3 pr-4">
                          <Badge variant={status.variant}>{status.label}</Badge>
                        </td>
                        <td className="py-3 pr-4 text-xs text-text-secondary">
                          {formatDistanceToNow(parseISO(user.createdAt), { addSuffix: true, locale: fr })}
                        </td>
                        <td className="py-3 pr-4 text-xs text-text-secondary">
                          {user.lastLogin
                            ? formatDistanceToNow(parseISO(user.lastLogin), { addSuffix: true, locale: fr })
                            : '—'}
                        </td>
                        <td className="py-3">
                          <div className="flex items-center gap-1">
                            {user.status === 'suspended' ? (
                              <Button
                                variant="ghost" size="icon-sm"
                                onClick={() => updateStatus({ id: user.id, status: 'active' })}
                                disabled={isUpdating}
                                aria-label={`Réactiver ${user.firstName} ${user.lastName}`}
                                title="Réactiver"
                              >
                                <UserCheck className="h-4 w-4 text-[#1A5C3A]" />
                              </Button>
                            ) : (
                              <Button
                                variant="ghost" size="icon-sm"
                                onClick={() => updateStatus({ id: user.id, status: 'suspended' })}
                                disabled={isUpdating || user.role === 'admin'}
                                aria-label={`Suspendre ${user.firstName} ${user.lastName}`}
                                title="Suspendre"
                              >
                                <Ban className="h-4 w-4 text-warning" />
                              </Button>
                            )}
                            <Button
                              variant="ghost" size="icon-sm"
                              onClick={() => setConfirmDelete(user)}
                              disabled={user.role === 'admin'}
                              aria-label={`Supprimer ${user.firstName} ${user.lastName}`}
                              title="Supprimer"
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
          <div className="mt-4">
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        </CardContent>
      </Card>

      {/* Confirm delete dialog */}
      <Dialog open={!!confirmDelete} onOpenChange={(o) => !o && setConfirmDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer l&apos;utilisateur</DialogTitle>
            <DialogDescription>
              Voulez-vous vraiment supprimer <strong>{confirmDelete?.firstName} {confirmDelete?.lastName}</strong> ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDelete(null)}>Annuler</Button>
            <Button variant="destructive" onClick={handleDelete}>Supprimer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
