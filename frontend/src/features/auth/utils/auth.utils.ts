import { z } from 'zod'

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'L\'email est requis')
    .email('Format d\'email invalide'),
  password: z
    .string()
    .min(1, 'Le mot de passe est requis')
    .min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
})

export const registerSchema = z
  .object({
    firstName: z
      .string()
      .min(1, 'Le prénom est requis')
      .min(2, 'Le prénom doit contenir au moins 2 caractères'),
    lastName: z
      .string()
      .min(1, 'Le nom est requis')
      .min(2, 'Le nom doit contenir au moins 2 caractères'),
    email: z
      .string()
      .min(1, 'L\'email est requis')
      .email('Format d\'email invalide'),
    password: z
      .string()
      .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
      .regex(/[A-Z]/, 'Le mot de passe doit contenir au moins une majuscule')
      .regex(/[0-9]/, 'Le mot de passe doit contenir au moins un chiffre'),
    confirmPassword: z.string().min(1, 'La confirmation est requise'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Les mots de passe ne correspondent pas',
  })

export type LoginFormValues    = z.infer<typeof loginSchema>
export type RegisterFormValues = z.infer<typeof registerSchema>

export function getPasswordStrength(password: string): {
  score: number
  label: string
  color: string
} {
  let score = 0
  if (password.length >= 8)        score++
  if (password.length >= 12)       score++
  if (/[A-Z]/.test(password))     score++
  if (/[0-9]/.test(password))     score++
  if (/[^A-Za-z0-9]/.test(password)) score++

  if (score <= 1) return { score, label: 'Très faible', color: 'bg-red-400' }
  if (score === 2) return { score, label: 'Faible',     color: 'bg-warning' }
  if (score === 3) return { score, label: 'Moyen',      color: 'bg-yellow-400' }
  if (score === 4) return { score, label: 'Fort',       color: 'bg-success' }
  return { score, label: 'Très fort', color: 'bg-primary' }
}
