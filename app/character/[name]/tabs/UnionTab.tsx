import { UnionInfo, CharacterBasic } from "@/lib/maple"
import Image from "next/image"

function getGradeBadge(grade: string): string {
  if (grade.includes("그랜드 마스터")) {
    if (grade.includes("3")) return "SSS"
    if (grade.includes("2")) return "SS"
    return "S"
  }
  if (grade.includes("마스터")) {
    if (grade.includes("3")) return "A+"
    if (grade.includes("2")) return "A"
    return "A-"
  }
  if (grade.includes("다이아몬드")) return "B+"
  if (grade.includes("플래티넘"))  return "B"
  if (grade.includes("골드"))      return "C+"
  if (grade.includes("실버"))      return "C"
  if (grade.includes("브론즈"))    return "D"
  return "?"
}

function getBadgeStyle(badge: string): string {
  if (badge === "SSS") return "bg-orange-500 text-white shadow-orange-400/60"
  if (badge === "SS")  return "bg-amber-400 text-white shadow-amber-400/60"
  if (badge === "S")   return "bg-yellow-300 text-yellow-900 shadow-yellow-300/60"
  if (badge.startsWith("A")) return "bg-purple-500 text-white shadow-purple-400/60"
  if (badge.startsWith("B")) return "bg-blue-500 text-white shadow-blue-400/60"
  return "bg-gray-400 text-white shadow-gray-400/60"
}

export default function UnionTab({ union, basic }: { union: UnionInfo | null; basic: CharacterBasic }) {
  if (!union) {
    return (
      <div className="text-center py-12 text-gray-400">
        <div className="text-4xl mb-3">🏰</div>
        <p className="text-sm">유니온 정보를 불러올 수 없어요</p>
      </div>
    )
  }

  const badge = getGradeBadge(union.union_grade)
  const badgeStyle = getBadgeStyle(badge)

  return (
    <div className="space-y-4">

      {/* 유니온 챔피언 카드 */}
      <div className="relative overflow-hidden rounded-2xl"
        style={{ background: "linear-gradient(160deg, #1a0a2e 0%, #2d1060 40%, #1a0a2e 100%)" }}>

        {/* 불꽃 배경 효과 */}
        <div className="absolute inset-0 flex items-end justify-center pointer-events-none">
          <div className="w-64 h-40 rounded-full opacity-40"
            style={{ background: "radial-gradient(ellipse, #f97316 0%, #dc2626 40%, transparent 70%)", filter: "blur(20px)" }} />
        </div>

        {/* 상단 배지 */}
        <div className="relative flex justify-between items-start px-5 pt-5 pb-2">
          <span className={`text-sm font-black px-3 py-1 rounded-lg shadow-lg ${badgeStyle}`}>
            {badge}
          </span>
          <span className="text-xs text-white/50 font-medium">{union.union_grade}</span>
        </div>

        {/* 캐릭터 이미지 */}
        <div className="relative flex justify-center py-2">
          {basic.character_image ? (
            <Image
              src={basic.character_image}
              alt={basic.character_name}
              width={120}
              height={120}
              className="object-contain drop-shadow-2xl"
              unoptimized
            />
          ) : (
            <div className="w-28 h-28 flex items-center justify-center text-5xl">🧙</div>
          )}
        </div>

        {/* 이름 + 레벨 */}
        <div className="relative text-center pb-5">
          <p className="text-white font-bold text-base">{basic.character_name}</p>
          <p className="text-white/60 text-xs mt-0.5">{basic.character_class} Lv.{basic.character_level}</p>
        </div>
      </div>

      {/* 유니온 수치 */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white border border-gray-100 rounded-2xl px-4 py-4 text-center">
          <p className="text-xs text-gray-400 mb-1">유니온 레벨</p>
          <p className="text-2xl font-extrabold text-[#191F28]">{union.union_level.toLocaleString()}</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl px-4 py-4 text-center">
          <p className="text-xs text-gray-400 mb-1">아티팩트 레벨</p>
          <p className="text-2xl font-extrabold text-[#191F28]">{union.union_artifact_level}</p>
        </div>
      </div>

      {/* 아티팩트 상세 */}
      {union.union_artifact_level > 0 && (
        <div className="bg-white border border-gray-100 rounded-2xl p-4">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">유니온 아티팩트</h3>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-[#F5F6FA] rounded-xl py-3 text-center">
              <p className="text-xs text-gray-400 mb-1">경험치</p>
              <p className="text-base font-extrabold text-[#191F28]">{union.union_artifact_exp.toLocaleString()}</p>
            </div>
            <div className="bg-[#F5F6FA] rounded-xl py-3 text-center">
              <p className="text-xs text-gray-400 mb-1">포인트</p>
              <p className="text-base font-extrabold text-[#191F28]">{union.union_artifact_point.toLocaleString()}</p>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
