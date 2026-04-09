"use client"
import Link from "next/link"
import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Search, Menu, X } from "lucide-react"

const NAV_ITEMS = [
  { href: "/",          label: "메인" },
  { href: "/character", label: "캐릭터 조회" },
  { href: "/ranking",   label: "랭킹" },
  { href: "/union",     label: "유니온" },
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
      <nav className="sticky top-0 z-50"
        style={{ background: "#0d0f18", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="max-w-7xl mx-auto px-4 h-12 flex items-center gap-6">

          {/* 로고 */}
          <Link href="/" className="flex items-center gap-1.5 shrink-0">
            <span className="text-base">🍁</span>
            <span className="font-extrabold text-white text-[14px] tracking-tight">메이플봇</span>
          </Link>

          {/* 데스크탑 메뉴 */}
          <div className="hidden md:flex items-center gap-0">
            {NAV_ITEMS.map((item) => {
              const isActive = item.href === "/"
                ? pathname === "/"
                : pathname === item.href || pathname.startsWith(item.href + "/")
              return (
                <Link key={item.href} href={item.href}
                  className="px-3 py-1 text-[13px] font-medium transition-colors whitespace-nowrap"
                  style={{ color: isActive ? "#fff" : "rgba(255,255,255,0.5)" }}>
                  {item.label}
                </Link>
              )
            })}
          </div>

          {/* 검색창 (우측) */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center ml-auto">
            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="캐릭터 닉네임 검색"
                className="w-52 pl-3 pr-8 py-1.5 text-[13px] rounded-md focus:outline-none focus:w-64 transition-all"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "#fff",
                }}
              />
              <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2"
                style={{ color: "rgba(255,255,255,0.4)" }}>
                <Search size={13} />
              </button>
            </div>
          </form>

          {/* 모바일 햄버거 */}
          <button onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden ml-auto"
            style={{ color: "rgba(255,255,255,0.6)" }}>
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* 모바일 메뉴 */}
        {menuOpen && (
          <div className="md:hidden py-2" style={{ background: "#13141a", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <form onSubmit={handleSearch} className="px-4 pb-2">
              <div className="relative">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "rgba(255,255,255,0.3)" }} />
                <input type="text" value={query} onChange={(e) => setQuery(e.target.value)}
                  placeholder="캐릭터 검색"
                  className="w-full pl-8 pr-3 py-2 text-sm rounded-lg focus:outline-none"
                  style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }} />
              </div>
            </form>
            {NAV_ITEMS.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)}
                className="block px-4 py-2.5 text-sm font-medium"
                style={{ color: pathname === item.href ? "#fff" : "rgba(255,255,255,0.5)" }}>
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
