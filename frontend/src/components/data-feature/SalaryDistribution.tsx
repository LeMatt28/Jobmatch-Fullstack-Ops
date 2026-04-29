'use client'

import React from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from 'recharts'
import { Banknote, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { useSalaryAnalytics } from '@/features/data-feature/hooks/useJobAnalytics'

const BAR_COLORS = [
  '#DAE7FA', '#B5CFF5', '#90B7F0', '#6B9AE8',
  '#4A7FDC', '#3366C5', '#254FA0',
]

function formatK(value: number): string {
  return value >= 1000 ? `${Math.round(value / 1000)}k` : String(value)
}

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{ payload: { range: string; count: number; avgSalary: number } }>
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div className="rounded-lg border border-border bg-surface p-3 shadow-modal text-xs">
      <p className="font-semibold text-text-primary mb-1">{d.range}</p>
      <p className="text-text-secondary">{d.count} offres</p>
      <p className="text-primary font-medium">
        Moy. {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(d.avgSalary)}
      </p>
    </div>
  )
}

export function SalaryDistribution() {
  const { data, isLoading } = useSalaryAnalytics()

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-100">
              <Banknote className="h-4 w-4 text-primary" aria-hidden="true" />
            </div>
            <div>
              <CardTitle className="text-base">Distribution des salaires</CardTitle>
              <CardDescription>Répartition par tranche annuelle brute</CardDescription>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-text-disabled">Médiane</p>
            <p className="text-sm font-bold text-primary">
              {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(data.median)}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="flex h-48 items-center justify-center">
            <LoadingSpinner />
          </div>
        ) : (
          <>
            <div
              role="img"
              aria-label={`Histogramme des salaires : médiane ${data.median.toLocaleString('fr-FR')} €, moyenne ${data.average.toLocaleString('fr-FR')} €`}
            >
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={data.buckets} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                  <XAxis
                    dataKey="range"
                    tick={{ fontSize: 11, fill: '#718096' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tickFormatter={formatK}
                    tick={{ fontSize: 11, fill: '#718096' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F0F5FD' }} />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={48}>
                    {data.buckets.map((_, i) => (
                      <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Summary stats */}
            <div className="mt-4 grid grid-cols-3 gap-3 border-t border-border pt-4">
              {[
                { label: 'Minimum', value: data.min, icon: '↓' },
                { label: 'Moyenne', value: data.average, icon: <TrendingUp className="h-3 w-3" /> },
                { label: 'Maximum', value: data.max, icon: '↑' },
              ].map(({ label, value, icon }) => (
                <div key={label} className="text-center">
                  <p className="text-xs text-text-disabled">{label}</p>
                  <p className="text-sm font-semibold text-text-primary">
                    {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value)}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
