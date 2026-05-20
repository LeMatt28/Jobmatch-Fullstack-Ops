export function AdminBarChart({ title, data, color = 'bg-brand-600', secondaryData, secondaryColor = 'bg-amber-400', legend }) {
  const maxVal = Math.max(...data.map((d) => d.value), ...(secondaryData ? secondaryData.map((d) => d.value) : []))

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
      <p className="text-sm font-semibold text-gray-700 mb-4">{title}</p>
      <div className="flex items-end gap-2 h-32">
        {data.map((item, i) => (
          <div key={item.label} className="flex-1 flex flex-col items-center gap-1">
            <div className="w-full flex items-end gap-0.5" style={{ height: '96px' }}>
              <div
                className={`flex-1 rounded-t-md ${color} transition-all`}
                style={{ height: maxVal > 0 ? `${(item.value / maxVal) * 96}px` : '2px' }}
              />
              {secondaryData && (
                <div
                  className={`flex-1 rounded-t-md ${secondaryColor} transition-all`}
                  style={{ height: maxVal > 0 ? `${(secondaryData[i].value / maxVal) * 96}px` : '2px' }}
                />
              )}
            </div>
            <span className="text-xs text-gray-400">{item.label}</span>
            <span className="text-xs font-medium text-gray-600">{item.value}</span>
          </div>
        ))}
      </div>
      {legend && (
        <div className="flex gap-4 mt-3">
          {legend.map((l) => (
            <div key={l.label} className="flex items-center gap-1.5">
              <div className={`w-3 h-3 rounded-sm ${l.color}`} />
              <span className="text-xs text-gray-500">{l.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
