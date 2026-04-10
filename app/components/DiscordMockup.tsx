export type CmdKey = "/정보" | "/유니온" | "/부캐조회"

const CMD_DATA: Record<CmdKey, {
  color: string
  title: string
  subtitle?: string
  fields: { k: string; v: string }[]
  buttons?: string[]
  upcoming?: boolean
}> = {
  "/정보": {
    color: "#5865f2",
    title: "메이플봇",
    subtitle: "Lv.285 · 아크메이지(불,독) · 크로아",
    fields: [
      { k: "전투력", v: "12억 4,320만" },
      { k: "유니온", v: "그마3 Lv.9,020" },
      { k: "인기도", v: "32,104" },
      { k: "길드",   v: "Heroic" },
    ],
    buttons: ["장비", "레벨변동", "헥사", "코디"],
  },
  "/유니온": {
    color: "#a855f7",
    title: "유니온 정보 · 메이플봇",
    fields: [
      { k: "등급",       v: "그랜드 마스터 3" },
      { k: "유니온 레벨", v: "9,020" },
      { k: "아티팩트",   v: "Lv.41" },
      { k: "포인트",     v: "4,250" },
    ],
  },
  "/부캐조회": {
    color: "#6b7280",
    title: "준비 중",
    fields: [],
    upcoming: true,
  },
}

export function DiscordMockup({ cmd }: { cmd: CmdKey }) {
  const c = CMD_DATA[cmd]
  const isInfo = cmd === "/정보"

  return (
    <div style={{ background: "#1e2124", borderRadius: "14px", padding: "14px", width: "310px", border: "1px solid rgba(255,255,255,0.06)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "6px", paddingBottom: "10px", marginBottom: "10px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <span style={{ color: "#80848e", fontSize: "18px" }}>#</span>
        <span style={{ color: "#f2f3f5", fontWeight: 700, fontSize: "13px" }}>메이플-조회</span>
      </div>

      <p style={{ color: "#00aff4", fontSize: "13px", marginBottom: "10px" }}>{cmd} 메이플봇</p>

      <div style={{ display: "flex", gap: "10px" }}>
        <div style={{ width: "34px", height: "34px", borderRadius: "50%", background: "linear-gradient(135deg, #5865f2, #7289da)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: "12px" }}>M</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "5px", marginBottom: "4px" }}>
            <span style={{ color: "#5865f2", fontWeight: 700, fontSize: "13px" }}>메이플봇</span>
            <span style={{ background: "#5865f2", color: "#fff", fontSize: "8px", padding: "1px 4px", borderRadius: "3px", fontWeight: 700 }}>BOT</span>
          </div>
          <div style={{ borderLeft: `4px solid ${c.color}`, background: "#2b2d31", borderRadius: "4px", padding: "10px 12px" }}>
            {c.upcoming ? (
              <div style={{ textAlign: "center", padding: "12px 0" }}>
                <p style={{ color: "#6b7280", fontSize: "13px", fontWeight: 700, marginBottom: "4px" }}>🔧 업데이트 예정입니다</p>
                <p style={{ color: "#4b5563", fontSize: "11px", margin: 0 }}>조만간 지원될 예정이에요</p>
              </div>
            ) : (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                  <div>
                    <p style={{ color: "#fff", fontWeight: 700, fontSize: "13px", margin: "0 0 2px 0" }}>{c.title}</p>
                    {c.subtitle && <p style={{ color: "#949ba4", fontSize: "10px", margin: 0 }}>{c.subtitle}</p>}
                  </div>
                  {isInfo && (
                    <div style={{ width: "44px", height: "44px", borderRadius: "8px", background: "linear-gradient(135deg, rgba(88,101,242,0.2), rgba(114,137,218,0.1))", border: "1px solid rgba(88,101,242,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", flexShrink: 0 }}>
                      🧙
                    </div>
                  )}
                </div>
                {c.fields.length > 0 && (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px", marginBottom: c.buttons?.length ? "10px" : 0 }}>
                    {c.fields.map(({ k, v }) => (
                      <div key={k}>
                        <p style={{ color: "#949ba4", fontSize: "9px", fontWeight: 700, textTransform: "uppercase", margin: "0 0 1px 0" }}>{k}</p>
                        <p style={{ color: "#dbdee1", fontSize: "11px", fontWeight: 600, margin: 0 }}>{v}</p>
                      </div>
                    ))}
                  </div>
                )}
                {c.buttons && c.buttons.length > 0 && (
                  <div style={{ display: "flex", gap: "5px", flexWrap: "wrap", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "8px" }}>
                    {c.buttons.map(btn => (
                      <div key={btn}
                        style={{
                          background: "rgba(88,101,242,0.18)",
                          color: "#c9cdfb",
                          fontSize: "11px",
                          fontWeight: 700,
                          padding: "5px 11px",
                          borderRadius: "4px",
                          cursor: "pointer",
                          border: "1px solid rgba(88,101,242,0.4)",
                          transition: "all 0.15s",
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.background = "rgba(88,101,242,0.38)"
                          e.currentTarget.style.borderColor = "rgba(88,101,242,0.7)"
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.background = "rgba(88,101,242,0.18)"
                          e.currentTarget.style.borderColor = "rgba(88,101,242,0.4)"
                        }}
                      >{btn}</div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
