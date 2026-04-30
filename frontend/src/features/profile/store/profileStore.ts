import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface CvFile {
  name: string
  size: number
  uploadedAt: string
  data: string   // base64 data URL
}

export interface ExtendedProfile {
  phone: string
  title: string
  location: string
  bio: string
  linkedin: string
  portfolio: string
  cv: CvFile | null
}

interface ProfileStore {
  profile: ExtendedProfile
  update: (fields: Partial<ExtendedProfile>) => void
}

export const useProfileStore = create<ProfileStore>()(
  persist(
    (set) => ({
      profile: {
        phone:     '',
        title:     '',
        location:  '',
        bio:       '',
        linkedin:  '',
        portfolio: '',
        cv:        null,
      },
      update: (fields) =>
        set((state) => ({ profile: { ...state.profile, ...fields } })),
    }),
    {
      name: 'profile-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
