"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, AlertCircle, Info } from "lucide-react"

const QUICK = ["아크메이지", "팔라딘", "나이트로드", "바이퍼", "윈드브레이커", "메르세데스"]

export default function CharacterSearchPage() {
  const [query, setQuery] = useState("")
  const [warn, setWarn] = useState(false)
  const router = useRouter()

  const handleInput = (v: string) => {
    // 넥슨 닉네임: 한글·영문·숫자만, 최대 12자
    const filtered = v.replace(/[^a-zA-Z0-9가-힣]/g, "").slice(0, 12)
    setWarn(filtered !== v.slice(0, 12))
    setQuery(filtered)
  }

  const go = (v?: string) => {
    const t = (v ?? query).trim()
    if (!t) return
    router.push(`/character/${encodeURIComponent(t)}`)
  }

  return (
    <div className="max-w-2xl mx-auto px-4" style={{ paddingTop: "100px", paddingBottom: "60px" }}>

      <div className="text-center mb-10">
        <h1 className="text-3xl font-black mb-2" style={{ color: "var(--text)" }}>캐릭터 조회</h1>
        <p className="text-sm" style={{ color: "var(--text-sub)" }}>
          캐릭터 닉네임으로 Nexon OpenAPI 정보를 전체 조회합니다
        </p>
      </div>

      {/* 검색창 */}
      <div className="glass flex items-center rounded-2xl overflow-hidden mb-2 shadow-sm"
        style={{ border: warn ? "1px solid rgba(239,68,68,0.4)" : "1px solid var(--border)" }}>
        <Search size={17} className="ml-4 shrink-0" style={{ color: "var(--text-muted)" }} />
        <input
          type="text"
          value={query}
          onChange={(e) => handleInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && go()}
          placeholder="캐릭터 닉네임을 입력하세요 (최대 12자)"
          autoFocus
          maxLength={12}
          className="flex-1 px-3 py-4 bg-transparent focus:outline-none text-[15px] placeholder:text-[rgba(15,23,42,0.25)]"
          style={{ color: "var(--text)" }}
        />
        {query && (
          <span className="text-xs mr-2 tabular-nums" style={{ color: "var(--text-muted)" }}>
            {query.length}/12
          </span>
        )}
        <button onClick={() => go()} className="btn-primary m-2 px-6 py-2.5 text-sm">
          조회하기
        </button>
      </div>

      {/* 입력 경고 */}
      {warn && (
        <div className="flex items-center gap-1.5 mb-3 px-1">
          <AlertCircle size={13} style={{ color: "#ef4444" }} />
          <p className="text-xs" style={{ color: "#ef4444" }}>
            닉네임에는 한글, 영문, 숫자만 사용할 수 있습니다. 특수문자는 자동으로 제거됩니다.
          </p>
        </div>
      )}

      {/* 데이터 출처 안내 */}
      <div className="flex items-start gap-2 mb-6 px-1">
        <Info size={13} className="mt-0.5 shrink-0" style={{ color: "var(--text-muted)" }} />
        <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
          본 정보는 <strong>Nexon OpenAPI</strong>를 통해 실시간으로 호출됩니다.
          서버 부하 방지를 위해 조회 결과는 최대 <strong>1시간</strong> 캐싱됩니다.
          조회되는 캐릭터 정보는 메이플스토리 내 공개 정보에 한합니다.
        </p>
      </div>

      {/* 빠른 검색 */}
      <div className="flex flex-wrap gap-2 mb-10">
        {QUICK.map(name => (
          <button key={name} onClick={() => go(name)}
            className="text-xs px-3 py-1.5 rounded-full transition-all hover:border-blue-400"
            style={{ background: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--text-muted)" }}>
            {name}
          </button>
        ))}
      </div>

      {/* 조회 가능 정보 */}
      <div className="glass rounded-2xl p-5">
        <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "var(--text-muted)" }}>
          조회 가능한 정보
        </p>
        <div className="grid grid-cols-2 gap-2">
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
            <div key={item} className="flex items-center gap-2 text-xs" style={{ color: "var(--text-sub)" }}>
              <div className="w-1 h-1 rounded-full shrink-0" style={{ background: "var(--blue)" }} />
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
