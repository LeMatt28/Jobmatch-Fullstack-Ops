export function AdminStatCard({ value, label, delta }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
      <p className="text-3xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-500 mt-1">{label}</p>
      {delta && <p className="text-xs text-emerald-600 mt-2">↑ {delta}</p>}
    </div>
  )
}
