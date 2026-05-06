export function Button({ children, variant = 'primary', className = '', disabled, ...props }) {
  const base = 'inline-flex items-center justify-center font-medium rounded-xl px-5 py-2.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none'
  const variants = {
    primary: 'bg-brand-600 hover:bg-brand-800 text-white',
    secondary: 'border border-brand-600 text-brand-600 hover:bg-brand-50',
    ghost: 'text-gray-600 hover:bg-gray-100',
    danger: 'bg-red-500 hover:bg-red-600 text-white',
  }
  return (
    <button className={`${base} ${variants[variant]} ${className}`} disabled={disabled} {...props}>
      {children}
    </button>
  )
}
