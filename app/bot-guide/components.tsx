"use client"
import { useState } from "react"
import { Copy, Check } from "lucide-react"
import { M, FeatureItem } from "./data"

export function CopyButton({ text, light }: { text: string; light?: boolean }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button onClick={copy} className="flex items-center gap-1.5 font-medium transition-all shrink-0"
      style={{
        fontSize: "12px", padding: "5px 10px", borderRadius: "4px",
        background: copied ? "rgba(34,197,94,0.15)" : light ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.06)",
        color:      copied ? "#4ade80" : light ? "rgba(255,255,255,0.55)" : "var(--text-muted)",
        border: `1px solid ${copied ? "rgba(34,197,94,0.3)" : "rgba(255,255,255,0.1)"}`,
      }}>
      {copied ? <><Check size={11} />복사됨</> : <><Copy size={11} />복사</>}
    </button>
  )
}

export function SectionHeading({ num, Icon, title, sub }: {
  num: string; Icon: React.ElementType; title: string; sub?: string
}) {
  return (
    <div className="flex items-start gap-4 mb-8">
      <div className="flex items-center justify-center shrink-0"
        style={{ width: "40px", height: "40px", borderRadius: "8px", background: "rgba(245,131,46,0.1)", border: "1px solid rgba(245,131,46,0.2)" }}>
        <Icon size={18} style={{ color: M.orange }} />
      </div>
      <div>
        <p className="font-bold uppercase" style={{ fontSize: "11px", color: M.orange, letterSpacing: "0.1em", marginBottom: "4px" }}>{num}</p>
        <h2 className="font-black" style={{ fontSize: "1.75rem", color: "var(--text)", letterSpacing: "-0.02em", lineHeight: 1.2 }}>{title}</h2>
        {sub && <p style={{ fontSize: "1rem", color: "var(--text-muted)", lineHeight: 1.7, marginTop: "6px" }}>{sub}</p>}
      </div>
    </div>
  )
}

const DiscordChannelHeader = () => (
  <div className="flex items-center gap-2 px-4 py-2.5"
    style={{ background: "#2f3136", borderBottom: "1px solid rgba(0,0,0,0.25)" }}>
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "rgba(255,255,255,0.3)" }}>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
    <span style={{ color: "rgba(255,255,255,0.35)", fontSize: "13px", fontWeight: 600 }}>일반</span>
  </div>
)

const BotAvatar = ({ size = 36 }: { size?: number }) => (
  <div className="rounded-full flex items-center justify-center shrink-0"
    style={{ width: size, height: size, background: `linear-gradient(135deg, ${M.red}, ${M.orange})` }}>
    <span className="text-white font-black" style={{ fontSize: size * 0.38 }}>M</span>
  </div>
)

export function DiscordCommandDemo() {
  return (
    <div style={{ background: "#313338", borderRadius: "8px", overflow: "hidden", boxShadow: "0 4px 16px rgba(0,0,0,0.3)" }}>
      <DiscordChannelHeader />
      <div className="px-4 pt-3.5">
        <div style={{ background: "#1e1f22", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "6px", overflow: "hidden" }}>
          <div className="px-3 py-1.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <span style={{ color: "rgba(255,255,255,0.25)", fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>명령어</span>
          </div>
          <div className="flex items-center gap-3 px-3 py-3" style={{ background: "rgba(88,101,242,0.18)" }}>
            <BotAvatar size={36} />
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2">
                <code style={{ fontSize: "15px", fontWeight: 700, color: "#fff", fontFamily: "monospace" }}>/정보</code>
                <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)" }}>캐릭터명</span>
              </div>
              <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.28)", lineHeight: 1.4, marginTop: "2px" }}>캐릭터 기본 정보를 조회합니다</p>
            </div>
            <span style={{ background: "#5865f2", color: "#fff", fontSize: "10px", fontWeight: 700, padding: "2px 6px", borderRadius: "3px" }}>메이플봇</span>
          </div>
        </div>
      </div>
      <div className="px-4 pb-4 pt-2">
        <div className="flex items-center gap-2 px-4 py-3" style={{ background: "#383a40", borderRadius: "6px" }}>
          <code style={{ fontSize: "15px", fontWeight: 700, color: "#fff", fontFamily: "monospace" }}>/정보</code>
          <span style={{ fontSize: "15px", color: "rgba(255,255,255,0.55)" }}>메이플유저</span>
          <span style={{ display: "inline-block", width: "2px", height: "16px", background: "rgba(255,255,255,0.75)", borderRadius: "1px" }} />
        </div>
      </div>
    </div>
  )
}

