"use client"
import Link from "next/link"
import { useState } from "react"
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

  const showSearch = pathname !== "/" && !pathname.startsWith("/bot")

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
      <nav className="sticky top-0 z-50 border-b"
        style={{ background: "rgba(19,20,26,0.92)", backdropFilter: "blur(12px)", borderColor: "var(--border)" }}>
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center gap-4">

          {/* 로고 */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <span className="text-xl">🍁</span>
            <span className="font-extrabold text-white text-[15px] tracking-tight">메이플봇</span>
          </Link>

          {/* 인라인 검색창 */}
          {showSearch && (
            <form onSubmit={handleSearch} className="hidden md:flex items-center flex-1 max-w-xs ml-2">
              <div className="relative w-full">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="캐릭터 검색"
                  className="w-full pl-8 pr-3 py-1.5 text-sm rounded-lg focus:outline-none transition-colors"
                  style={{
                    background: "var(--bg-surface)",
                    border: "1px solid var(--border)",
                    color: "var(--text-1)",
                  }}
                />
              </div>
            </form>
          )}

          {/* 데스크탑 메뉴 */}
          <div className="hidden md:flex items-center gap-1 ml-auto">
            {menuItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
              return (
                <Link key={item.href} href={item.href}
                  className="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                  style={{
                    color: isActive ? "var(--primary)" : "var(--text-2)",
                    background: isActive ? "rgba(92,184,92,0.1)" : "transparent",
                  }}>
                  {item.label}
                </Link>
              )
            })}
          </div>

          {/* 모바일 햄버거 */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden ml-auto flex items-center justify-center w-8 h-8 rounded-lg transition-colors"
            style={{ color: "var(--text-2)" }}>
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {/* 모바일 메뉴 */}
        {menuOpen && (
          <div className="md:hidden border-t py-2" style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
            <form onSubmit={handleSearch} className="px-4 pb-2">
              <div className="relative">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="캐릭터 검색"
                  className="w-full pl-8 pr-3 py-2 text-sm rounded-lg focus:outline-none"
                  style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", color: "var(--text-1)" }}
                />
              </div>
            </form>
            {menuItems.map((item) => (
              <Link key={item.href} href={item.href}
                className="block px-4 py-2.5 text-sm font-medium transition-colors"
                style={{ color: pathname === item.href ? "var(--primary)" : "var(--text-1)" }}>
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
