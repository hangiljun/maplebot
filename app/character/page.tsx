"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, AlertCircle, Info } from "lucide-react"

export default function CharacterSearchPage() {
  const [query, setQuery] = useState("")
  const [warn, setWarn] = useState(false)
  const [composing, setComposing] = useState(false)
  const router = useRouter()

  const applyFilter = (v: string) => {
    const filtered = v.replace(/[^a-zA-Z0-9가-힣]/g, "").slice(0, 12)
    setWarn(v.length > 0 && filtered !== v)
    setQuery(filtered)
  }

  const handleChange = (v: string) => {
    if (composing) {
      setQuery(v.slice(0, 12))
    } else {
      applyFilter(v)
    }
  }

  const go = (v?: string) => {
    const t = (v ?? query).trim()
    if (!t) return
    router.push(`/character/${encodeURIComponent(t)}`)
  }

  return (
    <div style={{ paddingTop: "96px", paddingBottom: "80px" }}>
      <div className="max-w-xl mx-auto px-5">

        <div className="text-center mb-10">
          <h1 className="text-3xl font-black mb-2" style={{ color: "var(--text)" }}>캐릭터 조회</h1>
          <p className="text-sm" style={{ color: "var(--text-sub)" }}>
            캐릭터 닉네임으로 Nexon OpenAPI 정보를 전체 조회합니다
          </p>
        </div>

        {/* 검색창 */}
        <div className="glass flex items-center rounded-2xl overflow-hidden mb-3"
          style={{ border: warn ? "1px solid rgba(239,68,68,0.5)" : "1px solid rgba(59,130,246,0.2)" }}>
          <Search size={17} className="ml-4 shrink-0" style={{ color: "var(--text-muted)" }} />
          <input
            type="text"
            value={query}
            onChange={(e) => handleChange(e.target.value)}
            onCompositionStart={() => setComposing(true)}
            onCompositionEnd={(e) => { setComposing(false); applyFilter(e.currentTarget.value) }}
            onKeyDown={(e) => e.key === "Enter" && !composing && go()}
            placeholder="닉네임 입력 후 Enter 또는 조회하기"
            autoFocus
            className="flex-1 px-3 py-4 bg-transparent focus:outline-none text-[15px] placeholder:text-white/20"
            style={{ color: "var(--text)" }}
          />
          {query && (
            <span className="text-xs mr-2 tabular-nums" style={{ color: "var(--text-muted)" }}>
              {query.length}/12
            </span>
          )}
          <button
            onClick={() => go()}
            className="btn-primary m-2 px-6 py-2.5 text-sm shrink-0"
          >
            조회하기
          </button>
        </div>

        {/* 경고 */}
        {warn && (
          <div className="flex items-center gap-1.5 mb-3 px-1">
            <AlertCircle size={13} style={{ color: "#f87171" }} />
            <p className="text-xs" style={{ color: "#f87171" }}>
              한글, 영문, 숫자만 입력할 수 있습니다.
            </p>
          </div>
        )}

        {/* 안내 */}
        <div className="flex items-start gap-2 mb-8 px-1">
          <Info size={13} className="mt-0.5 shrink-0" style={{ color: "var(--text-muted)" }} />
          <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
            본 정보는 <strong style={{ color: "var(--text-sub)" }}>Nexon OpenAPI</strong>를 통해 실시간으로 호출됩니다.
            서버 부하 방지를 위해 최대 <strong style={{ color: "var(--text-sub)" }}>1시간</strong> 캐싱됩니다.
          </p>
        </div>

        {/* 조회 가능 정보 */}
        <div className="glass rounded-2xl p-5">
          <p className="text-[11px] font-semibold uppercase tracking-widest mb-4"
            style={{ color: "var(--text-muted)" }}>
            조회 가능한 정보
          </p>
          <div className="grid grid-cols-2 gap-y-2 gap-x-4">
            {[
              "기본 정보 (레벨, 직업, 서버, 길드)",
              "스탯 (전투력, 능력치 전체)",
              "장비 (잠재능력, 스타포스)",
              "어빌리티",
              "유니온 (등급, 레벨, 아티팩트)",
              "심볼 (아케인 / 사크레드)",
              "헥사 (코어, 스탯)",
              "코디 (헤어, 성형, 캐시 장비)",
            ].map(item => (
              <div key={item} className="flex items-center gap-2 text-xs"
                style={{ color: "var(--text-sub)" }}>
                <div className="w-1 h-1 rounded-full shrink-0"
                  style={{ background: "var(--blue-light)" }} />
                {item}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
