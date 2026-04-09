import type { Metadata } from "next"
import Link from "next/link"
import { Search } from "lucide-react"
import { fetchCharacter, COMBAT_POWER_STAT } from "@/lib/maple"
import CharacterImage from "./CharacterImage"
import CharacterTabs from "./CharacterTabs"
import HistoryCharts from "./HistoryCharts"

interface Props {
  params: Promise<{ name: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { name } = await params
  const decoded = decodeURIComponent(name)
  return {
    title: `${decoded} 캐릭터 조회`,
    description: `메이플스토리 캐릭터 ${decoded}의 레벨, 직업, 장비, 유니온 정보를 확인하세요.`,
  }
}

function formatPower(value: string | number): string {
  const num = Number(value)
  if (!num) return "0"
  const eok = Math.floor(num / 100_000_000)
  const man = Math.floor((num % 100_000_000) / 10_000)
  if (eok > 0 && man > 0) return `${eok}억 ${man}만`
  if (eok > 0) return `${eok}억`
  if (man > 0) return `${man}만`
  return num.toLocaleString()
}

export default async function CharacterDetailPage({ params }: Props) {
  const { name } = await params
  const decoded = decodeURIComponent(name)
  const data = await fetchCharacter(decoded)

  if (!data) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <div className="text-6xl mb-5">🔍</div>
        <h2 className="text-xl font-bold text-white mb-2">캐릭터를 찾을 수 없어요</h2>
        <p className="text-sm mb-8" style={{ color: "var(--text-2)" }}>
          &apos;{decoded}&apos; 캐릭터가 존재하지 않거나 API 조회에 실패했습니다.
        </p>
        <Link href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white transition-all hover:brightness-110"
          style={{ background: "var(--primary)" }}>
          <Search size={14} /> 다시 검색
        </Link>
      </div>
    )
  }

  const { basic } = data
  const combatPower = data.stats.find(s => s.stat_name === COMBAT_POWER_STAT)?.stat_value ?? "0"

  const infoItems = [
    { label: "서버",   value: basic.world_name },
    { label: "직업",   value: basic.character_class },
    { label: "길드",   value: basic.character_guild_name || "없음" },
    { label: "유니온", value: data.union ? `${data.union.union_grade} (Lv.${data.union.union_level.toLocaleString()})` : "정보 없음" },
    { label: "인기도", value: data.popularity.toLocaleString() },
    { label: "전투력", value: formatPower(combatPower), highlight: true },
  ]

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-5">

      {/* 캐릭터 카드 */}
      <div className="rounded-2xl overflow-hidden" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div className="flex flex-col sm:flex-row">

          {/* 이미지 영역 */}
          <div className="flex items-end justify-center sm:justify-start pt-6 pb-4 px-6 sm:w-48 shrink-0"
            style={{ background: "linear-gradient(160deg, #1a2a1a 0%, #1e2028 100%)" }}>
            <CharacterImage src={basic.character_image} name={basic.character_name} size="xl" />
          </div>

          {/* 정보 영역 */}
          <div className="flex-1 p-6">
            {/* 이름 + 레벨 */}
            <div className="flex items-start justify-between mb-5">
              <div>
                <h1 className="text-2xl font-black text-white leading-tight">{basic.character_name}</h1>
                <p className="text-sm mt-0.5" style={{ color: "var(--text-2)" }}>{basic.character_class}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-3xl font-black leading-none" style={{ color: "var(--primary)" }}>
                  {basic.character_level}
                </p>
                <p className="text-[10px] font-bold uppercase tracking-widest mt-0.5" style={{ color: "var(--text-muted)" }}>
                  Level
                </p>
              </div>
            </div>

            {/* 정보 그리드 */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {infoItems.map(({ label, value, highlight }) => (
                <div key={label} className="rounded-xl px-3 py-2.5"
                  style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}>
                  <p className="text-[10px] font-semibold uppercase tracking-wider mb-0.5" style={{ color: "var(--text-muted)" }}>
                    {label}
                  </p>
                  <p className="text-sm font-bold truncate"
                    style={{ color: highlight ? "var(--accent)" : "var(--text-1)" }}>
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 히스토리 차트 */}
      <HistoryCharts name={decoded} />

      {/* 탭 */}
      <CharacterTabs data={data} />

      {/* 다시 검색 */}
      <div className="flex justify-center pt-2 pb-4">
        <Link href="/"
          className="flex items-center gap-2 text-sm transition-colors hover:text-white"
          style={{ color: "var(--text-2)" }}>
          <Search size={14} /> 다른 캐릭터 검색
        </Link>
      </div>
    </div>
  )
}
