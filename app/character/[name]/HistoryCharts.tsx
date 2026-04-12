"use client"
import { useEffect, useState } from "react"

interface HistoryPoint { date: string; value: number }
interface CharacterHistory { expHistory: HistoryPoint[]; levelHistory: HistoryPoint[] }

function BarChart({ data }: { data: HistoryPoint[] }) {
  if (!data.length) return <p className="text-xs text-center py-8" style={{ color: "var(--text-muted)" }}>데이터 없음</p>
  const max = Math.max(...data.map(d => d.value))
  const min = Math.min(...data.map(d => d.value))

  return (
    <div className="flex items-end gap-1.5 h-32 pt-5">
      {data.map((point, i) => {
        const pct = max === min ? 60 : ((point.value - min) / (max - min)) * 70 + 20
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <span className="text-[9px] leading-none" style={{ color: "var(--text-muted)" }}>{point.value.toFixed(2)}%</span>
            <div className="w-full rounded-t-sm" style={{ height: `${pct}px`, background: "linear-gradient(to top, #1d4ed8, #60a5fa)" }} />
            <span className="text-[8px] whitespace-nowrap" style={{ color: "var(--text-muted)" }}>{point.date}</span>
          </div>
        )
      })}
    </div>
  )
}

function LineChart({ data }: { data: HistoryPoint[] }) {
  if (data.length < 2) return <p className="text-xs text-center py-8" style={{ color: "var(--text-muted)" }}>데이터 없음</p>

  const W = 400; const H = 100; const pX = 24; const pY = 18
  const iW = W - pX * 2; const iH = H - pY * 2
  const levels = data.map(d => d.value)
  const minL = Math.min(...levels); const maxL = Math.max(...levels)
  const range = Math.max(maxL - minL, 1)

  const pts = data.map((d, i) => ({
    x: pX + (i / (data.length - 1)) * iW,
    y: pY + iH - ((d.value - minL) / range) * iH,
    ...d,
  }))

  const line = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ")
  const fill = `${line} L ${pts[pts.length - 1].x} ${H} L ${pts[0].x} ${H} Z`

  return (
    <svg viewBox={`0 0 ${W} ${H + 28}`} className="w-full mt-1">
      <path d={fill} fill="#3b82f6" fillOpacity="0.15" />
      <path d={line} fill="none" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {pts.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="3.5" fill="#0d1117" stroke="#60a5fa" strokeWidth="1.5" />
          <text x={p.x} y={p.y - 7} textAnchor="middle" fontSize="9" fill="rgba(230,237,243,0.55)" fontWeight="600">{p.value}</text>
          <text x={p.x} y={H + 24} textAnchor="middle" fontSize="8" fill="rgba(230,237,243,0.3)">{p.date}</text>
        </g>
      ))}
    </svg>
  )
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="glass rounded-2xl px-5 py-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-bold text-white">{title}</h3>
        <span className="text-[10px] font-medium" style={{ color: "var(--text-muted)" }}>maplebot.co.kr</span>
      </div>
      {children}
    </div>
  )
}

export default function HistoryCharts({ name }: { name: string }) {
  const [data, setData] = useState<CharacterHistory | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    fetch(`/api/history/${encodeURIComponent(name)}`, { signal: controller.signal })
      .then(r => r.ok ? r.json() : null)
      .then(d => setData(d))
      .catch(e => { if ((e as Error).name !== "AbortError") console.error(e) })
      .finally(() => setLoading(false))
    return () => controller.abort()
  }, [name])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2].map(i => (
          <div key={i} className="glass rounded-2xl p-5 h-44 animate-pulse" />
        ))}
      </div>
    )
  }

  if (!data) return null

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <ChartCard title="경험치 히스토리">
        <BarChart data={data.expHistory} />
      </ChartCard>
      <ChartCard title="레벨 히스토리">
        <LineChart data={data.levelHistory} />
      </ChartCard>
    </div>
  )
}
