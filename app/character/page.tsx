"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"

const QUICK = ["아크메이지", "팔라딘", "나이트로드", "바이퍼", "윈드브레이커", "메르세데스"]

export default function CharacterSearchPage() {
  const [query, setQuery] = useState("")
  const router = useRouter()

  const go = (v?: string) => {
    const t = (v ?? query).trim()
    if (!t) return
    router.push(`/character/${encodeURIComponent(t)}`)
  }

  return (
    <div className="max-w-2xl mx-auto px-4" style={{ paddingTop: "100px", paddingBottom: "60px" }}>

      <div className="text-center mb-10">
        <h1 className="text-3xl font-black text-white mb-2">캐릭터 조회</h1>
        <p className="text-sm" style={{ color: "var(--text-sub)" }}>
          캐릭터 닉네임으로 넥슨 API 정보를 전체 조회합니다
        </p>
      </div>

      {/* 검색창 */}
      <div className="glass flex items-center rounded-2xl overflow-hidden mb-4 shadow-xl"
        style={{ boxShadow: "0 0 40px rgba(59,130,246,0.1)" }}>
        <Search size={17} className="ml-4 shrink-0" style={{ color: "var(--text-muted)" }} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && go()}
          placeholder="캐릭터 닉네임을 입력하세요"
          autoFocus
          className="flex-1 px-3 py-4 bg-transparent focus:outline-none text-[15px] text-white placeholder:text-[rgba(255,255,255,0.25)]"
        />
        <button onClick={() => go()} className="btn-primary m-2 px-6 py-2.5 text-sm">
          조회하기
        </button>
      </div>

      {/* 빠른 검색 */}
      <div className="flex flex-wrap gap-2 mb-10">
        {QUICK.map(name => (
          <button key={name} onClick={() => go(name)}
            className="text-xs px-3 py-1.5 rounded-full transition-all hover:border-blue-400/50"
            style={{ background: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--text-muted)" }}>
            {name}
          </button>
        ))}
      </div>

      {/* 제공 정보 안내 */}
      <div className="glass rounded-2xl p-5">
        <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "var(--text-muted)" }}>
          조회 가능한 정보
        </p>
        <div className="grid grid-cols-2 gap-2">
          {["기본 정보 (레벨, 직업, 서버, 길드)", "스탯 (전투력, 능력치 전체)", "장비 (잠재능력, 스타포스)", "어빌리티", "유니온 (등급, 레벨, 아티팩트)", "심볼 (아케인 / 사크레드)", "헥사 (코어, 스탯)", "코디 (헤어, 성형, 캐시 장비)"].map(item => (
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
