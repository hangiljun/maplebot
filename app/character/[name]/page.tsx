import type { Metadata } from "next"
import Link from "next/link"
import { Search } from "lucide-react"
import { fetchCharacter, COMBAT_POWER_STAT } from "@/lib/maple"
import CharacterImage from "./CharacterImage"
import CharacterTabs from "./CharacterTabs"
import HistoryCharts from "./HistoryCharts"

interface Props { params: Promise<{ name: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { name } = await params
  const decoded = decodeURIComponent(name)
  return { title: `${decoded} 캐릭터 조회`, description: `${decoded}의 레벨, 직업, 장비, 유니온 정보` }
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
      <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center"
        style={{ paddingTop: "56px" }}>
        <div className="text-5xl mb-4">🔍</div>
        <h2 className="text-xl font-bold text-white mb-2">캐릭터를 찾을 수 없어요</h2>
        <p className="text-sm mb-8" style={{ color: "var(--text-sub)" }}>
          &apos;{decoded}&apos; 캐릭터가 존재하지 않거나 API 조회에 실패했습니다.
        </p>
        <Link href="/" className="btn-primary inline-flex items-center gap-2 px-6 py-3 text-sm">
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
    { label: "유니온", value: data.union ? `${data.union.union_grade} Lv.${data.union.union_level.toLocaleString()}` : "없음" },
    { label: "인기도", value: data.popularity.toLocaleString() },
    { label: "전투력", value: formatPower(combatPower), gold: true },
  ]

  return (
    <div className="max-w-3xl mx-auto px-4 pb-16 space-y-4" style={{ paddingTop: "80px" }}>

      {/* 캐릭터 카드 */}
      <div className="glass rounded-3xl overflow-hidden">
        <div className="flex flex-col sm:flex-row">

          {/* 이미지 */}
          <div className="flex items-end justify-center sm:justify-start pt-8 pb-4 px-6 sm:w-44 shrink-0"
            style={{ background: "linear-gradient(160deg, rgba(37,99,235,0.15) 0%, transparent 100%)" }}>
            <CharacterImage src={basic.character_image} name={basic.character_name} size="xl" />
          </div>

          {/* 정보 */}
          <div className="flex-1 p-6">
            <div className="flex items-start justify-between mb-5">
              <div>
                <h1 className="text-2xl font-bold text-white leading-tight"
                  style={{ fontFamily: "GmarketSans, sans-serif" }}>
                  {basic.character_name}
                </h1>
                <p className="text-sm mt-0.5" style={{ color: "var(--text-sub)" }}>{basic.character_class}</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-black leading-none"
                  style={{ fontFamily: "GmarketSans, sans-serif", color: "var(--blue-light)" }}>
                  {basic.character_level}
                </p>
                <p className="text-[10px] font-bold uppercase tracking-widest mt-0.5" style={{ color: "var(--text-muted)" }}>
                  Level
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {infoItems.map(({ label, value, gold }) => (
                <div key={label} className="glass rounded-xl px-3 py-2.5">
                  <p className="text-[10px] font-semibold uppercase tracking-wider mb-0.5" style={{ color: "var(--text-muted)" }}>
                    {label}
                  </p>
                  <p className="text-sm font-bold truncate"
                    style={{ color: gold ? "var(--blue-light)" : "var(--text)" }}>
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 히스토리 */}
      <HistoryCharts name={decoded} />

      {/* 탭 */}
      <CharacterTabs data={data} />

      {/* 다시 검색 */}
      <div className="flex justify-center pt-2">
        <Link href="/" className="flex items-center gap-2 text-sm transition-all hover:text-white"
          style={{ color: "var(--text-muted)" }}>
          <Search size={13} /> 다른 캐릭터 검색
        </Link>
      </div>
    </div>
  )
}
