'use client'

import React, { useState } from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
  BarChart, Bar, Cell,
} from 'recharts'
import { TrendingUp, BarChart2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { useTrendsAnalytics } from '@/features/data-feature/hooks/useJobAnalytics'

const SKILL_COLORS = ['#6B9AE8', '#E8A1C8', '#B8A4E8', '#A8E6CF', '#FFD4A3', '#90B7F0']

export function JobTrends() {
  const { data, isLoading } = useTrendsAnalytics()

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary-100">
            <TrendingUp className="h-4 w-4 text-secondary-500" aria-hidden="true" />
          </div>
          <div>
            <CardTitle className="text-base">Tendances du marché</CardTitle>
            <CardDescription>Évolution mensuelle et compétences en demande</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="flex h-48 items-center justify-center">
            <LoadingSpinner />
          </div>
        ) : (
          <Tabs defaultValue="monthly">
            <TabsList className="mb-4">
              <TabsTrigger value="monthly">Évolution</TabsTrigger>
              <TabsTrigger value="skills">Compétences</TabsTrigger>
            </TabsList>

            <TabsContent value="monthly">
              <div role="img" aria-label="Graphique d'évolution mensuelle des offres et candidatures">
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={data.monthly} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#718096' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#718096' }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: 12 }}
                      formatter={(value: number, name: string) => [
                        value.toLocaleString('fr-FR'),
                        name === 'jobs' ? 'Offres' : 'Candidatures',
                      ]}
                    />
                    <Legend formatter={(v) => v === 'jobs' ? 'Offres' : 'Candidatures'} iconType="circle" iconSize={8} />
                    <Line type="monotone" dataKey="jobs" stroke="#6B9AE8" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="applications" stroke="#E8A1C8" strokeWidth={2} dot={false} strokeDasharray="4 2" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>

            <TabsContent value="skills">
              <div role="img" aria-label="Top compétences recherchées sur le marché">
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={data.topSkills} layout="vertical" margin={{ top: 0, right: 40, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 11, fill: '#718096' }} axisLine={false} tickLine={false} />
                    <YAxis dataKey="skill" type="category" tick={{ fontSize: 11, fill: '#718096' }} axisLine={false} tickLine={false} width={72} />
                    <Tooltip
                      contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: 12 }}
                      formatter={(value: number) => [value.toLocaleString('fr-FR'), 'Offres']}
                    />
                    <Bar dataKey="count" radius={[0, 4, 4, 0]} maxBarSize={24}>
                      {data.topSkills.map((_, i) => (
                        <Cell key={i} fill={SKILL_COLORS[i % SKILL_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Growth badges */}
              <div className="mt-4 flex flex-wrap gap-2 border-t border-border pt-4">
                {data.topSkills.map((s) => (
                  <div key={s.skill} className="flex items-center gap-1.5">
                    <span className="text-xs text-text-secondary">{s.skill}</span>
                    <Badge variant={s.growth >= 25 ? 'success' : 'default'} className="text-xs">
                      +{s.growth}%
                    </Badge>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  )
}
