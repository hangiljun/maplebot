import { UPDATES, ROADMAP, TAG_STYLE, TYPE_STYLE } from "./data"

export default function UpdatesPage() {
  return (
    <div className="section-container pb-20" style={{ paddingTop: "80px" }}>

      <div className="text-center mb-16">
        <h1 className="text-3xl font-black mb-3" style={{ color: "var(--text)" }}>업데이트 내용</h1>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          메이플봇의 기능 추가 및 기술적 개선 이력을 확인하세요
        </p>
      </div>

      {/* 타임라인 */}
      <div className="max-w-2xl mx-auto mb-16">
        <div className="relative">
          <div className="absolute left-[15px] top-2 bottom-2 w-px"
            style={{ background: "var(--border)" }} />

          <div className="space-y-8">
            {UPDATES.map((u) => {
              const tagColor = TAG_STYLE[u.tag] ?? "#60a5fa"
              return (
                <div key={u.version} className="flex gap-6">
                  <div className="relative z-10 shrink-0 mt-1">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ background: "var(--bg)", border: `2px solid ${tagColor}`, boxShadow: `0 0 10px ${tagColor}40` }}>
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: tagColor }} />
                    </div>
                  </div>

                  <div className="flex-1 glass rounded-2xl p-5 mb-2" style={{ border: "1px solid var(--border)" }}>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="font-black text-base" style={{ color: "var(--text)" }}>{u.version}</span>
                      <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold"
                        style={{ background: `${tagColor}18`, color: tagColor, border: `1px solid ${tagColor}30` }}>
                        {u.tag}
                      </span>
                      <span className="ml-auto text-xs tabular-nums" style={{ color: "var(--text-muted)" }}>{u.date}</span>
                    </div>

                    <ul className="space-y-2.5">
                      {u.items.map((item, i) => {
                        const ts = TYPE_STYLE[item.type] ?? TYPE_STYLE["기능"]
                        return (
                          <li key={i} className="flex items-start gap-2.5">
                            <span className="text-[10px] px-1.5 py-0.5 rounded font-bold shrink-0 mt-0.5"
                              style={{ background: ts.bg, color: ts.color }}>
                              {item.type}
                            </span>
                            <span className="text-sm leading-relaxed" style={{ color: "var(--text-sub)" }}>
                              {item.text}
                            </span>
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* 로드맵 */}
      <div className="max-w-2xl mx-auto glass rounded-2xl p-6" style={{ border: "1px solid var(--border)" }}>
        <div className="flex items-center gap-2 mb-6">
          <h2 className="text-base font-bold" style={{ color: "var(--text)" }}>개발 로드맵</h2>
          <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
            style={{ background: "rgba(59,130,246,0.1)", color: "var(--blue-light)", border: "1px solid rgba(59,130,246,0.2)" }}>
            예정
          </span>
        </div>

        <div className="space-y-1">
          {ROADMAP.map((r, i) => (
            <div key={r.label} className="flex items-center gap-4 py-3"
              style={{ borderBottom: i < ROADMAP.length - 1 ? "1px solid var(--border)" : "none" }}>
              <div className="flex-1">
                <p className="text-sm font-semibold mb-0.5" style={{ color: "var(--text)" }}>{r.label}</p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>{r.desc}</p>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full shrink-0"
                style={{ background: "var(--bg-surface)", color: "var(--text-muted)", border: "1px solid var(--border)" }}>
                {r.status}
              </span>
            </div>
          ))}
        </div>

        <p className="text-xs mt-4" style={{ color: "var(--text-muted)" }}>
          로드맵은 개발 진행 상황에 따라 변경될 수 있습니다.
          Nexon OpenAPI 정식 서비스 승인 이후 순차적으로 제공될 예정입니다.
        </p>
      </div>
    </div>
  )
}
