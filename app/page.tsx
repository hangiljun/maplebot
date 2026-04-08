"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"

const QUICK_SEARCH = ["아크메이지", "팔라딘", "나이트로드", "바이퍼", "윈드브레이커", "메르세데스"]

export default function HomePage() {
  const [query, setQuery] = useState("")
  const router = useRouter()

  const handleSearch = (value?: string) => {
    const trimmed = (value ?? query).trim()
    if (!trimmed) return
    router.push(`/character/${encodeURIComponent(trimmed)}`)
  }

  return (
    <div className="min-h-[calc(100vh-56px)] flex flex-col">

      {/* 히어로 검색 영역 */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-20">

        {/* 로고 */}
        <div className="flex flex-col items-center mb-10">
          <span className="text-7xl mb-4">🍁</span>
          <h1 className="text-3xl font-extrabold text-[#191F28] tracking-tight">메이플봇</h1>
          <p className="text-gray-400 text-sm mt-2 font-medium">메이플스토리 캐릭터 정보 검색</p>
        </div>

        {/* 검색 바 */}
        <div className="w-full max-w-lg">
          <div className="flex items-center bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow px-4 py-3 gap-3">
            <Search size={18} className="text-gray-400 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="캐릭터 닉네임을 입력하세요"
              className="flex-1 text-[15px] text-[#191F28] placeholder:text-gray-300 bg-transparent focus:outline-none"
              autoFocus
            />
            <button
              onClick={() => handleSearch()}
              className="bg-[#3182F6] hover:bg-[#1C6EE8] text-white text-sm font-semibold px-4 py-1.5 rounded-xl transition-colors shrink-0"
            >
              검색
            </button>
          </div>

          {/* 빠른 검색 */}
          <div className="flex flex-wrap gap-2 mt-4 justify-center">
            {QUICK_SEARCH.map((name) => (
              <button
                key={name}
                onClick={() => handleSearch(name)}
                className="text-xs text-gray-500 hover:text-[#3182F6] bg-white hover:bg-blue-50 border border-gray-200 px-3 py-1.5 rounded-full transition-colors font-medium"
              >
                {name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 하단 기능 안내 */}
      <div className="border-t border-gray-100 bg-white">
        <div className="max-w-4xl mx-auto px-4 py-8 grid grid-cols-3 gap-6 text-center">
          <div>
            <div className="text-2xl mb-2">📊</div>
            <p className="text-sm font-semibold text-[#191F28]">스탯 조회</p>
            <p className="text-xs text-gray-400 mt-1">STR·DEX·INT·LUK 및 전투 능력치</p>
          </div>
          <div>
            <div className="text-2xl mb-2">🏆</div>
            <p className="text-sm font-semibold text-[#191F28]">랭킹</p>
            <p className="text-xs text-gray-400 mt-1">서버별 레벨 순위 확인</p>
          </div>
          <div>
            <div className="text-2xl mb-2">🤖</div>
            <p className="text-sm font-semibold text-[#191F28]">디스코드 봇</p>
            <p className="text-xs text-gray-400 mt-1">디스코드에서 바로 조회</p>
          </div>
        </div>
      </div>

    </div>
  )
}
