"use client"
import { useEffect, useState } from "react"

interface HistoryPoint { date: string; value: number }
interface CharacterHistory { expHistory: HistoryPoint[]; levelHistory: HistoryPoint[] }

function BarChart({ data }: { data: HistoryPoint[] }) {
  if (!data.length) return <p className="text-xs text-gray-400 text-center py-8">데이터 없음</p>
  const max = Math.max(...data.map(d => d.value))
  const min = Math.min(...data.map(d => d.value))

  return (
    <div className="flex items-end gap-1.5 h-32 pt-5">
      {data.map((point, i) => {
        const pct = max === min ? 60 : ((point.value - min) / (max - min)) * 70 + 20
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <span className="text-[9px] text-gray-500 leading-none">{point.value.toFixed(3)}%</span>
            <div className="w-full rounded-t-sm bg-green-300" style={{ height: `${pct}px` }} />
            <span className="text-[8px] text-gray-400 whitespace-nowrap">{point.date}</span>
          </div>
        )
      })}
    </div>
  )
}

function LineChart({ data }: { data: HistoryPoint[] }) {
  if (data.length < 2) return <p className="text-xs text-gray-400 text-center py-8">데이터 없음</p>

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
      <path d={fill} fill="#86efac" fillOpacity="0.25" />
      <path d={line} fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {pts.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="3.5" fill="white" stroke="#22c55e" strokeWidth="1.5" />
          <text x={p.x} y={p.y - 7} textAnchor="middle" fontSize="9" fill="#374151" fontWeight="600">{p.value}</text>
          <text x={p.x} y={H + 24} textAnchor="middle" fontSize="8" fill="#9ca3af">{p.date}</text>
        </g>
      ))}
    </svg>
  )
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-[#E5E8EB] px-5 py-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-bold text-[#191F28]">{title}</h3>
        <span className="text-[10px] text-gray-300 font-medium">maplebot.co.kr</span>
      </div>
      {children}
    </div>
  )
}

export default function HistoryCharts({ name }: { name: string }) {
  const [data, setData] = useState<CharacterHistory | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/history/${encodeURIComponent(name)}`)
      .then(r => r.ok ? r.json() : null)
      .then(d => setData(d))
      .finally(() => setLoading(false))
  }, [name])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2].map(i => (
          <div key={i} className="bg-white rounded-2xl border border-[#E5E8EB] p-5 h-44 animate-pulse" />
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
