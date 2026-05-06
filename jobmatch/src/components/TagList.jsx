const colorMap = {
  brand: 'bg-brand-50 text-brand-800',
  teal: 'bg-teal-50 text-teal-800',
  green: 'bg-green-50 text-green-800',
}

export function TagList({ tags = [], color = 'brand' }) {
  return (
    <ul role="list" className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <li key={tag} role="listitem">
          <span className={`inline-flex items-center rounded-full text-xs px-3 py-1 font-medium ${colorMap[color] || colorMap.brand}`}>
            {tag}
          </span>
        </li>
      ))}
    </ul>
  )
}
