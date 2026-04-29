import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api/axios.config'
import { ENDPOINTS } from '@/lib/api/endpoints'
import type { AdminOffer, OfferModerationStatus, PaginatedResponse } from '../types/admin.types'

async function fetchOffers(status?: OfferModerationStatus): Promise<PaginatedResponse<AdminOffer>> {
  const { data } = await apiClient.get<PaginatedResponse<AdminOffer>>(ENDPOINTS.offers.list, {
    params: status ? { status } : {},
  })
  return data
}

async function moderateOffer(id: string, status: OfferModerationStatus): Promise<void> {
  await apiClient.patch(ENDPOINTS.offers.moderate(id), { status })
}

const FALLBACK_OFFERS: PaginatedResponse<AdminOffer> = {
  items: [
    { id: '1', title: 'Développeur React', company: 'TechCorp', location: 'Paris', contractType: 'CDI', status: 'pending', source: 'LinkedIn', publishedAt: '2024-04-28', reportCount: 0 },
    { id: '2', title: 'Data Scientist', company: 'DataLab', location: 'Lyon', contractType: 'CDI', status: 'pending', source: 'Indeed', publishedAt: '2024-04-27', reportCount: 2, reportReason: 'Salaire non conforme' },
    { id: '3', title: 'DevOps Engineer', company: 'CloudScale', location: 'Remote', contractType: 'Freelance', status: 'approved', source: 'WTTJ', publishedAt: '2024-04-26', reportCount: 0 },
    { id: '4', title: 'UX Designer', company: 'DesignStudio', location: 'Bordeaux', contractType: 'CDD', status: 'rejected', source: 'Glassdoor', publishedAt: '2024-04-25', reportCount: 3, reportReason: 'Offre trompeuse' },
  ],
  total: 4, page: 1, pageSize: 10, totalPages: 1,
}

export function useAdminOffers(status?: OfferModerationStatus) {
  const qc = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'offers', status],
    queryFn: () => fetchOffers(status),
    placeholderData: FALLBACK_OFFERS,
  })

  const moderate = useMutation({
    mutationFn: ({ id, status: s }: { id: string; status: OfferModerationStatus }) =>
      moderateOffer(id, s),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'offers'] }),
  })

  return {
    offers: data?.items ?? FALLBACK_OFFERS.items,
    total: data?.total ?? 0,
    isLoading,
    moderate: moderate.mutate,
    isModerating: moderate.isPending,
  }
}
