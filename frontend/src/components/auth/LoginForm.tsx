'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react'
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
    <div className="w-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-primary">Bon retour !</h1>
        <p className="mt-1.5 text-sm text-text-secondary">
          Connectez-vous pour accéder à vos offres personnalisées
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
            className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3"
          >
            <AlertCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" aria-hidden="true" />
            <p className="text-sm text-red-600">{loginError}</p>
          </div>
        )}

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
        <div className="flex flex-col gap-1.5">
          <label htmlFor="password" className="text-sm font-medium text-text-primary">
            Mot de passe <span className="text-destructive" aria-hidden="true">*</span>
          </label>
          <div className="relative">
            <input
              {...register('password')}
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="••••••••"
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? 'password-error' : undefined}
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
          {errors.password && (
            <p id="password-error" role="alert" className="text-xs text-destructive font-medium">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Remember me */}
        <div className="flex items-center gap-2">
          <input
            id="remember"
            type="checkbox"
            className="h-4 w-4 rounded border-border text-primary focus:ring-2 focus:ring-primary focus:ring-offset-2 accent-primary"
          />
          <label htmlFor="remember" className="text-sm text-text-secondary select-none">
            Se souvenir de moi
          </label>
        </div>

        {/* Submit */}
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

        {/* Switch to register */}
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
