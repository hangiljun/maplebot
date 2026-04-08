import { HyperStatItem } from "@/lib/maple"

export default function HyperStatTab({ hyperStats }: { hyperStats: HyperStatItem[] }) {
  if (!hyperStats.length) {
    return (
      <div className="text-center py-12 text-gray-400">
        <div className="text-4xl mb-3">⚡</div>
        <p className="text-sm">하이퍼스탯 정보를 불러올 수 없어요</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {hyperStats.map((stat, i) => (
        <div key={i} className="bg-white border border-gray-100 rounded-xl px-4 py-3">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[13px] font-bold text-[#191F28]">{stat.stat_type}</p>
            <span className="text-[11px] font-bold bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
              Lv.{stat.stat_level}
            </span>
          </div>
          {stat.stat_increase && (
            <p className="text-[12px] text-gray-500">{stat.stat_increase}</p>
          )}
          {stat.stat_point != null && stat.stat_point > 0 && (
            <p className="text-[11px] text-gray-400 mt-0.5">소모 포인트: {stat.stat_point.toLocaleString()}</p>
          )}
        </div>
      ))}
    </div>
  )
}
