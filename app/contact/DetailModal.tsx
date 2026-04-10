"use client"
import { useEffect } from "react"
import { X, Trash2 } from "lucide-react"
import { Request, PRIORITY_META, STATUS_META, fmtDate } from "./types"

export function DetailModal({ r, onClose, isAdmin, onDelete }: {
  r: Request
  onClose: () => void
  isAdmin: boolean
  onDelete: (id: string) => void
}) {
  const p = PRIORITY_META[r.priority]
  const s = STATUS_META[r.status]

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
      onClick={onClose}>
      <div className="w-full max-w-lg"
        style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "10px", overflow: "hidden" }}
        onClick={e => e.stopPropagation()}>

        <div className="flex items-start justify-between gap-3 px-6 py-5"
          style={{ borderBottom: "1px solid var(--border)" }}>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap gap-1.5 mb-2">
              <span style={{ fontSize: "11px", fontWeight: 700, padding: "2px 8px", borderRadius: "3px", background: p.bg, color: p.color, border: `1px solid ${p.border}` }}>{p.text}</span>
              <span style={{ fontSize: "11px", fontWeight: 700, padding: "2px 8px", borderRadius: "3px", background: s.bg, color: s.color, border: `1px solid ${s.border}` }}>{s.text}</span>
            </div>
            <h2 className="font-bold" style={{ fontSize: "1.1rem", color: "var(--text)", lineHeight: 1.4 }}>{r.title}</h2>
          </div>
          <button onClick={onClose} style={{ color: "var(--text-muted)", padding: "2px", flexShrink: 0 }}>
            <X size={18} />
          </button>
        </div>

        <div className="px-6 py-5">
          {r.description
            ? <p style={{ fontSize: "0.95rem", color: "var(--text-sub)", lineHeight: 1.8, whiteSpace: "pre-wrap" }}>{r.description}</p>
            : <p style={{ fontSize: "0.95rem", color: "var(--text-muted)" }}>내용 없음</p>
          }
        </div>

        <div className="flex items-center justify-between px-6 py-4"
          style={{ borderTop: "1px solid var(--border)", background: "rgba(255,255,255,0.015)" }}>
          <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>{r.nickname} · {fmtDate(r.createdAt)}</p>
          {isAdmin && (
            <button onClick={() => { onDelete(r.id); onClose() }}
              className="flex items-center gap-1.5"
              style={{ fontSize: "12px", color: "#f87171", padding: "5px 10px", borderRadius: "5px", border: "1px solid rgba(239,68,68,0.3)", background: "rgba(239,68,68,0.08)" }}>
              <Trash2 size={12} /> 삭제
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
