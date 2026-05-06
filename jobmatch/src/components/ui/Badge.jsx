export function Badge({ children, className = '' }) {
  return (
    <span className={`inline-flex items-center bg-brand-50 text-brand-800 rounded-full text-xs px-3 py-1 font-medium ${className}`}>
      {children}
    </span>
  )
}
