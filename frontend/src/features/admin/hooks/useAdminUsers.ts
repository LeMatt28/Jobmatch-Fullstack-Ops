import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api/axios.config'
import { ENDPOINTS } from '@/lib/api/endpoints'
import type { AdminUser, PaginatedResponse } from '../types/admin.types'

async function fetchUsers(page: number, pageSize: number): Promise<PaginatedResponse<AdminUser>> {
  const { data } = await apiClient.get<PaginatedResponse<AdminUser>>(ENDPOINTS.users.list, {
    params: { page, pageSize },
  })
  return data
}

async function updateUserStatus(id: string, status: AdminUser['status']): Promise<AdminUser> {
  const { data } = await apiClient.patch<AdminUser>(ENDPOINTS.users.update(id), { status })
  return data
}

async function deleteUser(id: string): Promise<void> {
  await apiClient.delete(ENDPOINTS.users.delete(id))
}

const FALLBACK_USERS: PaginatedResponse<AdminUser> = {
  items: [
    { id: '1', firstName: 'Alice', lastName: 'Martin', email: 'alice@example.com', role: 'user', status: 'active', createdAt: '2024-01-15', jobsViewed: 42, lastLogin: '2024-04-28' },
    { id: '2', firstName: 'Bob', lastName: 'Dupont', email: 'bob@example.com', role: 'user', status: 'active', createdAt: '2024-02-10', jobsViewed: 18, lastLogin: '2024-04-25' },
    { id: '3', firstName: 'Claire', lastName: 'Bernard', email: 'claire@example.com', role: 'admin', status: 'active', createdAt: '2023-11-01', jobsViewed: 120, lastLogin: '2024-04-29' },
    { id: '4', firstName: 'David', lastName: 'Petit', email: 'david@example.com', role: 'user', status: 'suspended', createdAt: '2024-03-20', jobsViewed: 5 },
    { id: '5', firstName: 'Emma', lastName: 'Leroy', email: 'emma@example.com', role: 'user', status: 'pending', createdAt: '2024-04-27', jobsViewed: 0 },
  ],
  total: 5, page: 1, pageSize: 10, totalPages: 1,
}

export function useAdminUsers(page = 1, pageSize = 10) {
  const qc = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'users', page, pageSize],
    queryFn: () => fetchUsers(page, pageSize),
    placeholderData: FALLBACK_USERS,
  })

  const updateStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: AdminUser['status'] }) =>
      updateUserStatus(id, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'users'] }),
  })

  const remove = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'users'] }),
  })

  return {
    users: data?.items ?? FALLBACK_USERS.items,
    total: data?.total ?? 0,
    totalPages: data?.totalPages ?? 1,
    isLoading,
    updateStatus: updateStatus.mutate,
    deleteUser: remove.mutate,
    isUpdating: updateStatus.isPending,
  }
}
