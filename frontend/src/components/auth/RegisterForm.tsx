'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/features/auth/hooks/useAuth'
import {
  registerSchema,
  type RegisterFormValues,
  getPasswordStrength,
} from '@/features/auth/utils/auth.utils'
import { ROUTES } from '@/lib/constants/routes'
import { cn } from '@/lib/utils/cn'

const STRENGTH_COLORS: Record<string, string> = {
  'Très faible': 'bg-red-400',
  'Faible':      'bg-orange-400',
  'Moyen':       'bg-yellow-400',
  'Fort':        'bg-green-400',
  'Très fort':   'bg-primary',
}

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [termsError, setTermsError] = useState(false)
  const { register: registerUser, isRegisterLoading, registerError } = useAuth()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: 'onBlur',
  })

  const password = watch('password', '')
  const strength = password.length > 0 ? getPasswordStrength(password) : null

  const onSubmit = async (values: RegisterFormValues) => {
    if (!termsAccepted) {
      setTermsError(true)
      return
    }
    await registerUser(values)
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-primary">Créer un compte</h1>
        <p className="mt-1.5 text-sm text-text-secondary">
          Rejoignez des milliers de candidats actifs — c&apos;est gratuit
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        aria-label="Formulaire d'inscription"
        className="space-y-5"
      >
        {/* Global error */}
        {registerError && (
          <div
            role="alert"
            aria-live="assertive"
            className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3"
          >
            <AlertCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" aria-hidden="true" />
            <p className="text-sm text-red-600">{registerError}</p>
          </div>
        )}

        {/* First name + Last name */}
        <div className="grid grid-cols-2 gap-3">
          <Input
            {...register('firstName')}
            label="Prénom"
            type="text"
            autoComplete="given-name"
            placeholder="Jean"
            error={errors.firstName?.message}
            required
          />
          <Input
            {...register('lastName')}
            label="Nom"
            type="text"
            autoComplete="family-name"
            placeholder="Dupont"
            error={errors.lastName?.message}
            required
          />
        </div>

        {/* Email */}
        <Input
          {...register('email')}
          label="Adresse email"
          type="email"
          autoComplete="email"
          placeholder="vous@exemple.com"
          error={errors.email?.message}
          required
        />

        {/* Password */}
        <div className="space-y-2">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-sm font-medium text-text-primary">
              Mot de passe <span className="text-destructive" aria-hidden="true">*</span>
            </label>
            <div className="relative">
              <input
                {...register('password')}
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="••••••••"
                aria-invalid={!!errors.password}
                aria-describedby={[
                  errors.password ? 'password-error' : '',
                  'password-hint',
                ].filter(Boolean).join(' ') || undefined}
                className={cn(
                  'flex h-10 w-full rounded-md border bg-surface px-3 py-2 pr-10 text-sm',
                  'text-text-primary placeholder:text-text-disabled',
                  'transition-colors duration-150',
                  'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
                  errors.password ? 'border-destructive focus:ring-destructive' : 'border-border'
                )}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password ? (
              <p id="password-error" role="alert" className="text-xs text-destructive font-medium">
                {errors.password.message}
              </p>
            ) : (
              <p id="password-hint" className="text-xs text-text-secondary">
                8 caractères minimum, une majuscule, un chiffre
              </p>
            )}
          </div>

          {/* Strength indicator */}
          {strength && (
            <div aria-live="polite" aria-label={`Force du mot de passe : ${strength.label}`}>
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      'h-1.5 flex-1 rounded-full transition-all duration-300',
                      i < strength.score
                        ? (STRENGTH_COLORS[strength.label] ?? 'bg-primary')
                        : 'bg-border'
                    )}
                  />
                ))}
              </div>
              <p className="mt-1 text-xs text-text-secondary">{strength.label}</p>
            </div>
          )}
        </div>

        {/* Confirm password */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="confirm-password" className="text-sm font-medium text-text-primary">
            Confirmer le mot de passe <span className="text-destructive" aria-hidden="true">*</span>
          </label>
          <div className="relative">
            <input
              {...register('confirmPassword')}
              id="confirm-password"
              type={showConfirm ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="••••••••"
              aria-invalid={!!errors.confirmPassword}
              aria-describedby={errors.confirmPassword ? 'confirm-error' : undefined}
              className={cn(
                'flex h-10 w-full rounded-md border bg-surface px-3 py-2 pr-10 text-sm',
                'text-text-primary placeholder:text-text-disabled',
                'transition-colors duration-150',
                'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
                errors.confirmPassword ? 'border-destructive focus:ring-destructive' : 'border-border'
              )}
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              aria-label={showConfirm ? 'Masquer la confirmation' : 'Afficher la confirmation'}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors"
            >
              {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p id="confirm-error" role="alert" className="text-xs text-destructive font-medium">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* RGPD */}
        <div className="space-y-1">
          <div className="flex items-start gap-3">
            <div className="flex h-5 items-center mt-0.5">
              <input
                id="terms"
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => {
                  setTermsAccepted(e.target.checked)
                  if (e.target.checked) setTermsError(false)
                }}
                aria-invalid={termsError}
                aria-describedby={termsError ? 'terms-error' : undefined}
                className="h-4 w-4 rounded border-border text-primary focus:ring-2 focus:ring-primary focus:ring-offset-2 accent-primary"
              />
            </div>
            <label htmlFor="terms" className="text-sm text-text-secondary leading-relaxed">
              J&apos;accepte les{' '}
              <Link href="/legal/terms" className="text-primary hover:underline">
                conditions d&apos;utilisation
              </Link>
              {' '}et la{' '}
              <Link href="/legal/privacy" className="text-primary hover:underline">
                politique de confidentialité
              </Link>
            </label>
          </div>
          {termsError && (
            <p id="terms-error" role="alert" className="text-xs text-destructive font-medium pl-7">
              Vous devez accepter les CGU pour continuer
            </p>
          )}
        </div>

        {/* Submit */}
        <Button
          type="submit"
          className="w-full"
          disabled={isRegisterLoading}
          aria-busy={isRegisterLoading}
        >
          {isRegisterLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Création en cours…
            </>
          ) : (
            'Créer mon compte'
          )}
        </Button>

        {/* Switch to login */}
        <p className="text-center text-sm text-text-secondary">
          Déjà un compte ?{' '}
          <Link
            href={ROUTES.login}
            className="font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
          >
            Se connecter
          </Link>
        </p>
      </form>
    </div>
  )
}
