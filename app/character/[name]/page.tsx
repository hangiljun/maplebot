import type { Metadata } from "next"
import Link from "next/link"
import { ChevronLeft, Search } from "lucide-react"
import { fetchCharacter, MAIN_STATS, BATTLE_STATS, DETAIL_STATS, type StatItem } from "@/lib/maple"
import CharacterImage from "./CharacterImage"

interface Props {
  params: Promise<{ name: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { name } = await params
  const decodedName = decodeURIComponent(name)
  return {
    title: `${decodedName} 캐릭터 조회`,
    description: `메이플스토리 캐릭터 ${decodedName}의 레벨, 직업, 스탯 정보를 확인하세요.`,
  }
}

function pickStats(stats: StatItem[], keys: string[]) {
  return keys
    .map((key) => stats.find((s) => s.stat_name === key))
    .filter(Boolean) as StatItem[]
}

function StatCard({ title, items }: { title: string; items: StatItem[] }) {
  if (items.length === 0) return null
  return (
    <div className="bg-white border border-[#E5E8EB] rounded-2xl px-5 py-5">
      <h3 className="text-xs font-semibold text-[#8B95A1] mb-3 uppercase tracking-wide">{title}</h3>
      <div className="grid grid-cols-2 gap-3">
        {items.map((item) => (
          <div key={item.stat_name} className="bg-[#F9FAFB] rounded-xl px-4 py-3">
            <p className="text-xs text-[#8B95A1] mb-0.5">{item.stat_name}</p>
            <p className="text-base font-bold text-[#191F28]">{item.stat_value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default async function CharacterDetailPage({ params }: Props) {
  const { name } = await params
  const decodedName = decodeURIComponent(name)
  const data = await fetchCharacter(decodedName)

  // ── 캐릭터 없음 ──
  if (!data) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] p-4 md:p-8">
        <div className="max-w-2xl mx-auto space-y-4">
          <Link href="/character"
            className="inline-flex items-center gap-1.5 text-sm text-[#8B95A1] hover:text-[#191F28] transition-colors">
            <ChevronLeft size={16} /> 캐릭터 조회로 돌아가기
          </Link>
          <div className="bg-white border border-[#E5E8EB] rounded-2xl px-6 py-12 text-center">
            <div className="text-4xl mb-4">🔍</div>
            <h2 className="text-lg font-bold text-[#191F28]">캐릭터를 찾을 수 없어요</h2>
            <p className="text-sm text-[#8B95A1] mt-2">
              &apos;{decodedName}&apos; 캐릭터가 존재하지 않거나 API 조회에 실패했습니다.
            </p>
            <Link href="/character"
              className="inline-flex items-center gap-2 mt-6 bg-[#3182F6] hover:bg-[#1C6EE8] text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors">
              <Search size={15} /> 다시 검색하기
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const { basic, stats } = data
  const mainStats   = pickStats(stats, MAIN_STATS)
  const battleStats = pickStats(stats, BATTLE_STATS)
  const detailStats = pickStats(stats, DETAIL_STATS)

  const expRate = Math.min(Math.max(parseFloat(basic.character_exp_rate) || 0, 0), 100)
  const joinDate = basic.character_date_create
    ? new Date(basic.character_date_create).toLocaleDateString("ko-KR", {
        year: "numeric", month: "long", day: "numeric",
      })
    : null

  return (
    <div className="min-h-screen bg-[#F9FAFB] p-4 md:p-8">
      <div className="max-w-2xl mx-auto space-y-4">

        {/* 뒤로가기 */}
        <Link href="/character"
          className="inline-flex items-center gap-1.5 text-sm text-[#8B95A1] hover:text-[#191F28] transition-colors">
          <ChevronLeft size={16} /> 캐릭터 조회로 돌아가기
        </Link>

        {/* 프로필 카드 */}
        <div className="bg-white border border-[#E5E8EB] rounded-2xl px-6 py-6">
          <div className="flex items-start gap-5">
            <CharacterImage src={basic.character_image} name={basic.character_name} />
            <div className="min-w-0 flex-1">
              <h1 className="text-xl font-bold text-[#191F28] truncate">{basic.character_name}</h1>
              <p className="text-sm text-[#4E5968] mt-1">
                Lv.{basic.character_level} · {basic.character_class}
              </p>
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
                <span className="text-xs text-[#8B95A1]">🌍 {basic.world_name}</span>
                {basic.character_guild_name && (
                  <span className="text-xs text-[#8B95A1]">🛡️ {basic.character_guild_name}</span>
                )}
                {joinDate && (
                  <span className="text-xs text-[#8B95A1]">📅 {joinDate}</span>
                )}
              </div>
            </div>
          </div>

          {/* 경험치 바 */}
          <div className="mt-5">
            <div className="flex justify-between text-xs text-[#8B95A1] mb-1.5">
              <span>경험치</span>
              <span>{basic.character_exp_rate}%</span>
            </div>
            <div className="w-full bg-[#F2F4F6] rounded-full h-2">
              <div
                className="bg-[#3182F6] h-2 rounded-full transition-all"
                style={{ width: `${expRate}%` }}
              />
            </div>
          </div>
        </div>

        {/* 스탯 카드 */}
        <StatCard title="기본 능력치" items={mainStats} />
        <StatCard title="전투 능력치" items={battleStats} />
        <StatCard title="전투 상세" items={detailStats} />

        {/* 다시 검색 */}
        <div className="bg-white border border-[#E5E8EB] rounded-2xl px-5 py-4 flex items-center justify-between">
          <span className="text-sm text-[#8B95A1]">다른 캐릭터를 조회하시겠어요?</span>
          <Link href="/character"
            className="flex items-center gap-1.5 bg-[#F2F4F6] hover:bg-[#EBF3FE] hover:text-[#3182F6] text-[#4E5968] px-4 py-2 rounded-xl text-sm font-semibold transition-colors">
            <Search size={14} /> 검색하기
          </Link>
        </div>

      </div>
    </div>
  )
}
