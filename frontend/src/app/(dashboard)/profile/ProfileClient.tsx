'use client'

import React, { useState } from 'react'
import {
  User, Mail, Phone, MapPin, Briefcase, Link2,
  Pencil, Check, X, Lock, Eye, EyeOff,
  Bookmark, Heart, Calendar, Shield,
} from 'lucide-react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { JobCard } from '@/components/jobs/JobCard'
import { CvUpload } from '@/components/profile/CvUpload'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { useAuthStore } from '@/features/auth/store/authStore'
import { useProfileStore } from '@/features/profile/store/profileStore'
import { useSavedJobsStore } from '@/features/savedJobs/store/savedJobsStore'
import { useNotificationStore } from '@/features/notifications/store/notificationStore'
import { cn } from '@/lib/utils/cn'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

// ─── Profile Tab ──────────────────────────────────────────────────────────────

function ProfileTab() {
  const { user } = useAuth()
  const setUser = useAuthStore((s) => s.setUser)
  const { profile, update } = useProfileStore()

  const [editingBasic, setEditingBasic] = useState(false)
  const [editingPro, setEditingPro] = useState(false)
  const [savedMsg, setSavedMsg] = useState<string | null>(null)

  const [basicForm, setBasicForm] = useState({
    firstName: user?.firstName ?? '',
    lastName:  user?.lastName  ?? '',
    email:     user?.email     ?? '',
    phone:     profile.phone,
    location:  profile.location,
  })

  const [proForm, setProForm] = useState({
    title:     profile.title,
    bio:       profile.bio,
    linkedin:  profile.linkedin,
    portfolio: profile.portfolio,
  })

  function showSaved(msg: string) {
    setSavedMsg(msg)
    setTimeout(() => setSavedMsg(null), 3000)
  }

  function saveBasic() {
    if (!user) return
    setUser({ ...user, firstName: basicForm.firstName, lastName: basicForm.lastName, email: basicForm.email })
    update({ phone: basicForm.phone, location: basicForm.location })
    setEditingBasic(false)
    showSaved('Informations personnelles mises à jour.')
  }

  function savePro() {
    update(proForm)
    setEditingPro(false)
    showSaved('Informations professionnelles mises à jour.')
  }

  return (
    <div className="space-y-6">
      {savedMsg && (
        <div className="flex items-center gap-2 rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700 animate-fade-in">
          <Check className="h-4 w-4 shrink-0" />
          {savedMsg}
        </div>
      )}

      {/* Personal info */}
      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div>
            <CardTitle className="text-base">Informations personnelles</CardTitle>
            <CardDescription>Vos coordonnées et informations de contact.</CardDescription>
          </div>
          {!editingBasic && (
            <Button variant="outline" size="sm" onClick={() => {
              setBasicForm({ firstName: user?.firstName ?? '', lastName: user?.lastName ?? '', email: user?.email ?? '', phone: profile.phone, location: profile.location })
              setEditingBasic(true)
            }}>
              <Pencil className="h-3.5 w-3.5 mr-1.5" /> Modifier
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {editingBasic ? (
            <form onSubmit={(e) => { e.preventDefault(); saveBasic() }} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Prénom" value={basicForm.firstName} onChange={(e) => setBasicForm((f) => ({ ...f, firstName: e.target.value }))} required />
                <Input label="Nom" value={basicForm.lastName} onChange={(e) => setBasicForm((f) => ({ ...f, lastName: e.target.value }))} required />
              </div>
              <Input label="Adresse e-mail" type="email" value={basicForm.email} onChange={(e) => setBasicForm((f) => ({ ...f, email: e.target.value }))} required />
              <Input label="Téléphone" type="tel" value={basicForm.phone} placeholder="+33 6 00 00 00 00" onChange={(e) => setBasicForm((f) => ({ ...f, phone: e.target.value }))} />
              <Input label="Localisation" value={basicForm.location} placeholder="Paris, France" onChange={(e) => setBasicForm((f) => ({ ...f, location: e.target.value }))} />
              <div className="flex gap-2">
                <Button type="submit" size="sm"><Check className="h-3.5 w-3.5 mr-1.5" />Enregistrer</Button>
                <Button type="button" variant="ghost" size="sm" onClick={() => setEditingBasic(false)}><X className="h-3.5 w-3.5 mr-1.5" />Annuler</Button>
              </div>
            </form>
          ) : (
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoField icon={User}   label="Prénom"      value={user?.firstName} />
              <InfoField icon={User}   label="Nom"         value={user?.lastName} />
              <InfoField icon={Mail}   label="E-mail"      value={user?.email} />
              <InfoField icon={Phone}  label="Téléphone"   value={profile.phone}   empty="Non renseigné" />
              <InfoField icon={MapPin} label="Localisation" value={profile.location} empty="Non renseignée" />
              <InfoField icon={Shield} label="Rôle"        value={user?.role === 'admin' ? 'Administrateur' : 'Utilisateur'} />
            </dl>
          )}
        </CardContent>
      </Card>

      {/* CV */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Curriculum Vitae</CardTitle>
          <CardDescription>Ajoutez votre CV au format PDF pour faciliter vos candidatures.</CardDescription>
        </CardHeader>
        <CardContent>
          <CvUpload />
        </CardContent>
      </Card>

      {/* Professional info */}
      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div>
            <CardTitle className="text-base">Informations professionnelles</CardTitle>
            <CardDescription>Votre profil pour les recruteurs et les recommandations IA.</CardDescription>
          </div>
          {!editingPro && (
            <Button variant="outline" size="sm" onClick={() => {
              setProForm({ title: profile.title, bio: profile.bio, linkedin: profile.linkedin, portfolio: profile.portfolio })
              setEditingPro(true)
            }}>
              <Pencil className="h-3.5 w-3.5 mr-1.5" /> Modifier
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {editingPro ? (
            <form onSubmit={(e) => { e.preventDefault(); savePro() }} className="space-y-4">
              <Input label="Titre / Poste actuel" value={proForm.title} placeholder="Ex : Développeur Frontend React" onChange={(e) => setProForm((f) => ({ ...f, title: e.target.value }))} />
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-text-primary">Bio <span className="text-text-disabled font-normal">(optionnel)</span></label>
                <textarea
                  value={proForm.bio}
                  onChange={(e) => setProForm((f) => ({ ...f, bio: e.target.value }))}
                  placeholder="Présentez-vous en quelques lignes..."
                  rows={3}
                  className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text-primary placeholder:text-text-disabled focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                />
              </div>
              <Input label="LinkedIn" value={proForm.linkedin} placeholder="https://linkedin.com/in/votre-profil" onChange={(e) => setProForm((f) => ({ ...f, linkedin: e.target.value }))} />
              <Input label="Portfolio / GitHub" value={proForm.portfolio} placeholder="https://github.com/votre-profil" onChange={(e) => setProForm((f) => ({ ...f, portfolio: e.target.value }))} />
              <div className="flex gap-2">
                <Button type="submit" size="sm"><Check className="h-3.5 w-3.5 mr-1.5" />Enregistrer</Button>
                <Button type="button" variant="ghost" size="sm" onClick={() => setEditingPro(false)}><X className="h-3.5 w-3.5 mr-1.5" />Annuler</Button>
              </div>
            </form>
          ) : (
            <dl className="space-y-4">
              <InfoField icon={Briefcase} label="Titre / Poste"  value={profile.title}    empty="Non renseigné" />
              <div>
                <dt className="flex items-center gap-2 text-xs text-text-disabled mb-1">
                  <User className="h-3.5 w-3.5" /> Bio
                </dt>
                <dd className={cn('text-sm', profile.bio ? 'text-text-primary' : 'text-text-disabled italic')}>
                  {profile.bio || 'Non renseignée'}
                </dd>
              </div>
              <InfoField icon={Link2}    label="LinkedIn"       value={profile.linkedin}  empty="Non renseigné" href />
              <InfoField icon={Link2}    label="Portfolio"      value={profile.portfolio} empty="Non renseigné" href />
            </dl>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// ─── Saved Jobs Tab ──────────────────────────────────────────────────────────

function SavedJobsTab() {
  const { jobs, toggleSaved } = useSavedJobsStore()
  const saved = jobs.filter((j) => j.isFavorite)

  if (saved.length === 0) {
    return (
      <div className="py-16 text-center">
        <Bookmark className="mx-auto h-12 w-12 text-text-disabled mb-3" />
        <p className="font-medium text-text-primary">Aucune offre sauvegardée</p>
        <p className="text-sm text-text-secondary mt-1">
          Cliquez sur le cœur d&apos;une offre pour la retrouver ici.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-text-secondary">
        {saved.length} offre{saved.length > 1 ? 's' : ''} sauvegardée{saved.length > 1 ? 's' : ''}
      </p>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {saved.map((job) => (
          <JobCard
            key={job.id}
            job={job}
            variant="compact"
            onFavorite={toggleSaved}
          />
        ))}
      </div>
    </div>
  )
}

// ─── Security Tab ─────────────────────────────────────────────────────────────

function SecurityTab() {
  const [form, setForm] = useState({ current: '', next: '', confirm: '' })
  const [show, setShow] = useState({ current: false, next: false, confirm: false })
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (form.next !== form.confirm) { setStatus('error'); return }
    if (form.next.length < 8) { setStatus('error'); return }
    setStatus('success')
    setForm({ current: '', next: '', confirm: '' })
    setTimeout(() => setStatus('idle'), 4000)
  }

  return (
    <div className="space-y-6 max-w-md">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Changer de mot de passe</CardTitle>
          <CardDescription>Utilisez un mot de passe fort d&apos;au moins 8 caractères.</CardDescription>
        </CardHeader>
        <CardContent>
          {status === 'success' && (
            <div className="mb-4 flex items-center gap-2 rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
              <Check className="h-4 w-4 shrink-0" />
              Mot de passe mis à jour avec succès.
            </div>
          )}
          {status === 'error' && (
            <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              Les mots de passe ne correspondent pas ou sont trop courts (min. 8 caractères).
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <PasswordInput
              label="Mot de passe actuel"
              value={form.current}
              show={show.current}
              onToggle={() => setShow((s) => ({ ...s, current: !s.current }))}
              onChange={(v) => setForm((f) => ({ ...f, current: v }))}
              required
            />
            <PasswordInput
              label="Nouveau mot de passe"
              value={form.next}
              show={show.next}
              onToggle={() => setShow((s) => ({ ...s, next: !s.next }))}
              onChange={(v) => setForm((f) => ({ ...f, next: v }))}
              hint="Minimum 8 caractères"
              required
            />
            <PasswordInput
              label="Confirmer le nouveau mot de passe"
              value={form.confirm}
              show={show.confirm}
              onToggle={() => setShow((s) => ({ ...s, confirm: !s.confirm }))}
              onChange={(v) => setForm((f) => ({ ...f, confirm: v }))}
              required
            />
            <Button type="submit" size="sm" className="w-full sm:w-auto">
              <Lock className="h-3.5 w-3.5 mr-1.5" />
              Mettre à jour
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export function ProfileClient() {
  const { user } = useAuth()
  const { profile } = useProfileStore()
  const { jobs } = useSavedJobsStore()
  const unreadNotifs = useNotificationStore((s) => s.unreadCount())

  const saved = jobs.filter((j) => j.isFavorite)
  const initials = user
    ? `${user.firstName[0] ?? ''}${user.lastName[0] ?? ''}`.toUpperCase()
    : '?'

  const memberSince = user?.createdAt
    ? format(new Date(user.createdAt), 'MMMM yyyy', { locale: fr })
    : '—'

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Profile header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {/* Avatar */}
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-600 text-white text-2xl font-bold">
              {initials}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-xl font-bold text-text-primary">
                  {user?.firstName} {user?.lastName}
                </h1>
                <Badge variant={user?.role === 'admin' ? 'accent' : 'secondary'}>
                  {user?.role === 'admin' ? 'Administrateur' : 'Utilisateur'}
                </Badge>
              </div>
              {profile.title && (
                <p className="text-sm font-medium text-text-secondary mb-1">{profile.title}</p>
              )}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-text-disabled">
                {profile.location && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{profile.location}</span>}
                <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />Membre depuis {memberSince}</span>
              </div>
            </div>

            {/* Quick stats */}
            <div className="flex gap-4 sm:gap-6 text-center shrink-0">
              <div>
                <p className="text-lg font-bold text-text-primary">{saved.length}</p>
                <p className="text-xs text-text-disabled">Sauvegardées</p>
              </div>
              <div>
                <p className="text-lg font-bold text-text-primary">{unreadNotifs}</p>
                <p className="text-xs text-text-disabled">Non lues</p>
              </div>
              <div>
                <p className="text-lg font-bold text-text-primary">3</p>
                <p className="text-xs text-text-disabled">Messages</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="profile">
        <TabsList className="w-full sm:w-auto overflow-x-auto">
          <TabsTrigger value="profile" className="gap-2">
            <User className="h-4 w-4" /> Profil
          </TabsTrigger>
          <TabsTrigger value="saved" className="gap-2">
            <Heart className="h-4 w-4" />
            Offres
            {saved.length > 0 && (
              <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-secondary text-[11px] font-bold text-white">
                {saved.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Lock className="h-4 w-4" /> Sécurité
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile"><ProfileTab /></TabsContent>
        <TabsContent value="saved"><SavedJobsTab /></TabsContent>
        <TabsContent value="security"><SecurityTab /></TabsContent>
      </Tabs>
    </div>
  )
}

// ─── Small helpers ────────────────────────────────────────────────────────────

function InfoField({
  icon: Icon, label, value, empty = '—', href = false,
}: {
  icon: React.ElementType
  label: string
  value?: string
  empty?: string
  href?: boolean
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-muted">
        <Icon className="h-3.5 w-3.5 text-text-secondary" aria-hidden="true" />
      </div>
      <div>
        <dt className="text-xs text-text-disabled">{label}</dt>
        {value ? (
          href ? (
            <dd>
              <a href={value} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-primary hover:underline break-all">
                {value}
              </a>
            </dd>
          ) : (
            <dd className="text-sm font-medium text-text-primary">{value}</dd>
          )
        ) : (
          <dd className="text-sm text-text-disabled italic">{empty}</dd>
        )}
      </div>
    </div>
  )
}

function PasswordInput({
  label, value, show, onToggle, onChange, hint, required,
}: {
  label: string
  value: string
  show: boolean
  onToggle: () => void
  onChange: (v: string) => void
  hint?: string
  required?: boolean
}) {
  return (
    <div className="relative">
      <Input
        label={label}
        type={show ? 'text' : 'password'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        hint={hint}
        required={required}
      />
      <button
        type="button"
        onClick={onToggle}
        className="absolute right-3 top-[34px] text-text-disabled hover:text-text-secondary transition-colors"
        aria-label={show ? 'Masquer' : 'Afficher'}
      >
        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  )
}
