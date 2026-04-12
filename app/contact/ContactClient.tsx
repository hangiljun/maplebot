"use client"
import { useState, useCallback, useMemo } from "react"
import { Send, AlertCircle, CheckCircle2, Clock, RefreshCw, Megaphone, ArrowUpDown, Trash2, Lock, Shield, MessageSquare } from "lucide-react"
import { Request, Priority, PRIORITY_META, STATUS_META } from "./types"
import { DetailModal } from "./DetailModal"
import { AdminLoginModal } from "./AdminLoginModal"

export default function ContactClient({ initialRequests }: { initialRequests: Request[] }) {
  const [requests, setRequests]     = useState<Request[]>(initialRequests)
  const [loading, setLoading]       = useState(false)
  const [sortBy, setSortBy]         = useState<"date" | "priority">("date")
  const [form, setForm]             = useState({ nickname: "", title: "", description: "" })
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult]         = useState<{ ok: boolean; msg: string } | null>(null)
  const [selected, setSelected]     = useState<Request | null>(null)
  const [showAdminLogin, setShowAdminLogin] = useState(false)
  const [isAdmin, setIsAdmin]       = useState(() => typeof window !== "undefined" && sessionStorage.getItem("isAdmin") === "true")
  const [adminPassword, setAdminPassword]   = useState(() => typeof window !== "undefined" ? sessionStorage.getItem("adminPassword") ?? "" : "")

  const fetchRequests = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/feature-request", { cache: "no-store" })
      setRequests(await res.json())
    } catch {
      setRequests([])
    } finally {
      setLoading(false)
    }
  }, [])

  const sorted = useMemo(() => {
    const order: Record<Priority, number> = { high: 0, medium: 1, low: 2 }
    return [...requests].sort((a, b) =>
      sortBy === "priority"
        ? order[a.priority] - order[b.priority]
        : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  }, [requests, sortBy])

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
        // 서버에서 반환한 새 아이템을 즉시 목록 맨 위에 추가
        if (data.item) {
          setRequests(prev => [data.item, ...prev])
        } else {
          setTimeout(fetchRequests, 2000)
        }
      } else {
        setResult({ ok: false, msg: data.error || "요청 전송에 실패했습니다." })
      }
    } catch {
      setResult({ ok: false, msg: "네트워크 오류가 발생했습니다." })
    } finally {
      setSubmitting(false)
    }
  }

  const handleAdminLogin = async (pw: string) => {
    const res = await fetch("/api/feature-request", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: "__check__", adminPassword: pw }),
    })
    if (res.status === 400) {
      setIsAdmin(true)
      setAdminPassword(pw)
      sessionStorage.setItem("isAdmin", "true")
      sessionStorage.setItem("adminPassword", pw)
      setShowAdminLogin(false)
    }
  }

  const handleAdminLogout = () => {
    setIsAdmin(false)
    setAdminPassword("")
    sessionStorage.removeItem("isAdmin")
    sessionStorage.removeItem("adminPassword")
  }

  const handleComment = async (id: string, adminComment: string | null) => {
    const pw = sessionStorage.getItem("adminPassword") ?? adminPassword
    const res = await fetch("/api/feature-request", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, adminPassword: pw, adminComment }),
    })
    if (res.ok) {
      setRequests(rs => rs.map(r => r.id === id ? { ...r, adminComment } : r))
      if (selected?.id === id) setSelected(prev => prev ? { ...prev, adminComment } : null)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("정말 삭제하시겠습니까?")) return
    await fetch("/api/feature-request", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, adminPassword }),
    })
    setRequests(prev => prev.filter(r => r.id !== id))
  }

  const handleUpdate = async (id: string, field: "priority" | "status", value: string) => {
    const pw = sessionStorage.getItem("adminPassword") ?? adminPassword
    const prev = requests.find(r => r.id === id)
    setRequests(rs => rs.map(r => r.id === id ? { ...r, [field]: value } : r))
    const res = await fetch("/api/feature-request", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, adminPassword: pw, [field]: value }),
    })
    if (!res.ok && prev) {
      setRequests(rs => rs.map(r => r.id === id ? { ...r, [field]: prev[field] } : r))
    }
  }

  const canSubmit = !submitting && form.title.trim().length > 0 && form.description.trim().length > 0

  const stats = useMemo(() => ({
    total:      requests.length,
    inProgress: requests.filter(r => r.status === "in-progress").length,
    done:       requests.filter(r => r.status === "done").length,
    high:       requests.filter(r => r.priority === "high").length,
  }), [requests])

  return (
    <div style={{ paddingTop: "56px", minHeight: "100vh" }}>
      {selected && <DetailModal r={selected} onClose={() => setSelected(null)} isAdmin={isAdmin} onDelete={handleDelete} onComment={handleComment} />}
      {showAdminLogin && <AdminLoginModal onClose={() => setShowAdminLogin(false)} onLogin={handleAdminLogin} />}

      <div className="section-container py-12">

        {/* Hero */}
        <div className="mb-10 flex items-start justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 mb-4"
              style={{ fontSize: "12px", fontWeight: 600, padding: "4px 12px", borderRadius: "4px", background: "rgba(59,130,246,0.1)", color: "var(--blue-light)", border: "1px solid rgba(59,130,246,0.2)" }}>
              <Megaphone size={12} /> 기능 요청 게시판
            </div>
            <h1 className="font-black mb-3" style={{ fontSize: "2.2rem", color: "var(--text)", letterSpacing: "-0.025em", lineHeight: 1.2 }}>개발자 문의</h1>
            <p style={{ fontSize: "1.05rem", color: "var(--text-muted)", lineHeight: 1.78, maxWidth: "540px" }}>
              메이플봇에 추가되었으면 하는 기능을 자유롭게 요청해주세요.
              접수된 요청은 검토 후 우선순위를 결정하여 개발에 반영합니다.
            </p>
          </div>
          <button
            onClick={() => isAdmin ? handleAdminLogout() : setShowAdminLogin(true)}
            className="flex items-center gap-1.5 shrink-0 mt-1"
            style={{ fontSize: "12px", fontWeight: 600, padding: "6px 12px", borderRadius: "5px", border: `1px solid ${isAdmin ? "rgba(74,222,128,0.3)" : "var(--border)"}`, background: isAdmin ? "rgba(74,222,128,0.08)" : "rgba(255,255,255,0.02)", color: isAdmin ? "#4ade80" : "var(--text-muted)" }}>
            {isAdmin ? <><Shield size={12} />관리자 모드</> : <><Lock size={12} />관리자</>}
          </button>
        </div>

        {/* 통계 */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { label: "전체 요청",    val: stats.total      },
            { label: "진행중",       val: stats.inProgress },
            { label: "완료",         val: stats.done       },
            { label: "높음 우선순위", val: stats.high       },
          ].map(s => (
            <div key={s.label} className="px-4 py-3 text-center"
              style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--border)", borderRadius: "8px" }}>
              <p className="font-black" style={{ fontSize: "1.5rem", color: "var(--text)", lineHeight: 1 }}>{s.val}</p>
              <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* 범례 */}
        <div className="flex flex-wrap gap-x-6 gap-y-2 mb-8 px-1">
          <div className="flex items-center gap-3">
            <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.07em" }}>우선순위</span>
            {(Object.entries(PRIORITY_META) as [Priority, typeof PRIORITY_META[Priority]][]).map(([k, v]) => (
              <span key={k} style={{ fontSize: "11px", fontWeight: 700, padding: "2px 8px", borderRadius: "3px", background: v.bg, color: v.color, border: `1px solid ${v.border}` }}>{v.text}</span>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.07em" }}>상태</span>
            {(Object.entries(STATUS_META) as [string, typeof STATUS_META[keyof typeof STATUS_META]][]).map(([k, v]) => (
              <span key={k} style={{ fontSize: "11px", fontWeight: 700, padding: "2px 8px", borderRadius: "3px", background: v.bg, color: v.color, border: `1px solid ${v.border}` }}>{v.text}</span>
            ))}
          </div>
        </div>

        {/* 2컬럼 */}
        <div className="flex flex-col md:flex-row gap-8 items-start">

          {/* 목록 */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold" style={{ fontSize: "1.05rem", color: "var(--text)" }}>
                요청 목록 <span style={{ fontSize: "0.9rem", fontWeight: 400, color: "var(--text-muted)" }}>({requests.length}건)</span>
              </h2>
              <div className="flex items-center gap-2">
                <button onClick={() => setSortBy(s => s === "date" ? "priority" : "date")}
                  className="flex items-center gap-1.5"
                  style={{ fontSize: "12px", color: "var(--text-muted)", padding: "8px 10px", borderRadius: "4px", border: "1px solid var(--border)", background: "rgba(255,255,255,0.02)" }}>
                  <ArrowUpDown size={11} />{sortBy === "date" ? "최신순" : "우선순위순"}
                </button>
                <button onClick={fetchRequests} disabled={loading}
                  className="flex items-center gap-1.5"
                  style={{ fontSize: "12px", color: "var(--text-muted)", padding: "8px 10px", borderRadius: "4px", border: "1px solid var(--border)", background: "rgba(255,255,255,0.02)" }}>
                  <RefreshCw size={11} className={loading ? "animate-spin" : ""} />새로고침
                </button>
              </div>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[1,2,3,4].map(i => <div key={i} className="animate-pulse" style={{ height: "100px", background: "rgba(255,255,255,0.03)", borderRadius: "8px" }} />)}
              </div>
            ) : sorted.length === 0 ? (
              <div className="py-20 text-center" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--border)", borderRadius: "8px" }}>
                <p style={{ fontSize: "1rem", color: "var(--text-muted)" }}>아직 등록된 요청이 없습니다.</p>
                <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", marginTop: "4px" }}>첫 번째 기능을 요청해보세요!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {sorted.map(r => {
                  const p = PRIORITY_META[r.priority]
                  const s = STATUS_META[r.status]
                  return (
                    <div key={r.id} onClick={() => setSelected(r)} className="p-5 cursor-pointer"
                      style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--border)", borderRadius: "8px", borderLeft: `3px solid ${p.color}`, opacity: r.status === "done" ? 0.65 : 1 }}
                      onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.04)")}
                      onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")}>
                      <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                        <p className="font-semibold flex-1" style={{ fontSize: "1rem", color: "var(--text)", lineHeight: 1.4 }}>{r.title}</p>
                        <div className="flex items-center gap-1.5 shrink-0">
                          {isAdmin ? (
                            <>
                              <select
                                value={r.priority}
                                onClick={e => e.stopPropagation()}
                                onChange={e => { e.stopPropagation(); handleUpdate(r.id, "priority", e.target.value) }}
                                style={{ fontSize: "11px", fontWeight: 700, padding: "2px 6px", borderRadius: "3px", background: p.bg, color: p.color, border: `1px solid ${p.border}`, cursor: "pointer", outline: "none" }}>
                                <option value="high">높음</option>
                                <option value="medium">보통</option>
                                <option value="low">낮음</option>
                              </select>
                              <select
                                value={r.status}
                                onClick={e => e.stopPropagation()}
                                onChange={e => { e.stopPropagation(); handleUpdate(r.id, "status", e.target.value) }}
                                style={{ fontSize: "11px", fontWeight: 700, padding: "2px 6px", borderRadius: "3px", background: s.bg, color: s.color, border: `1px solid ${s.border}`, cursor: "pointer", outline: "none" }}>
                                <option value="reviewing">검토중</option>
                                <option value="planned">예정</option>
                                <option value="in-progress">진행중</option>
                                <option value="done">완료</option>
                              </select>
                              <button onClick={e => { e.stopPropagation(); handleDelete(r.id) }}
                                style={{ padding: "3px 6px", borderRadius: "4px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", color: "#f87171" }}>
                                <Trash2 size={11} />
                              </button>
                            </>
                          ) : (
                            <>
                              <span style={{ fontSize: "11px", fontWeight: 700, padding: "2px 8px", borderRadius: "3px", background: p.bg, color: p.color, border: `1px solid ${p.border}` }}>{p.text}</span>
                              <span style={{ fontSize: "11px", fontWeight: 700, padding: "2px 8px", borderRadius: "3px", background: s.bg, color: s.color, border: `1px solid ${s.border}` }}>{s.text}</span>
                            </>
                          )}
                        </div>
                      </div>
                      {r.description && (
                        <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", lineHeight: 1.65, marginBottom: "10px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                          {r.description}
                        </p>
                      )}
                      <div className="flex items-center gap-3 flex-wrap">
                        <p style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                          {r.nickname} · {new Date(r.createdAt).toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" })}
                          <span style={{ marginLeft: "8px", opacity: 0.5 }}>클릭하여 전체 보기</span>
                        </p>
                        {r.adminComment && (
                          <span className="flex items-center gap-1" style={{ fontSize: "11px", fontWeight: 600, color: "#f5832e", padding: "1px 7px", borderRadius: "3px", background: "rgba(245,131,46,0.1)", border: "1px solid rgba(245,131,46,0.25)" }}>
                            <MessageSquare size={10} />개발자 답변
                          </span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* 신청 폼 */}
          <div className="w-full md:w-72 shrink-0" style={{ position: "sticky", top: "72px" }}>
            <div style={{ border: "1px solid var(--border)", borderRadius: "8px", overflow: "hidden" }}>
              <div className="px-5 py-4" style={{ background: "rgba(255,255,255,0.025)", borderBottom: "1px solid var(--border)" }}>
                <h2 className="font-bold" style={{ fontSize: "1rem", color: "var(--text)" }}>기능 요청하기</h2>
                <p style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "3px" }}>누구나 자유롭게 요청 가능합니다</p>
              </div>

              <form onSubmit={submit} className="px-5 py-5 space-y-4">
                {[
                  { key: "nickname", label: "닉네임", placeholder: "익명", required: false, max: 20, type: "text" },
                  { key: "title",    label: "요청 제목", placeholder: "예: /스탯 명령어 추가", required: true, max: 80, type: "text" },
                ].map(f => (
                  <div key={f.key}>
                    <label style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-sub)", display: "block", marginBottom: "6px" }}>
                      {f.label} {f.required ? <span style={{ color: "#f87171" }}>*</span> : <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>(선택)</span>}
                    </label>
                    <input type={f.type} value={form[f.key as keyof typeof form]}
                      onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                      placeholder={f.placeholder} required={f.required} maxLength={f.max}
                      className="w-full bg-transparent"
                      style={{ fontSize: "16px", color: "var(--text)", padding: "9px 12px", border: "1px solid var(--border)", borderRadius: "6px", outline: "none" }}
                      onFocus={e => e.target.style.borderColor = "var(--blue-light)"}
                      onBlur={e => e.target.style.borderColor = "var(--border)"} />
                  </div>
                ))}

                <div>
                  <label style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-sub)", display: "block", marginBottom: "6px" }}>
                    상세 내용 <span style={{ color: "#f87171" }}>*</span>
                  </label>
                  <textarea value={form.description}
                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    placeholder="어떤 기능인지, 왜 필요한지 자세히 설명해주세요"
                    required rows={5} maxLength={500}
                    className="w-full bg-transparent resize-none"
                    style={{ fontSize: "16px", color: "var(--text)", padding: "9px 12px", border: "1px solid var(--border)", borderRadius: "6px", outline: "none", lineHeight: 1.65 }}
                    onFocus={e => e.target.style.borderColor = "var(--blue-light)"}
                    onBlur={e => e.target.style.borderColor = "var(--border)"} />
                  <p style={{ fontSize: "11px", color: "var(--text-muted)", textAlign: "right", marginTop: "3px" }}>{form.description.length} / 500</p>
                </div>

                {result && (
                  <div className="flex items-start gap-2 p-3"
                    style={{ borderRadius: "6px", background: result.ok ? "rgba(74,222,128,0.08)" : "rgba(239,68,68,0.08)", border: `1px solid ${result.ok ? "rgba(74,222,128,0.22)" : "rgba(239,68,68,0.22)"}` }}>
                    {result.ok
                      ? <CheckCircle2 size={14} style={{ color: "#4ade80", flexShrink: 0, marginTop: "1px" }} />
                      : <AlertCircle  size={14} style={{ color: "#f87171", flexShrink: 0, marginTop: "1px" }} />}
                    <p style={{ fontSize: "12px", color: result.ok ? "#4ade80" : "#f87171", lineHeight: 1.55 }}>{result.msg}</p>
                  </div>
                )}

                <button type="submit" disabled={!canSubmit}
                  className="w-full flex items-center justify-center gap-2 font-bold"
                  style={{ fontSize: "14px", padding: "11px", borderRadius: "6px", background: canSubmit ? "var(--blue-light)" : "rgba(255,255,255,0.08)", color: canSubmit ? "#fff" : "var(--text-muted)", cursor: canSubmit ? "pointer" : "not-allowed" }}>
                  {submitting ? <><Clock size={14} />전송 중...</> : <><Send size={14} />요청 보내기</>}
                </button>
              </form>
            </div>

            <div className="mt-3 p-4" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--border)", borderRadius: "8px" }}>
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
