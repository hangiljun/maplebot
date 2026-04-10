"use client"
import Link from "next/link"
import { useState } from "react"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"

const NAV_ITEMS = [
  { href: "/",          label: "메인" },
  { href: "/character", label: "캐릭터 조회" },
  { href: "/bot-guide", label: "봇 기능 설명" },
  { href: "/updates",   label: "업데이트 내용" },
]

const DISCORD_URL = "https://discord.com/oauth2/authorize?client_id=1491444296623325194&permissions=51200&integration_type=0&scope=bot"
const CONTACT_MAIL = "mailto:myrlfwns1@naver.com"

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href)

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 h-14"
        style={{
          background: "rgba(13,17,23,0.92)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
        }}>
        <div className="section-container h-full flex items-center gap-6">

          {/* 로고 */}
          <Link href="/" className="shrink-0 font-black text-[16px] tracking-tight"
            style={{ color: "var(--blue-light)" }}>
            메이플봇
          </Link>

          {/* 데스크탑 메뉴 */}
          <div className="hidden md:flex items-center gap-2 flex-1">
            {NAV_ITEMS.map(item => (
              <Link key={item.href} href={item.href}
                className="px-5 py-2 rounded-lg text-[13px] transition-all"
                style={{
                  color: isActive(item.href) ? "var(--blue-light)" : "var(--text-muted)",
                  background: isActive(item.href) ? "rgba(59,130,246,0.1)" : "transparent",
                  fontWeight: isActive(item.href) ? 600 : 400,
                }}>
                {item.label}
              </Link>
            ))}
            <a href={CONTACT_MAIL}
              className="px-5 py-2 rounded-lg text-[13px] transition-all"
              style={{ color: "var(--text-muted)", fontWeight: 400 }}>
              개발자 문의
            </a>
          </div>

          {/* 서버 추가 버튼 */}
          <Link href={DISCORD_URL} target="_blank"
            className="hidden md:block btn-primary text-sm px-4 py-1.5 ml-auto">
            서버에 추가하기
          </Link>

          {/* 모바일 햄버거 */}
          <button onClick={() => setOpen(!open)} className="md:hidden ml-auto p-1"
            style={{ color: "var(--text-muted)" }}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* 모바일 드롭다운 */}
        {open && (
          <div className="md:hidden px-5 pb-4 space-y-1"
            style={{ background: "rgba(13,17,23,0.98)", borderTop: "1px solid var(--border)" }}>
            {NAV_ITEMS.map(item => (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)}
                className="block px-4 py-3 rounded-lg text-sm"
                style={{
                  color: isActive(item.href) ? "var(--blue-light)" : "var(--text-sub)",
                  background: isActive(item.href) ? "rgba(59,130,246,0.08)" : "transparent",
                }}>
                {item.label}
              </Link>
            ))}
            <a href={CONTACT_MAIL} onClick={() => setOpen(false)}
              className="block px-4 py-3 rounded-lg text-sm"
              style={{ color: "var(--text-sub)" }}>
              개발자 문의
            </a>
            <Link href={DISCORD_URL} target="_blank" onClick={() => setOpen(false)}
              className="block mt-2 btn-primary text-sm px-4 py-2.5 text-center">
              서버에 추가하기
            </Link>
          </div>
        )}
      </nav>

      {open && (
        <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
      )}
    </>
  )
}
