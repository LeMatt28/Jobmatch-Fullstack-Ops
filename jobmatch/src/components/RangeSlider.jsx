import { useRef, useCallback } from 'react'

export function RangeSlider({ min = 18000, max = 150000, step = 1000, value = [35000, 60000], onChange, formatLabel }) {
  const [minVal, maxVal] = value
  const rangeRef = useRef(null)

  const fmt = formatLabel || ((v) => `${(v / 1000).toFixed(0)} 000 €`)

  const getPercent = useCallback((v) => Math.round(((v - min) / (max - min)) * 100), [min, max])

  const handleMin = (e) => {
    const val = Math.min(Number(e.target.value), maxVal - step)
    onChange([val, maxVal])
  }

  const handleMax = (e) => {
    const val = Math.max(Number(e.target.value), minVal + step)
    onChange([minVal, val])
  }

  const minPercent = getPercent(minVal)
  const maxPercent = getPercent(maxVal)

  return (
    <div className="space-y-3">
      <p className="text-sm text-center text-brand-900 font-semibold">
        Entre {fmt(minVal)} et {fmt(maxVal)} / an
      </p>
      <div className="relative h-6 flex items-center" ref={rangeRef}>
        {/* Track */}
        <div className="absolute w-full h-1.5 rounded-full bg-gray-200" />
        {/* Active range */}
        <div
          className="absolute h-1.5 rounded-full bg-brand-600"
          style={{ left: `${minPercent}%`, width: `${maxPercent - minPercent}%` }}
        />
        {/* Min thumb */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={minVal}
          onChange={handleMin}
          className="range-thumb absolute w-full appearance-none bg-transparent pointer-events-none"
          style={{ zIndex: minVal > max - 100 ? 5 : 3 }}
        />
        {/* Max thumb */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={maxVal}
          onChange={handleMax}
          className="range-thumb absolute w-full appearance-none bg-transparent pointer-events-none"
          style={{ zIndex: 4 }}
        />
      </div>
      <div className="flex justify-between text-xs text-gray-400">
        <span>{fmt(min)}</span>
        <span>{fmt(max)}</span>
      </div>
      <style>{`
        .range-thumb::-webkit-slider-thumb {
          appearance: none;
          pointer-events: all;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #534AB7;
          cursor: grab;
          border: 2px solid white;
          box-shadow: 0 1px 4px rgba(0,0,0,0.2);
        }
        .range-thumb::-webkit-slider-thumb:active { cursor: grabbing; }
        .range-thumb::-moz-range-thumb {
          pointer-events: all;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #534AB7;
          cursor: grab;
          border: 2px solid white;
          box-shadow: 0 1px 4px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  )
}
