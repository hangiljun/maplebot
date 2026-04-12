import { UnionInfo, CharacterBasic } from "@/lib/maple"
import Image from "next/image"

const GRADE_MAP: { match: string; badge: string; style: string }[] = [
  { match: "그랜드 마스터 3", badge: "SSS", style: "bg-orange-500 text-white shadow-orange-400/60" },
  { match: "그랜드 마스터 2", badge: "SS",  style: "bg-amber-400 text-white shadow-amber-400/60"  },
  { match: "그랜드 마스터",   badge: "S",   style: "bg-yellow-300 text-yellow-900 shadow-yellow-300/60" },
  { match: "마스터 3",        badge: "A+",  style: "bg-purple-500 text-white shadow-purple-400/60" },
  { match: "마스터 2",        badge: "A",   style: "bg-purple-500 text-white shadow-purple-400/60" },
  { match: "마스터",          badge: "A-",  style: "bg-purple-500 text-white shadow-purple-400/60" },
  { match: "다이아몬드",      badge: "B+",  style: "bg-blue-500 text-white shadow-blue-400/60"    },
  { match: "플래티넘",        badge: "B",   style: "bg-blue-500 text-white shadow-blue-400/60"    },
  { match: "골드",            badge: "C+",  style: "bg-gray-400 text-white shadow-gray-400/60"    },
  { match: "실버",            badge: "C",   style: "bg-gray-400 text-white shadow-gray-400/60"    },
  { match: "브론즈",          badge: "D",   style: "bg-gray-400 text-white shadow-gray-400/60"    },
]

function getGradeInfo(grade: string) {
  const found = GRADE_MAP.find(g => grade.includes(g.match))
  return found ?? { badge: "?", style: "bg-gray-400 text-white shadow-gray-400/60" }
}

export default function UnionTab({ union, basic }: { union: UnionInfo | null; basic: CharacterBasic }) {
  if (!union) {
    return (
      <div className="text-center py-12" style={{ color: "var(--text-muted)" }}>
        <p className="text-sm">유니온 정보를 불러올 수 없어요</p>
      </div>
    )
  }

  const { badge, style: badgeStyle } = getGradeInfo(union.union_grade)

  return (
    <div className="space-y-4">

      {/* 유니온 챔피언 카드 */}
      <div className="relative overflow-hidden rounded-2xl"
        style={{ background: "linear-gradient(160deg, rgba(37,99,235,0.2) 0%, rgba(59,130,246,0.1) 40%, rgba(37,99,235,0.05) 100%)" }}>

        {/* 불꽃 배경 효과 */}
        <div className="absolute inset-0 flex items-end justify-center pointer-events-none">
          <div className="w-64 h-40 rounded-full opacity-40"
            style={{ background: "radial-gradient(ellipse, #3b82f6 0%, #1d4ed8 40%, transparent 70%)", filter: "blur(20px)" }} />
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
        {[
          { label: "유니온 레벨", value: (union.union_level ?? 0).toLocaleString() },
          { label: "아티팩트 레벨", value: String(union.union_artifact_level) },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-2xl px-4 py-4 text-center"
            style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}>
            <p className="text-xs mb-1" style={{ color: "var(--text-sub)" }}>{label}</p>
            <p className="text-2xl font-extrabold text-white">{value}</p>
          </div>
        ))}
      </div>

      {/* 아티팩트 상세 */}
      {union.union_artifact_level > 0 && (
        <div className="rounded-2xl p-4" style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}>
          <h3 className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: "var(--text-muted)" }}>유니온 아티팩트</h3>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: "경험치", value: (union.union_artifact_exp ?? 0).toLocaleString() },
              { label: "포인트", value: (union.union_artifact_point ?? 0).toLocaleString() },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-xl py-3 text-center" style={{ background: "var(--bg-card)" }}>
                <p className="text-xs mb-1" style={{ color: "var(--text-sub)" }}>{label}</p>
                <p className="text-base font-extrabold text-white">{value}</p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  )
}
