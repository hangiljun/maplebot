"use client"
import { useEffect, useState } from "react"
import { X, Trash2, MessageSquare, Send, Loader2 } from "lucide-react"
import { Request, PRIORITY_META, STATUS_META, fmtDate } from "./types"

export function DetailModal({ r, onClose, isAdmin, onDelete, onComment }: {
  r: Request
  onClose: () => void
  isAdmin: boolean
  onDelete: (id: string) => void
  onComment: (id: string, comment: string | null) => Promise<void>
}) {
  const p = PRIORITY_META[r.priority]
  const s = STATUS_META[r.status]

  const [editingComment, setEditingComment] = useState(false)
  const [commentText, setCommentText]       = useState(r.adminComment ?? "")
  const [saving, setSaving]                 = useState(false)

  useEffect(() => {
    setCommentText(r.adminComment ?? "")
    setEditingComment(false)
  }, [r.id, r.adminComment])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [onClose])

  const saveComment = async () => {
    setSaving(true)
    await onComment(r.id, commentText.trim() || null)
    setSaving(false)
    setEditingComment(false)
  }

  const deleteComment = async () => {
    setSaving(true)
    await onComment(r.id, null)
    setCommentText("")
    setSaving(false)
    setEditingComment(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
      onClick={onClose}>
      <div className="w-full max-w-lg"
        style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "10px", overflow: "hidden" }}
        onClick={e => e.stopPropagation()}>

        {/* 헤더 */}
        <div className="flex items-start justify-between gap-3 px-6 py-5"
          style={{ borderBottom: "1px solid var(--border)" }}>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap gap-1.5 mb-2">
              <span style={{ fontSize: "11px", fontWeight: 700, padding: "2px 8px", borderRadius: "3px", background: p.bg, color: p.color, border: `1px solid ${p.border}` }}>{p.text}</span>
              <span style={{ fontSize: "11px", fontWeight: 700, padding: "2px 8px", borderRadius: "3px", background: s.bg, color: s.color, border: `1px solid ${s.border}` }}>{s.text}</span>
            </div>
            <h2 className="font-bold" style={{ fontSize: "1.1rem", color: "var(--text)", lineHeight: 1.4 }}>{r.title}</h2>
          </div>
          <button onClick={onClose} style={{ color: "var(--text-muted)", padding: "4px", flexShrink: 0 }}>
            <X size={18} />
          </button>
        </div>

        {/* 본문 */}
        <div className="px-6 py-5" style={{ borderBottom: "1px solid var(--border)" }}>
          {r.description
            ? <p style={{ fontSize: "0.95rem", color: "var(--text-sub)", lineHeight: 1.8, whiteSpace: "pre-wrap" }}>{r.description}</p>
            : <p style={{ fontSize: "0.95rem", color: "var(--text-muted)" }}>내용 없음</p>
          }
        </div>

        {/* 개발자 답변 영역 */}
        <div className="px-6 py-4" style={{ borderBottom: "1px solid var(--border)", background: "rgba(245,131,46,0.03)" }}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5">
              <MessageSquare size={13} style={{ color: "var(--orange, #f5832e)" }} />
              <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--orange, #f5832e)" }}>개발자 답변</span>
            </div>
            {isAdmin && !editingComment && (
              <button
                onClick={() => setEditingComment(true)}
                style={{ fontSize: "11px", color: "var(--text-muted)", padding: "3px 8px", borderRadius: "4px", border: "1px solid var(--border)", background: "rgba(255,255,255,0.03)" }}>
                {r.adminComment ? "수정" : "작성"}
              </button>
            )}
          </div>

          {/* 관리자 편집 모드 */}
          {isAdmin && editingComment ? (
            <div className="space-y-2">
              <textarea
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                placeholder="답변을 입력하세요&#13;&#10;예) 검토 결과 해당 기능은 추후 업데이트 예정입니다."
                rows={4}
                maxLength={500}
                autoFocus
                className="w-full bg-transparent resize-none"
                style={{ fontSize: "14px", color: "var(--text)", padding: "10px 12px", border: "1px solid rgba(245,131,46,0.35)", borderRadius: "6px", outline: "none", lineHeight: 1.7 }}
              />
              <div className="flex items-center justify-between">
                <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>{commentText.length} / 500</span>
                <div className="flex gap-2">
                  {r.adminComment && (
                    <button onClick={deleteComment} disabled={saving}
                      style={{ fontSize: "12px", color: "#f87171", padding: "5px 10px", borderRadius: "5px", border: "1px solid rgba(239,68,68,0.3)", background: "rgba(239,68,68,0.08)" }}>
                      삭제
                    </button>
                  )}
                  <button onClick={() => { setEditingComment(false); setCommentText(r.adminComment ?? "") }}
                    disabled={saving}
                    style={{ fontSize: "12px", color: "var(--text-muted)", padding: "5px 10px", borderRadius: "5px", border: "1px solid var(--border)", background: "rgba(255,255,255,0.03)" }}>
                    취소
                  </button>
                  <button onClick={saveComment} disabled={saving || !commentText.trim()}
                    className="flex items-center gap-1.5"
                    style={{ fontSize: "12px", fontWeight: 600, color: "#fff", padding: "5px 12px", borderRadius: "5px", background: saving || !commentText.trim() ? "rgba(255,255,255,0.1)" : "rgba(245,131,46,0.85)", cursor: saving || !commentText.trim() ? "not-allowed" : "pointer" }}>
                    {saving ? <Loader2 size={11} className="animate-spin" /> : <Send size={11} />}
                    저장
                  </button>
                </div>
              </div>
            </div>
          ) : r.adminComment ? (
            /* 답변 표시 */
            <div className="px-4 py-3 rounded-lg"
              style={{ background: "rgba(245,131,46,0.06)", border: "1px solid rgba(245,131,46,0.2)", borderLeft: "3px solid rgba(245,131,46,0.6)" }}>
              <p style={{ fontSize: "0.95rem", color: "var(--text-sub)", lineHeight: 1.8, whiteSpace: "pre-wrap" }}>{r.adminComment}</p>
            </div>
          ) : (
            <p style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>아직 답변이 없습니다.</p>
          )}
        </div>

        {/* 푸터 */}
        <div className="flex items-center justify-between px-6 py-4"
          style={{ background: "rgba(255,255,255,0.015)" }}>
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
