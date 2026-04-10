"use client"
import { useState, useEffect, useCallback } from "react"
import {
  Send, AlertCircle, CheckCircle2, Clock,
  RefreshCw, Megaphone, ArrowUpDown, X, Trash2, Lock, Shield,
} from "lucide-react"

// ─── Types ────────────────────────────────────────────────────────────────────
type Priority = "high" | "medium" | "low"
type Status   = "reviewing" | "planned" | "in-progress" | "done"

type Request = {
  id: string
  title: string
  description: string | null
  nickname: string
  priority: Priority
  status: Status
  createdAt: string
}

// ─── 라벨 매핑 ────────────────────────────────────────────────────────────────
const PRIORITY_META: Record<Priority, { text: string; color: string; bg: string; border: string }> = {
  high:   { text: "높음", color: "#f87171", bg: "rgba(239,68,68,0.1)",   border: "rgba(239,68,68,0.25)"   },
  medium: { text: "보통", color: "#fb923c", bg: "rgba(251,146,60,0.1)",  border: "rgba(251,146,60,0.25)"  },
  low:    { text: "낮음", color: "#60a5fa", bg: "rgba(96,165,250,0.1)",  border: "rgba(96,165,250,0.25)"  },
}

const STATUS_META: Record<Status, { text: string; color: string; bg: string; border: string }> = {
  reviewing:    { text: "검토중", color: "#9ca3af", bg: "rgba(156,163,175,0.1)", border: "rgba(156,163,175,0.2)" },
  planned:      { text: "예정",   color: "#818cf8", bg: "rgba(129,140,248,0.1)", border: "rgba(129,140,248,0.2)" },
  "in-progress":{ text: "진행중", color: "#f59e0b", bg: "rgba(245,158,11,0.1)",  border: "rgba(245,158,11,0.2)"  },
  done:         { text: "완료",   color: "#4ade80", bg: "rgba(74,222,128,0.1)",   border: "rgba(74,222,128,0.2)"  },
}

// ─── 날짜 포맷 ────────────────────────────────────────────────────────────────
function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" })
}

