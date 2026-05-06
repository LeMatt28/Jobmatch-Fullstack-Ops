export function Input({ label, error, id, className = '', ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`border border-gray-200 focus:border-brand-400 focus:ring-2 focus:ring-brand-100 rounded-xl px-4 py-2.5 text-sm outline-none transition bg-white ${error ? 'border-red-400 focus:border-red-400 focus:ring-red-100' : ''} ${className}`}
        {...props}
      />
      {error && (
        <p role="alert" className="text-xs text-red-500">{error}</p>
      )}
    </div>
  )
}