export function DiscordEmbed() {
  return (
    <div style={{ background: "#313338", borderRadius: "8px", overflow: "hidden", boxShadow: "0 4px 16px rgba(0,0,0,0.3)" }}>
      <DiscordChannelHeader />
      <div className="flex gap-3 px-4 py-4">
        <BotAvatar size={40} />
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span style={{ fontSize: "15px", fontWeight: 600, color: "#fff" }}>메이플봇</span>
            <span style={{ background: "#5865f2", color: "#fff", fontSize: "10px", fontWeight: 700, padding: "2px 5px", borderRadius: "3px" }}>APP</span>
            <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.28)" }}>오늘 오후 3:42</span>
          </div>
          <div style={{ background: "#2b2d31", borderLeft: "4px solid #5865f2", borderRadius: "4px", overflow: "hidden", maxWidth: "420px" }}>
            <div className="px-4 py-3.5">
              <p style={{ fontWeight: 700, color: "#fff", fontSize: "15px", marginBottom: "12px" }}>메이플유저</p>
              <div className="grid grid-cols-2 gap-x-8 gap-y-2.5" style={{ marginBottom: "12px" }}>
                {[["직업","아크"],["서버","리부트"],["레벨","261"],["전투력","1,234,567"],["유니온","시즌3 · Lv.8,945"],["인기도","999"]].map(([k, v]) => (
                  <div key={k}>
                    <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "11px", marginBottom: "2px" }}>{k}</p>
                    <p style={{ color: "rgba(255,255,255,0.88)", fontSize: "13px", fontWeight: 600 }}>{v}</p>
                  </div>
                ))}
              </div>
              <p style={{ color: "rgba(255,255,255,0.22)", fontSize: "11px" }}>Nexon OpenAPI · 실시간 조회</p>
            </div>
            <div className="flex flex-wrap gap-2 px-4 py-3" style={{ background: "rgba(0,0,0,0.15)", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
              {["장비 보기","레벨 변동","헥사","코디"].map(b => (
                <span key={b} style={{ background: "#4e5058", color: "rgba(255,255,255,0.88)", fontSize: "13px", fontWeight: 500, padding: "6px 14px", borderRadius: "3px" }}>{b}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function FeatureCard({ f }: { f: FeatureItem }) {
  const { Icon, label, color, colorBg, colorBorder, desc, tags, preview } = f
  return (
    <div className="flex flex-col overflow-hidden"
      style={{ border: "1px solid var(--border)", borderRadius: "8px", background: "rgba(255,255,255,0.015)" }}>
      <div className="flex items-center gap-3 px-5 py-4"
        style={{ background: "rgba(255,255,255,0.02)", borderBottom: "1px solid var(--border)" }}>
        <div className="flex items-center justify-center shrink-0"
          style={{ width: "32px", height: "32px", borderRadius: "6px", background: colorBg, border: `1px solid ${colorBorder}` }}>
          <Icon size={15} style={{ color }} />
        </div>
        <span style={{ fontSize: "13px", fontWeight: 700, padding: "3px 10px", borderRadius: "4px", background: colorBg, color, border: `1px solid ${colorBorder}` }}>{label}</span>
      </div>
      <div className="px-5 py-5 flex-1">
        <p style={{ fontSize: "1.05rem", color: "var(--text-sub)", lineHeight: 1.78, marginBottom: "16px" }}>{desc}</p>
        <div className="flex flex-wrap gap-1.5">
          {tags.map(t => (
            <span key={t} style={{ fontSize: "12px", padding: "2px 8px", borderRadius: "3px", background: "rgba(255,255,255,0.04)", color: "var(--text-muted)", border: "1px solid rgba(255,255,255,0.07)" }}>{t}</span>
          ))}
        </div>
      </div>
      <div className="mx-5 mb-5 overflow-hidden" style={{ background: "#1e1f22", borderLeft: `3px solid ${color}`, borderRadius: "4px" }}>
        <div className="flex items-center px-3 py-1.5" style={{ background: "rgba(0,0,0,0.2)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <span style={{ color: "rgba(255,255,255,0.25)", fontSize: "10px", fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase" }}>결과 예시</span>
        </div>
        <div className="px-3 py-3 space-y-1.5">
          {preview.map((line, i) => (
            <p key={i} style={{ fontFamily: "monospace", fontSize: "13px", color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>{line}</p>
          ))}
        </div>
      </div>
    </div>
  )
}

export function InfoIcon(props: React.SVGProps<SVGSVGElement> & { size: number }) {
  const { size, ...rest } = props
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...rest}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4M12 8h.01" />
    </svg>
  )
}
