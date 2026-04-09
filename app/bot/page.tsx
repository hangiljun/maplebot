import Link from "next/link"

export default function BotPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <div className="text-6xl mb-5">🤖</div>
      <h1 className="text-2xl font-black text-white mb-3">메이플봇 디스코드</h1>
      <p className="text-sm mb-8" style={{ color: "var(--text-sub)" }}>
        디스코드 서버에 봇을 추가하고 <strong className="text-white">/정보</strong> 명령어로<br />
        메이플스토리 캐릭터를 바로 조회하세요.
      </p>

      <div className="rounded-2xl p-6 mb-6 text-left space-y-3"
        style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <h2 className="text-sm font-bold text-white mb-4">사용 가능한 명령어</h2>
        {[
          { cmd: "/정보 [캐릭터명]", desc: "캐릭터 기본 정보 조회" },
        ].map(({ cmd, desc }) => (
          <div key={cmd} className="flex items-center gap-3">
            <code className="text-xs px-2 py-1 rounded font-mono"
              style={{ background: "var(--bg-surface)", color: "#5cb85c" }}>
              {cmd}
            </code>
            <span className="text-sm" style={{ color: "var(--text-sub)" }}>{desc}</span>
          </div>
        ))}
      </div>

      <div className="flex gap-3 justify-center">
        <Link href="https://discord.com/oauth2/authorize"
          className="px-6 py-3 rounded-xl font-bold text-sm text-white transition-all hover:brightness-110"
          style={{ background: "#5865F2" }}>
          디스코드에 추가하기
        </Link>
        <Link href="/"
          className="px-6 py-3 rounded-xl font-bold text-sm transition-all hover:brightness-110"
          style={{ background: "var(--bg-surface)", color: "var(--text-1)", border: "1px solid var(--border)" }}>
          홈으로
        </Link>
      </div>
    </div>
  )
}