// ─── 상세 모달 ────────────────────────────────────────────────────────────────
function DetailModal({ r, onClose, isAdmin, onDelete }: {
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

        {/* 헤더 */}
        <div className="flex items-start justify-between gap-3 px-6 py-5"
          style={{ borderBottom: "1px solid var(--border)" }}>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap gap-1.5 mb-2">
              <span style={{ fontSize: "11px", fontWeight: 700, padding: "2px 8px", borderRadius: "3px", background: p.bg, color: p.color, border: `1px solid ${p.border}` }}>
                {p.text}
              </span>
              <span style={{ fontSize: "11px", fontWeight: 700, padding: "2px 8px", borderRadius: "3px", background: s.bg, color: s.color, border: `1px solid ${s.border}` }}>
                {s.text}
              </span>
            </div>
            <h2 className="font-bold" style={{ fontSize: "1.1rem", color: "var(--text)", lineHeight: 1.4 }}>
              {r.title}
            </h2>
          </div>
          <button onClick={onClose} style={{ color: "var(--text-muted)", padding: "2px", flexShrink: 0 }}>
            <X size={18} />
          </button>
        </div>

        {/* 본문 */}
        <div className="px-6 py-5">
          {r.description ? (
            <p style={{ fontSize: "0.95rem", color: "var(--text-sub)", lineHeight: 1.8, whiteSpace: "pre-wrap" }}>
              {r.description}
            </p>
          ) : (
            <p style={{ fontSize: "0.95rem", color: "var(--text-muted)" }}>내용 없음</p>
          )}
        </div>

        {/* 푸터 */}
        <div className="flex items-center justify-between px-6 py-4"
          style={{ borderTop: "1px solid var(--border)", background: "rgba(255,255,255,0.015)" }}>
          <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>
            {r.nickname} · {fmtDate(r.createdAt)}
          </p>
          {isAdmin && (
            <button
              onClick={() => { onDelete(r.id); onClose() }}
              className="flex items-center gap-1.5 transition-all"
              style={{ fontSize: "12px", color: "#f87171", padding: "5px 10px", borderRadius: "5px", border: "1px solid rgba(239,68,68,0.3)", background: "rgba(239,68,68,0.08)" }}>
              <Trash2 size={12} />
              삭제
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── 관리자 로그인 모달 ────────────────────────────────────────────────────────
function AdminLoginModal({ onClose, onLogin }: { onClose: () => void; onLogin: (pw: string) => void }) {
  const [pw, setPw] = useState("")

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
      onClick={onClose}>
      <div className="w-full max-w-sm p-6"
        style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "10px" }}
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-2 mb-4">
          <Shield size={16} style={{ color: "var(--blue-light)" }} />
          <h2 className="font-bold" style={{ fontSize: "1rem", color: "var(--text)" }}>관리자 로그인</h2>
        </div>
        <input
          type="password"
          value={pw}
          onChange={e => setPw(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") onLogin(pw) }}
          placeholder="비밀번호"
          autoFocus
          className="w-full bg-transparent mb-3"
          style={{ fontSize: "14px", color: "var(--text)", padding: "9px 12px", border: "1px solid var(--border)", borderRadius: "6px", outline: "none" }}
        />
        <button onClick={() => onLogin(pw)} className="w-full font-bold"
          style={{ fontSize: "14px", padding: "10px", borderRadius: "6px", background: "var(--blue-light)", color: "#fff" }}>
          확인
        </button>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ContactPage() {
  const [requests, setRequests]   = useState<Request[]>([])
  const [loading, setLoading]     = useState(true)
  const [sortBy, setSortBy]       = useState<"date" | "priority">("date")
  const [form, setForm]           = useState({ nickname: "", title: "", description: "" })
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult]       = useState<{ ok: boolean; msg: string } | null>(null)
  const [selected, setSelected]   = useState<Request | null>(null)
  const [showAdminLogin, setShowAdminLogin] = useState(false)
  const [isAdmin, setIsAdmin]     = useState(false)
  const [adminPassword, setAdminPassword] = useState("")
  const [adminError, setAdminError] = useState(false)

  const fetchRequests = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/feature-request", { cache: "no-store" })
      const data = await res.json()
      setRequests(data as Request[])
    } catch {
      setRequests([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchRequests() }, [fetchRequests])

  // 정렬
  const sorted = [...requests].sort((a, b) => {
    if (sortBy === "priority") {
      const order: Record<Priority, number> = { high: 0, medium: 1, low: 2 }
      return order[a.priority] - order[b.priority]
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })

  // 제출
  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title.trim() || !form.description.trim()) return
    setSubmitting(true)
    setResult(null)
    try {
      const res = await fetch("/api/feature-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (res.ok) {
        setResult({ ok: true, msg: "요청이 등록되었습니다! 검토 후 우선순위를 결정합니다." })
        setForm({ nickname: "", title: "", description: "" })
        setTimeout(fetchRequests, 1500)
      } else {
        setResult({ ok: false, msg: data.error || "요청 전송에 실패했습니다." })
      }
    } catch {
      setResult({ ok: false, msg: "네트워크 오류가 발생했습니다." })
    } finally {
      setSubmitting(false)
    }
  }

  // 관리자 로그인
  const handleAdminLogin = async (pw: string) => {
    // 서버에 빈 요청으로 비밀번호 검증
    const res = await fetch("/api/feature-request", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: "__check__", adminPassword: pw }),
    })
    // 403이면 틀린 비밀번호, 400(id 없음)이면 맞는 비밀번호
    if (res.status === 400) {
      setIsAdmin(true)
      setAdminPassword(pw)
      setShowAdminLogin(false)
      setAdminError(false)
    } else {
      setAdminError(true)
      setTimeout(() => setAdminError(false), 2000)
    }
  }

  // 삭제
  const handleDelete = async (id: string) => {
    if (!confirm("정말 삭제하시겠습니까?")) return
    await fetch("/api/feature-request", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, adminPassword }),
    })
    setRequests(prev => prev.filter(r => r.id !== id))
  }

  const canSubmit = !submitting && form.title.trim().length > 0 && form.description.trim().length > 0

  const statCounts = {
    total:      requests.length,
    inProgress: requests.filter(r => r.status === "in-progress").length,
    done:       requests.filter(r => r.status === "done").length,
    high:       requests.filter(r => r.priority === "high").length,
  }

  return (
    <div style={{ paddingTop: "56px", minHeight: "100vh" }}>
      {/* 상세 모달 */}
      {selected && (
        <DetailModal
          r={selected}
          onClose={() => setSelected(null)}
          isAdmin={isAdmin}
          onDelete={handleDelete}
        />
      )}

      {/* 관리자 로그인 모달 */}
      {showAdminLogin && (
        <AdminLoginModal
          onClose={() => { setShowAdminLogin(false); setAdminError(false) }}
          onLogin={handleAdminLogin}
        />
      )}

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">

        {/* ── Hero ── */}
        <div className="mb-10 flex items-start justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 mb-4"
              style={{ fontSize: "12px", fontWeight: 600, padding: "4px 12px", borderRadius: "4px", background: "rgba(59,130,246,0.1)", color: "var(--blue-light)", border: "1px solid rgba(59,130,246,0.2)" }}>
              <Megaphone size={12} />
              기능 요청 게시판
            </div>
            <h1 className="font-black mb-3" style={{ fontSize: "2.2rem", color: "var(--text)", letterSpacing: "-0.025em", lineHeight: 1.2 }}>
              개발자 문의
            </h1>
            <p style={{ fontSize: "1.05rem", color: "var(--text-muted)", lineHeight: 1.78, maxWidth: "540px" }}>
              메이플봇에 추가되었으면 하는 기능을 자유롭게 요청해주세요.
              접수된 요청은 검토 후 우선순위를 결정하여 개발에 반영합니다.
            </p>
          </div>

          {/* 관리자 버튼 */}
          <button
            onClick={() => isAdmin ? setIsAdmin(false) : setShowAdminLogin(true)}
            className="flex items-center gap-1.5 shrink-0 mt-1"
            style={{
              fontSize: "12px", fontWeight: 600, padding: "6px 12px", borderRadius: "5px",
              border: `1px solid ${isAdmin ? "rgba(74,222,128,0.3)" : "var(--border)"}`,
              background: isAdmin ? "rgba(74,222,128,0.08)" : "rgba(255,255,255,0.02)",
              color: isAdmin ? "#4ade80" : "var(--text-muted)",
            }}>
            {isAdmin ? <><Shield size={12} />관리자 모드</> : <><Lock size={12} />관리자</>}
          </button>
        </div>

        {/* ── 통계 바 ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { label: "전체 요청",    val: statCounts.total      },
            { label: "진행중",       val: statCounts.inProgress },
            { label: "완료",         val: statCounts.done       },
            { label: "높음 우선순위", val: statCounts.high       },
          ].map(s => (
            <div key={s.label} className="px-4 py-3 text-center"
              style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--border)", borderRadius: "8px" }}>
              <p className="font-black" style={{ fontSize: "1.5rem", color: "var(--text)", lineHeight: 1 }}>{s.val}</p>
              <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* ── 범례 ── */}
        <div className="flex flex-wrap gap-x-6 gap-y-2 mb-8 px-1">
          <div className="flex items-center gap-3">
            <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.07em" }}>우선순위</span>
            {(Object.entries(PRIORITY_META) as [Priority, typeof PRIORITY_META[Priority]][]).map(([k, v]) => (
              <span key={k} style={{ fontSize: "11px", fontWeight: 700, padding: "2px 8px", borderRadius: "3px", background: v.bg, color: v.color, border: `1px solid ${v.border}` }}>{v.text}</span>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.07em" }}>상태</span>
            {(Object.entries(STATUS_META) as [Status, typeof STATUS_META[Status]][]).map(([k, v]) => (
              <span key={k} style={{ fontSize: "11px", fontWeight: 700, padding: "2px 8px", borderRadius: "3px", background: v.bg, color: v.color, border: `1px solid ${v.border}` }}>{v.text}</span>
            ))}
          </div>
        </div>

        {/* ── 2컬럼 ── */}
        <div className="flex flex-col md:flex-row gap-8 items-start">

          {/* 목록 */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold" style={{ fontSize: "1.05rem", color: "var(--text)" }}>
                요청 목록&nbsp;
                <span style={{ fontSize: "0.9rem", fontWeight: 400, color: "var(--text-muted)" }}>
                  ({requests.length}건)
                </span>
              </h2>
              <div className="flex items-center gap-2">
                <button onClick={() => setSortBy(s => s === "date" ? "priority" : "date")}
                  className="flex items-center gap-1.5 transition-all"
                  style={{ fontSize: "12px", color: "var(--text-muted)", padding: "4px 8px", borderRadius: "4px", border: "1px solid var(--border)", background: "rgba(255,255,255,0.02)" }}>
                  <ArrowUpDown size={11} />
                  {sortBy === "date" ? "최신순" : "우선순위순"}
                </button>
                <button onClick={fetchRequests}
                  className="flex items-center gap-1.5 transition-all"
                  style={{ fontSize: "12px", color: "var(--text-muted)", padding: "4px 8px", borderRadius: "4px", border: "1px solid var(--border)", background: "rgba(255,255,255,0.02)" }}>
                  <RefreshCw size={11} />
                  새로고침
                </button>
              </div>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="animate-pulse"
                    style={{ height: "100px", background: "rgba(255,255,255,0.03)", borderRadius: "8px" }} />
                ))}
              </div>
            ) : sorted.length === 0 ? (
              <div className="py-20 text-center"
                style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--border)", borderRadius: "8px" }}>
                <p style={{ fontSize: "1rem", color: "var(--text-muted)" }}>아직 등록된 요청이 없습니다.</p>
                <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", marginTop: "4px" }}>첫 번째 기능을 요청해보세요!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {sorted.map(r => {
                  const p = PRIORITY_META[r.priority]
                  const s = STATUS_META[r.status]
                  return (
                    <div key={r.id}
                      onClick={() => setSelected(r)}
                      className="p-5 cursor-pointer transition-all"
                      style={{
                        background: "rgba(255,255,255,0.02)",
                        border: "1px solid var(--border)",
                        borderRadius: "8px",
                        borderLeft: `3px solid ${p.color}`,
                        opacity: r.status === "done" ? 0.65 : 1,
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.04)")}
                      onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")}>

                      {/* 상단 */}
                      <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                        <p className="font-semibold flex-1"
                          style={{ fontSize: "1rem", color: "var(--text)", lineHeight: 1.4 }}>
                          {r.title}
                        </p>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span style={{ fontSize: "11px", fontWeight: 700, padding: "2px 8px", borderRadius: "3px", background: p.bg, color: p.color, border: `1px solid ${p.border}` }}>
                            {p.text}
                          </span>
                          <span style={{ fontSize: "11px", fontWeight: 700, padding: "2px 8px", borderRadius: "3px", background: s.bg, color: s.color, border: `1px solid ${s.border}` }}>
                            {s.text}
                          </span>
                          {isAdmin && (
                            <button
                              onClick={e => { e.stopPropagation(); handleDelete(r.id) }}
                              style={{ padding: "3px 6px", borderRadius: "4px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", color: "#f87171" }}>
                              <Trash2 size={11} />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* 내용 미리보기 */}
                      {r.description && (
                        <p style={{
                          fontSize: "0.9rem", color: "var(--text-muted)", lineHeight: 1.65,
                          marginBottom: "10px",
                          display: "-webkit-box", WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical", overflow: "hidden",
                        }}>
                          {r.description}
                        </p>
                      )}

                      {/* 닉네임 · 날짜 */}
                      <p style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                        {r.nickname} · {fmtDate(r.createdAt)}
                        <span style={{ marginLeft: "8px", color: "var(--text-muted)", opacity: 0.5 }}>클릭하여 전체 보기</span>
                      </p>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* 신청 폼 */}
          <div className="w-full md:w-72 shrink-0" style={{ position: "sticky", top: "72px" }}>
            <div style={{ border: "1px solid var(--border)", borderRadius: "8px", overflow: "hidden" }}>

              {/* 폼 헤더 */}
              <div className="px-5 py-4"
                style={{ background: "rgba(255,255,255,0.025)", borderBottom: "1px solid var(--border)" }}>
                <h2 className="font-bold" style={{ fontSize: "1rem", color: "var(--text)" }}>기능 요청하기</h2>
                <p style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "3px" }}>
                  누구나 자유롭게 요청 가능합니다
                </p>
              </div>

              <form onSubmit={submit} className="px-5 py-5 space-y-4">

                {/* 닉네임 */}
                <div>
                  <label style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-sub)", display: "block", marginBottom: "6px" }}>
                    닉네임 <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>(선택)</span>
                  </label>
                  <input
                    type="text"
                    value={form.nickname}
                    onChange={e => setForm(f => ({ ...f, nickname: e.target.value }))}
                    placeholder="익명"
                    maxLength={20}
                    className="w-full bg-transparent"
                    style={{ fontSize: "14px", color: "var(--text)", padding: "9px 12px", border: "1px solid var(--border)", borderRadius: "6px", outline: "none" }}
                    onFocus={e => e.target.style.borderColor = "var(--blue-light)"}
                    onBlur={e => e.target.style.borderColor = "var(--border)"}
                  />
                </div>

                {/* 제목 */}
                <div>
                  <label style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-sub)", display: "block", marginBottom: "6px" }}>
                    요청 제목 <span style={{ color: "#f87171" }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                    placeholder="예: /스탯 명령어 추가"
                    required
                    maxLength={80}
                    className="w-full bg-transparent"
                    style={{ fontSize: "14px", color: "var(--text)", padding: "9px 12px", border: "1px solid var(--border)", borderRadius: "6px", outline: "none" }}
                    onFocus={e => e.target.style.borderColor = "var(--blue-light)"}
                    onBlur={e => e.target.style.borderColor = "var(--border)"}
                  />
                </div>

                {/* 설명 */}
                <div>
                  <label style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-sub)", display: "block", marginBottom: "6px" }}>
                    상세 내용 <span style={{ color: "#f87171" }}>*</span>
                  </label>
                  <textarea
                    value={form.description}
                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    placeholder="어떤 기능인지, 왜 필요한지 자세히 설명해주세요"
                    required
                    rows={5}
                    maxLength={500}
                    className="w-full bg-transparent resize-none"
                    style={{ fontSize: "14px", color: "var(--text)", padding: "9px 12px", border: "1px solid var(--border)", borderRadius: "6px", outline: "none", lineHeight: 1.65 }}
                    onFocus={e => e.target.style.borderColor = "var(--blue-light)"}
                    onBlur={e => e.target.style.borderColor = "var(--border)"}
                  />
                  <p style={{ fontSize: "11px", color: "var(--text-muted)", textAlign: "right", marginTop: "3px" }}>
                    {form.description.length} / 500
                  </p>
                </div>

                {/* 결과 메시지 */}
                {result && (
                  <div className="flex items-start gap-2 p-3"
                    style={{ borderRadius: "6px", background: result.ok ? "rgba(74,222,128,0.08)" : "rgba(239,68,68,0.08)", border: `1px solid ${result.ok ? "rgba(74,222,128,0.22)" : "rgba(239,68,68,0.22)"}` }}>
                    {result.ok
                      ? <CheckCircle2 size={14} style={{ color: "#4ade80", flexShrink: 0, marginTop: "1px" }} />
                      : <AlertCircle  size={14} style={{ color: "#f87171", flexShrink: 0, marginTop: "1px" }} />}
                    <p style={{ fontSize: "12px", color: result.ok ? "#4ade80" : "#f87171", lineHeight: 1.55 }}>
                      {result.msg}
                    </p>
                  </div>
                )}

                {/* 전송 버튼 */}
                <button
                  type="submit"
                  disabled={!canSubmit}
                  className="w-full flex items-center justify-center gap-2 font-bold text-white transition-all"
                  style={{
                    fontSize: "14px",
                    padding: "11px",
                    borderRadius: "6px",
                    background: canSubmit ? "var(--blue-light)" : "rgba(255,255,255,0.08)",
                    color: canSubmit ? "#fff" : "var(--text-muted)",
                    cursor: canSubmit ? "pointer" : "not-allowed",
                  }}>
                  {submitting
                    ? <><Clock size={14} />전송 중...</>
                    : <><Send size={14} />요청 보내기</>}
                </button>
              </form>
            </div>

            {/* 안내 박스 */}
            <div className="mt-3 p-4"
              style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--border)", borderRadius: "8px" }}>
              <p style={{ fontSize: "12px", color: "var(--text-muted)", lineHeight: 1.8 }}>
                • 요청 검토 후 우선순위가 결정됩니다<br />
                • 비슷한 요청은 하나로 합쳐질 수 있습니다<br />
                • 모든 요청이 반영되지 않을 수 있습니다
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
