"use client"
import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Search, AlertCircle, Info } from "lucide-react"

export default function CharacterSearchPage() {
  const [displayCount, setDisplayCount] = useState(0)
  const [warn, setWarn]                 = useState(false)
  const inputRef                        = useRef<HTMLInputElement>(null)
  const router                          = useRouter()

  // 입력 중 el.value를 절대 수정하지 않음 — 모바일 IME 방해 방지
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value
    setDisplayCount(raw.length)
    setWarn(raw.length > 0 && /[^a-zA-Z0-9가-힣]/.test(raw))
  }

  // 필터링은 submit 시에만
  const go = () => {
    const raw = (inputRef.current?.value ?? "").trim()
    const t   = raw.replace(/[^a-zA-Z0-9가-힣]/g, "").slice(0, 12)
    if (!t) return
    router.push(`/character/${encodeURIComponent(t)}`)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5"
      style={{ paddingTop: "80px", paddingBottom: "80px" }}>

      <div className="w-full max-w-2xl">

        <div className="text-center mb-10">
          <h1 className="text-4xl font-black mb-3" style={{ color: "var(--text)" }}>캐릭터 조회</h1>
          <p className="text-base" style={{ color: "var(--text-sub)" }}>
            캐릭터 닉네임으로 Nexon OpenAPI 정보를 전체 조회합니다
          </p>
        </div>

        {/* 검색창 */}
        <form onSubmit={(e) => { e.preventDefault(); go() }}
          className="glass flex items-center rounded-2xl overflow-hidden mb-3"
          style={{
            border: warn ? "1px solid rgba(239,68,68,0.5)" : "1px solid rgba(59,130,246,0.25)",
            boxShadow: "0 8px 40px rgba(0,0,0,0.3)",
            height: "72px",
          }}>
          <Search size={20} className="ml-6 shrink-0" style={{ color: "var(--text-muted)" }} />
          <input
            ref={inputRef}
            type="text"
            onChange={handleChange}
            placeholder="닉네임 입력 후 Enter 또는 검색"
            className="flex-1 px-4 bg-transparent focus:outline-none placeholder:text-white/20"
            style={{ color: "var(--text)", fontSize: "16px", height: "100%" }}
          />
          {displayCount > 0 && (
            <span className="text-sm mr-4 tabular-nums" style={{ color: "var(--text-muted)" }}>
              {displayCount}/12
            </span>
          )}
          <button type="submit" className="btn-primary shrink-0 font-bold rounded-xl"
            style={{ margin: "10px", padding: "0 28px", height: "52px", fontSize: "15px" }}>
            검색
          </button>
        </form>

        {/* 경고 */}
        {warn && (
          <div className="flex items-center gap-2 mb-3 px-1">
            <AlertCircle size={14} style={{ color: "#f87171" }} />
            <p className="text-sm" style={{ color: "#f87171" }}>
              한글, 영문, 숫자만 입력할 수 있습니다.
            </p>
          </div>
        )}

        {/* 안내 */}
        <div className="flex items-start gap-2 mb-10 px-1">
          <Info size={14} className="mt-0.5 shrink-0" style={{ color: "var(--text-muted)" }} />
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
            본 정보는 <strong style={{ color: "var(--text-sub)" }}>Nexon OpenAPI</strong>를 통해 실시간으로 호출됩니다.
            서버 부하 방지를 위해 최대 <strong style={{ color: "var(--text-sub)" }}>1시간</strong> 캐싱됩니다.
          </p>
        </div>

        {/* 조회 가능 정보 */}
        <div className="glass rounded-2xl p-7">
          <p className="text-xs font-bold uppercase tracking-widest mb-5 text-center"
            style={{ color: "var(--text-muted)" }}>
            조회 가능한 정보
          </p>
          <div className="grid grid-cols-2 gap-y-3 gap-x-6">
            {[
              "기본 정보 (레벨, 직업, 서버, 길드)",
              "스탯 (전투력, 능력치 전체)",
              "어빌리티 (기본 정보 탭 내 표시)",
              "장비 (잠재능력, 스타포스, 아이템 상세)",
              "연무장 (DPS 측정 결과, 스킬 TOP 5)",
              "유니온 (등급, 레벨, 아티팩트)",
              "심볼 (아케인 / 사크레드)",
              "헥사 (코어, 스탯)",
              "코디 (헤어, 성형, 캐시 장비)",
              "캐릭터 역사 (닉네임·길드 변경, 6개월)",
            ].map(item => (
              <div key={item} className="flex items-center gap-2 text-sm"
                style={{ color: "var(--text-sub)" }}>
                <div className="w-1.5 h-1.5 rounded-full shrink-0"
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
