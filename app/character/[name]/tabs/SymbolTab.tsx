import Image from "next/image"
import { SymbolItem } from "@/lib/maple"

const ARCANE_SYMBOLS = ["아케인심볼"]
const SACRED_SYMBOLS = ["사크레드심볼"]

function SymbolCard({ symbol }: { symbol: SymbolItem }) {
  const isMaxLevel = symbol.symbol_exp_required === 0
  const pct = isMaxLevel ? 100 : Math.min((symbol.symbol_exp / symbol.symbol_exp_required) * 100, 100)
  const isArcane = ARCANE_SYMBOLS.some(s => symbol.symbol_name.includes(s))
  const color = isArcane ? "#3182F6" : "#A855F7"
  const shortName = symbol.symbol_name.replace("아케인심볼 : ", "").replace("사크레드심볼 : ", "")

  return (
    <div className="rounded-xl p-3 flex items-center gap-3" style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}>
      {symbol.symbol_icon && (
        <Image src={symbol.symbol_icon} alt={shortName} width={40} height={40} unoptimized className="object-contain flex-shrink-0" />
      )}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs font-bold text-white truncate">{shortName}</span>
          <span className="text-xs font-black ml-2 flex-shrink-0" style={{ color }}>
            Lv.{symbol.symbol_level}
          </span>
        </div>
        <div className="flex justify-between text-[10px] mb-1" style={{ color: "var(--text-sub)" }}>
          <span>{Number(symbol.symbol_force ?? 0).toLocaleString()} 포스</span>
          {isMaxLevel ? (
            <span className="text-green-500 font-bold">MAX</span>
          ) : (
            <span>{(symbol.symbol_exp ?? 0).toLocaleString()} / {(symbol.symbol_exp_required ?? 0).toLocaleString()}</span>
          )}
        </div>
        <div className="w-full rounded-full h-1.5" style={{ background: "var(--bg-card)" }}>
          <div className="h-1.5 rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: color }} />
        </div>
      </div>
    </div>
  )
}

export default function SymbolTab({ symbols }: { symbols: SymbolItem[] }) {
  if (!symbols.length) {
    return (
      <div className="text-center py-12" style={{ color: "var(--text-muted)" }}>
        <p className="text-sm">심볼 정보가 없어요</p>
      </div>
    )
  }

  const arcane = symbols.filter(s => s.symbol_name.includes("아케인심볼"))
  const sacred = symbols.filter(s => s.symbol_name.includes("사크레드심볼"))

  return (
    <div className="space-y-4">
      {arcane.length > 0 && (
        <section>
          <h3 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-2">아케인 심볼</h3>
          <div className="space-y-2">
            {arcane.map(s => <SymbolCard key={s.symbol_name} symbol={s} />)}
          </div>
        </section>
      )}
      {sacred.length > 0 && (
        <section>
          <h3 className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-2">사크레드 심볼</h3>
          <div className="space-y-2">
            {sacred.map(s => <SymbolCard key={s.symbol_name} symbol={s} />)}
          </div>
        </section>
      )}
    </div>
  )
}
