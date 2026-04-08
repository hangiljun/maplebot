import { SymbolItem } from "@/lib/maple"

function SymbolCard({ symbol }: { symbol: SymbolItem }) {
  const progress = symbol.symbol_require_growth_count > 0
    ? Math.round((symbol.symbol_growth_count / symbol.symbol_require_growth_count) * 100)
    : 100

  const isArcane    = symbol.symbol_name.includes("아케인")
  const accentColor = isArcane ? "#3B82F6" : "#A855F7"

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-4">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0"
          style={{ backgroundColor: accentColor + "18" }}>
          {symbol.symbol_icon
            ? <img src={symbol.symbol_icon} alt={symbol.symbol_name} className="w-10 h-10 object-contain" />
            : <span className="text-xl">{isArcane ? "🔷" : "🟣"}</span>
          }
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[12px] font-bold text-[#191F28] truncate leading-tight">
            {symbol.symbol_name.replace("심볼 : ", " ")}
          </p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[11px] font-bold" style={{ color: accentColor }}>
              Lv.{symbol.symbol_level}
            </span>
            <span className="text-[11px] text-gray-400 font-semibold">
              포스 {symbol.symbol_force}
            </span>
          </div>
        </div>
      </div>

      {/* 성장 진행바 */}
      {symbol.symbol_require_growth_count > 0 && (
        <div>
          <div className="flex justify-between text-[10px] text-gray-400 mb-1">
            <span>{symbol.symbol_growth_count.toLocaleString()} / {symbol.symbol_require_growth_count.toLocaleString()}</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1.5">
            <div className="h-1.5 rounded-full transition-all"
              style={{ width: `${progress}%`, backgroundColor: accentColor }} />
          </div>
        </div>
      )}
      {symbol.symbol_require_growth_count === 0 && (
        <div className="text-center text-[11px] font-bold" style={{ color: accentColor }}>
          MAX
        </div>
      )}
    </div>
  )
}

export default function SymbolTab({ symbols }: { symbols: SymbolItem[] }) {
  if (!symbols.length) {
    return (
      <div className="text-center py-12 text-gray-400">
        <div className="text-4xl mb-3">🔷</div>
        <p className="text-sm">심볼 정보를 불러올 수 없어요</p>
      </div>
    )
  }

  const arcane    = symbols.filter((s) => s.symbol_name.includes("아케인"))
  const authentic = symbols.filter((s) => s.symbol_name.includes("어센틱"))

  return (
    <div className="space-y-5">
      {arcane.length > 0 && (
        <section>
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">아케인심볼</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {arcane.map((s, i) => <SymbolCard key={i} symbol={s} />)}
          </div>
        </section>
      )}
      {authentic.length > 0 && (
        <section>
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">어센틱심볼</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {authentic.map((s, i) => <SymbolCard key={i} symbol={s} />)}
          </div>
        </section>
      )}
    </div>
  )
}
