"use client"
import Link from "next/link"
import { useState } from "react"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"

const menuItems = [
  { href: "/character", label: "캐릭터 조회" },
  { href: "/ranking",   label: "랭킹" },
  { href: "/bot",       label: "디스코드 봇" },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white border-b border-[#E5E8EB]">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center gap-2">

          {/* 로고 */}
          <Link href="/" className="flex items-center gap-2 shrink-0 mr-3">
            <span className="text-xl">🍁</span>
            <span className="text-base font-black text-[#191F28] tracking-tight">메이플봇</span>
          </Link>

          {/* 데스크탑 메뉴 */}
          <div className="hidden md:flex items-center gap-0.5 flex-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
              return (
                <Link key={item.href} href={item.href}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                    isActive
                      ? "text-[#3182F6] bg-[#EBF3FE] font-semibold"
                      : "text-[#8B95A1] hover:text-[#191F28] hover:bg-[#F2F4F6]"
                  }`}>
                  {item.label}
                </Link>
              )
            })}
          </div>

          {/* 오른쪽 */}
          <div className="flex items-center gap-2 ml-auto">
            <Link href="/character"
              className="hidden md:flex items-center gap-1.5 bg-[#3182F6] hover:bg-[#1C6EE8] text-white px-4 py-1.5 rounded-lg font-semibold text-sm transition-colors">
              캐릭터 검색
            </Link>

            {/* 햄버거 */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg text-[#8B95A1] hover:bg-[#F2F4F6] transition-colors">
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* 모바일 드롭다운 */}
        {menuOpen && (
          <div className="md:hidden bg-white border-t border-[#E5E8EB] py-2 flex flex-col">
            {menuItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link key={item.href} href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={`px-5 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? "text-[#3182F6] bg-[#EBF3FE]"
                      : "text-[#191F28] hover:bg-[#F2F4F6]"
                  }`}>
                  {item.label}
                </Link>
              )
            })}
          </div>
        )}
      </nav>

      {menuOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
      )}
    </>
  )
}
