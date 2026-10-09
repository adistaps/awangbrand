'use client'

export function SubmissionsChart({
  labels,
  quotes,
  contacts,
}: {
  labels: string[]
  quotes: number[]
  contacts: number[]
}) {
  const max = Math.max(1, ...quotes, ...contacts)
  const height = 180
  const barWidth = 22
  const gap = 14
  const groupWidth = barWidth * 2 + 6

  return (
    <div>
      <div className="flex items-center gap-4 mb-4 text-xs font-semibold">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-[#F5A200] inline-block" /> Quote
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-[#0A1628] inline-block" /> Kontak
        </span>
      </div>
      <svg width="100%" height={height + 30} viewBox={`0 0 ${labels.length * (groupWidth + gap)} ${height + 30}`} className="overflow-visible">
        {labels.map((label, i) => {
          const qHeight = (quotes[i] / max) * height
          const cHeight = (contacts[i] / max) * height
          const x = i * (groupWidth + gap)
          return (
            <g key={label}>
              <rect x={x} y={height - qHeight} width={barWidth} height={qHeight} rx={3} fill="#F5A200" />
              <rect x={x + barWidth + 6} y={height - cHeight} width={barWidth} height={cHeight} rx={3} fill="#0A1628" />
              <text x={x + groupWidth / 2 - 3} y={height + 20} textAnchor="middle" fontSize="11" fill="#6B7280">
                {label}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}
