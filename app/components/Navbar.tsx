"use client"
import Link from "next/link"
import { useState, useRef, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Search, Menu, X } from "lucide-react"

const menuItems = [
  { href: "/character", label: "캐릭터 조회" },
  { href: "/ranking",   label: "랭킹" },
  { href: "/bot",       label: "디스코드 봇" },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [query, setQuery]       = useState("")
  const pathname = usePathname()
  const router   = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)

  // 상세 페이지가 아닌 곳에선 검색창 숨기기
  const showSearch = pathname !== "/" && !pathname.startsWith("/bot")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = query.trim()
    if (!trimmed) return
    router.push(`/character/${encodeURIComponent(trimmed)}`)
    setQuery("")
  }

  useEffect(() => { setMenuOpen(false) }, [pathname])

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center gap-3">

          {/* 로고 */}
          <Link href="/" className="flex items-center gap-1.5 shrink-0">
            <span className="text-lg">🍁</span>
            <span className="font-extrabold text-[#191F28] text-[15px] tracking-tight">메이플봇</span>
          </Link>

          {/* 인라인 검색창 (홈 제외) */}
          {showSearch && (
            <form onSubmit={handleSearch}
              className="hidden md:flex items-center gap-2 flex-1 max-w-xs ml-2">
              <div className="relative flex-1">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="캐릭터 검색"
                  className="w-full pl-8 pr-3 py-1.5 text-sm bg-[#F5F6FA] border border-gray-200 rounded-lg focus:outline-none focus:border-[#3182F6] transition-colors"
                />
              </div>
            </form>
          )}

          {/* 데스크탑 메뉴 */}
          <div className="hidden md:flex items-center gap-0.5 ml-auto">
            {menuItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
              return (
                <Link key={item.href} href={item.href}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "text-[#3182F6] bg-blue-50 font-semibold"
                      : "text-gray-500 hover:text-[#191F28] hover:bg-gray-50"
                  }`}>
                  {item.label}
                </Link>
              )
            })}
          </div>

          {/* 모바일 햄버거 */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden ml-auto flex items-center justify-center w-8 h-8 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors">
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {/* 모바일 메뉴 */}
        {menuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 py-2">
            {/* 모바일 검색 */}
            <form onSubmit={handleSearch} className="px-4 pb-2">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="캐릭터 검색"
                  className="w-full pl-8 pr-3 py-2 text-sm bg-[#F5F6FA] border border-gray-200 rounded-lg focus:outline-none focus:border-[#3182F6]"
                />
              </div>
            </form>
            {menuItems.map((item) => (
              <Link key={item.href} href={item.href}
                className={`block px-4 py-2.5 text-sm font-medium ${
                  pathname === item.href
                    ? "text-[#3182F6] bg-blue-50"
                    : "text-[#191F28] hover:bg-gray-50"
                }`}>
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </nav>

      {menuOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
      )}
    </>
  )
}
