"use client"
import Link from "next/link"
import { useState } from "react"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"

const NAV_ITEMS = [
  { href: "/",           label: "메인" },
  { href: "/character",  label: "캐릭터 조회" },
  { href: "/bot-guide",  label: "봇 기능 설명" },
  { href: "/updates",    label: "업데이트 내용" },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href)

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 h-14"
        style={{ background: "rgba(6,12,26,0.85)", backdropFilter: "blur(20px)", borderBottom: "1px solid var(--border)" }}>
        <div className="max-w-6xl mx-auto px-5 h-full flex items-center gap-8">

          {/* 로고 */}
          <Link href="/" className="shrink-0 font-black text-white text-[16px] tracking-tight">
            메이플봇
          </Link>

          {/* 데스크탑 메뉴 */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map(item => (
              <Link key={item.href} href={item.href}
                className="px-4 py-1.5 rounded-lg text-[13px] font-medium transition-all"
                style={{
                  color: isActive(item.href) ? "#fff" : "var(--text-sub)",
                  background: isActive(item.href) ? "rgba(59,130,246,0.15)" : "transparent",
                }}>
                {item.label}
              </Link>
            ))}
          </div>

          {/* 디스코드 추가 버튼 */}
          <Link href="https://discord.com/oauth2/authorize?client_id=1491444296623325194&permissions=51200&integration_type=0&scope=bot"
            target="_blank"
            className="hidden md:block ml-auto btn-primary text-sm px-4 py-1.5">
            서버에 추가하기
          </Link>

          {/* 모바일 */}
          <button onClick={() => setOpen(!open)} className="md:hidden ml-auto" style={{ color: "var(--text-sub)" }}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* 모바일 드롭다운 */}
        {open && (
          <div className="md:hidden px-4 pb-4 space-y-1"
            style={{ background: "rgba(6,12,26,0.98)", borderTop: "1px solid var(--border)" }}>
            {NAV_ITEMS.map(item => (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)}
                className="block px-4 py-2.5 rounded-lg text-sm font-medium"
                style={{ color: isActive(item.href) ? "#fff" : "var(--text-sub)" }}>
                {item.label}
              </Link>
            ))}
            <Link href="https://discord.com/oauth2/authorize?client_id=1491444296623325194&permissions=51200&integration_type=0&scope=bot"
              target="_blank" className="block mt-2 btn-primary text-sm px-4 py-2.5 text-center">
              서버에 추가하기
            </Link>
          </div>
        )}
      </nav>
      {open && <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />}
    </>
  )
}
