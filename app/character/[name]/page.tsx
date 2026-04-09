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

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-amber-100 last:border-0">
      <span className="text-xs font-semibold text-amber-700/70 uppercase tracking-wide">{label}</span>
      <span className="text-sm font-bold text-gray-800 text-right max-w-[60%] truncate">{value}</span>
    </div>
  )
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
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="text-5xl mb-4">🔍</div>
        <h2 className="text-lg font-bold text-[#191F28]">캐릭터를 찾을 수 없어요</h2>
        <p className="text-sm text-gray-400 mt-2">
          &apos;{decoded}&apos; 캐릭터가 존재하지 않거나 조회에 실패했습니다.
        </p>
        <Link href="/"
          className="inline-flex items-center gap-2 mt-6 bg-[#3182F6] hover:bg-[#1C6EE8] text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors">
          <Search size={14} /> 다시 검색
        </Link>
      </div>
    )
  }

  const { basic } = data
  const combatPower = data.stats.find(s => s.stat_name === COMBAT_POWER_STAT)?.stat_value ?? "0"

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-4">

      {/* 캐릭터 카드 */}
      <div className="flex justify-center">
        <div className="w-full max-w-sm rounded-3xl overflow-hidden shadow-xl border-2 border-amber-200"
          style={{ background: "linear-gradient(160deg, #fff8ed 0%, #fff3e0 60%, #fde8c8 100%)" }}>

          {/* 캐릭터 이미지 영역 */}
          <div className="relative flex justify-center items-end pt-8 pb-4 px-6"
            style={{ background: "radial-gradient(ellipse at 50% 80%, #fde8c833 0%, transparent 70%)" }}>
            {/* 🍁 뱃지 */}
            <div className="absolute top-4 left-4 w-8 h-8 rounded-full bg-amber-400 flex items-center justify-center shadow-md">
              <span className="text-sm">🍁</span>
            </div>

            <CharacterImage src={basic.character_image} name={basic.character_name} size="xl" />
          </div>

          {/* 이름 + 레벨 */}
          <div className="flex items-end justify-between px-6 pb-3">
            <div>
              <h1 className="text-xl font-extrabold text-gray-900 leading-tight">{basic.character_name}</h1>
              <p className="text-xs text-gray-500 font-medium mt-0.5">{basic.character_class}</p>
            </div>
            <div className="text-right">
              <p className="text-4xl font-black text-red-500 leading-none">{basic.character_level}</p>
              <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest mt-0.5">Level</p>
            </div>
          </div>

          {/* 구분선 */}
          <div className="mx-6 border-t-2 border-dashed border-amber-200 mb-3" />

          {/* 정보 그리드 */}
          <div className="px-6 pb-6">
            <InfoRow label="서버"   value={basic.world_name} />
            <InfoRow label="전투력" value={formatPower(combatPower)} />
            <InfoRow label="길드"   value={basic.character_guild_name || "없음"} />
            <InfoRow label="유니온" value={data.union ? String(data.union.union_level) : "정보 없음"} />
          </div>
        </div>
      </div>

      {/* 히스토리 차트 */}
      <HistoryCharts name={decoded} />

      {/* 탭 (기본정보 / 장비 / 어빌리티 / 유니온) */}
      <CharacterTabs data={data} />

      {/* 다시 검색 */}
      <div className="flex justify-center pt-2">
        <Link href="/"
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-[#3182F6] transition-colors font-medium">
          <Search size={14} /> 다른 캐릭터 검색하기
        </Link>
      </div>
    </div>
  )
}
