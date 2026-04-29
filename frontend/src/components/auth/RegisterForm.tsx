'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Loader2, Check } from 'lucide-react'
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

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false)
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
  const strength = password ? getPasswordStrength(password) : null

  const onSubmit = async (values: RegisterFormValues) => {
    await registerUser(values)
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-text-primary">Créer un compte</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Rejoignez des milliers de candidats actifs
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
            className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
          >
            {registerError}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
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

        <Input
          {...register('email')}
          label="Adresse email"
          type="email"
          autoComplete="email"
          placeholder="vous@exemple.com"
          error={errors.email?.message}
          required
        />

        <div className="space-y-2">
          <div className="relative">
            <Input
              {...register('password')}
              label="Mot de passe"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="••••••••"
              error={errors.password?.message}
              hint="8 caractères minimum, une majuscule, un chiffre"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
              className={cn(
                'absolute right-3 text-text-secondary hover:text-text-primary transition-colors',
                errors.password ? 'top-8' : 'top-9'
              )}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          {/* Password strength indicator */}
          {strength && (
            <div aria-live="polite" aria-label={`Force du mot de passe : ${strength.label}`}>
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      'h-1 flex-1 rounded-full transition-colors duration-300',
                      i < strength.score ? strength.color : 'bg-border'
                    )}
                  />
                ))}
              </div>
              <p className="mt-1 text-xs text-text-secondary">{strength.label}</p>
            </div>
          )}
        </div>

        <Input
          {...register('confirmPassword')}
          label="Confirmer le mot de passe"
          type={showPassword ? 'text' : 'password'}
          autoComplete="new-password"
          placeholder="••••••••"
          error={errors.confirmPassword?.message}
          required
        />

        {/* RGPD */}
        <div className="flex items-start gap-3">
          <div className="flex h-5 items-center">
            <input
              id="terms"
              type="checkbox"
              required
              aria-required="true"
              className="h-4 w-4 rounded border-border text-primary focus:ring-2 focus:ring-primary focus:ring-offset-2"
            />
          </div>
          <label htmlFor="terms" className="text-sm text-text-secondary leading-relaxed">
            J&apos;accepte les{' '}
            <Link href="/terms" className="text-primary hover:underline">conditions d&apos;utilisation</Link>
            {' '}et la{' '}
            <Link href="/privacy" className="text-primary hover:underline">politique de confidentialité</Link>
          </label>
        </div>

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
            <>
              <Check className="h-4 w-4" aria-hidden="true" />
              Créer mon compte
            </>
          )}
        </Button>

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
