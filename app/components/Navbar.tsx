"use client"
import Link from "next/link"
import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Search, Menu, X } from "lucide-react"

const NAV_ITEMS = [
  { href: "/character", label: "캐릭터 조회" },
  { href: "/ranking",   label: "랭킹" },
  { href: "/bot",       label: "디스코드 봇" },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [query, setQuery]       = useState("")
  const pathname = usePathname()
  const router   = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = query.trim()
    if (!trimmed) return
    router.push(`/character/${encodeURIComponent(trimmed)}`)
    setQuery("")
    setMenuOpen(false)
  }

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 h-14"
        style={{ background: "rgba(13,8,16,0.7)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="max-w-6xl mx-auto px-5 h-full flex items-center gap-6">

          {/* 로고 */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <span className="text-lg">🍁</span>
            <span className="font-bold text-white text-[15px]" style={{ fontFamily: "GmarketSans, sans-serif" }}>
              메이플봇
            </span>
          </Link>

          {/* 데스크탑 메뉴 */}
          <div className="hidden md:flex items-center gap-1 ml-2">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname.startsWith(item.href)
              return (
                <Link key={item.href} href={item.href}
                  className="px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all"
                  style={{ color: isActive ? "var(--pink)" : "var(--text-sub)" }}>
                  {item.label}
                </Link>
              )
            })}
          </div>

          {/* 검색창 */}
          <form onSubmit={handleSearch} className="hidden md:flex ml-auto">
            <div className="relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="캐릭터 검색"
                className="pl-8 pr-4 py-1.5 text-[13px] rounded-lg focus:outline-none w-44 focus:w-56 transition-all"
                style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }}
              />
            </div>
          </form>

          {/* 모바일 */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden ml-auto" style={{ color: "var(--text-sub)" }}>
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* 모바일 드롭다운 */}
        {menuOpen && (
          <div className="md:hidden px-5 pb-4 space-y-1"
            style={{ background: "rgba(13,8,16,0.95)", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
            <form onSubmit={handleSearch} className="py-2">
              <div className="relative">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
                <input type="text" value={query} onChange={(e) => setQuery(e.target.value)}
                  placeholder="캐릭터 검색"
                  className="w-full pl-8 pr-4 py-2 text-sm rounded-lg focus:outline-none"
                  style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }} />
              </div>
            </form>
            {NAV_ITEMS.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)}
                className="block px-3 py-2.5 rounded-lg text-sm font-medium transition-all"
                style={{ color: pathname.startsWith(item.href) ? "var(--pink)" : "var(--text-sub)" }}>
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </nav>

      {menuOpen && <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />}
    </>
  )
}
