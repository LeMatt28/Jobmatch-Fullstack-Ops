'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { loginSchema, type LoginFormValues } from '@/features/auth/utils/auth.utils'
import { ROUTES } from '@/lib/constants/routes'
import { cn } from '@/lib/utils/cn'

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const { login, isLoginLoading, loginError } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
  })

  const onSubmit = async (values: LoginFormValues) => {
    await login(values)
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-text-primary">Bon retour !</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Connectez-vous pour accéder à vos offres
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        aria-label="Formulaire de connexion"
        className="space-y-5"
      >
        {/* Global error */}
        {loginError && (
          <div
            role="alert"
            aria-live="assertive"
            className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
          >
            {loginError}
          </div>
        )}

        <Input
          {...register('email')}
          label="Adresse email"
          type="email"
          autoComplete="email"
          placeholder="vous@exemple.com"
          error={errors.email?.message}
          required
        />

        <div className="relative">
          <Input
            {...register('password')}
            label="Mot de passe"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            placeholder="••••••••"
            error={errors.password?.message}
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

        <div className="flex items-center justify-end">
          <Link
            href="/forgot-password"
            className="text-sm text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
          >
            Mot de passe oublié ?
          </Link>
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={isLoginLoading}
          aria-busy={isLoginLoading}
        >
          {isLoginLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Connexion en cours…
            </>
          ) : (
            'Se connecter'
          )}
        </Button>

        <p className="text-center text-sm text-text-secondary">
          Pas encore de compte ?{' '}
          <Link
            href={ROUTES.register}
            className="font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
          >
            S&apos;inscrire gratuitement
          </Link>
        </p>
      </form>
    </div>
  )
}
