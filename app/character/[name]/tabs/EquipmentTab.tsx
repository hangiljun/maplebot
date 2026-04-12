"use client"
import { useState, useMemo, useEffect, useCallback, useRef } from "react"
import { createPortal } from "react-dom"
import { X } from "lucide-react"
import { EquipmentItem } from "@/lib/maple"
import MapleItemDetail from "./MapleItemDetail"

const SLOT_LAYOUT: { slot: string; col: number; row: number }[] = [
  { slot: "반지1",       col: 1, row: 1 },
  { slot: "반지2",       col: 1, row: 2 },
  { slot: "반지3",       col: 1, row: 3 },
  { slot: "반지4",       col: 1, row: 4 },
  { slot: "뱃지",        col: 1, row: 5 },
  { slot: "모자",        col: 2, row: 1 },
  { slot: "얼굴장식",    col: 2, row: 2 },
  { slot: "눈장식",      col: 2, row: 3 },
  { slot: "귀고리",      col: 2, row: 4 },
  { slot: "엠블렘",      col: 2, row: 5 },
  { slot: "보조무기",    col: 3, row: 3 },
  { slot: "어깨장식",    col: 3, row: 4 },
  { slot: "훈장",        col: 3, row: 5 },
  { slot: "무기",        col: 4, row: 1 },
  { slot: "상의",        col: 4, row: 2 },
  { slot: "하의",        col: 4, row: 3 },
  { slot: "벨트",        col: 4, row: 4 },
  { slot: "안드로이드",  col: 4, row: 5 },
  { slot: "망토",        col: 5, row: 1 },
  { slot: "신발",        col: 5, row: 2 },
  { slot: "장갑",        col: 5, row: 3 },
  { slot: "포켓 아이템", col: 5, row: 4 },
  { slot: "기계 심장",   col: 5, row: 6 },
]

const GRADE_BORDER: Record<string, string> = {
  "레전드리": "border-[#FF8C00]",
  "유니크":   "border-[#EAB308]",
  "에픽":     "border-[#A855F7]",
  "레어":     "border-[#3B82F6]",
}

// 툴팁 너비 고정, 높이는 자연스럽게 (스크롤 없이 전체 표시)
const TIPW = 304

type TipState = { item: EquipmentItem; x: number; y: number } | null

// ── 슬롯 셀 ──────────────────────────────────────────────
// 툴팁을 직접 렌더링하지 않고, 마우스 진입/이탈만 부모에 알림
function SlotCell({ item, onClick, onEnter, onLeave }: {
  item: EquipmentItem | undefined
  onClick: (item: EquipmentItem) => void
  onEnter: (rect: DOMRect, item: EquipmentItem) => void
  onLeave: () => void
}) {
  const grade     = item?.potential_option_grade ?? null
  const sfNum     = parseInt(item?.starforce ?? "0") || 0
  const borderCls = grade ? (GRADE_BORDER[grade] ?? "border-gray-600") : "border-gray-600"

  return (
    <div
      className="relative flex items-center justify-center"
      onMouseEnter={e => item && onEnter(e.currentTarget.getBoundingClientRect(), item)}
      onMouseLeave={onLeave}>
      <div
        onClick={() => item && onClick(item)}
        className={`w-[52px] h-[52px] rounded-lg border-2 flex items-center justify-center bg-[#12122a] transition-all ${
          item ? borderCls + " hover:brightness-110 cursor-pointer" : "border-gray-700 opacity-40 cursor-default"
        }`}>
        {item ? (
          <>
            {item.item_icon
              ? <img src={item.item_icon} alt={item.item_name} className="w-10 h-10 object-contain" style={{ imageRendering: "pixelated" }} />
              : <span className="text-xl">🗡️</span>}
            {sfNum > 0 && (
              <span className="absolute -top-1.5 -right-1 bg-yellow-400 text-[#111] text-[9px] font-extrabold px-1 rounded-full leading-tight">{sfNum}</span>
            )}
          </>
        ) : (
          <span className="text-gray-600 text-xs">–</span>
        )}
      </div>
    </div>
  )
}

// ── 탭 메인 ──────────────────────────────────────────────
export default function EquipmentTab({ items }: { items: EquipmentItem[] }) {
  const [selected,  setSelected] = useState<EquipmentItem | null>(null)
  const [tip,       setTip]      = useState<TipState>(null)
  const [mounted,   setMounted]  = useState(false)
  const closeTimer               = useRef<ReturnType<typeof setTimeout> | null>(null)
  const gridRef                  = useRef<HTMLDivElement>(null)
  const itemMap = useMemo(() => new Map(items.map(it => [it.item_equipment_slot, it])), [items])

  // 포털은 클라이언트 마운트 후에만 사용 가능
  useEffect(() => { setMounted(true) }, [])

  const handleEnter = useCallback((rect: DOMRect, item: EquipmentItem) => {
    if (closeTimer.current) clearTimeout(closeTimer.current)

    const viewW = window.innerWidth
    const viewH = window.innerHeight
    const gap   = 12  // 그리드와 툴팁 사이 여백

    // ── X: 그리드 전체 기준으로 바깥에 배치 (슬롯 간 겹침 없음) ──
    const gridRect   = gridRef.current?.getBoundingClientRect()
    const rightSpace = gridRect ? viewW - gridRect.right - gap : 0
    const leftSpace  = gridRect ? gridRect.left - gap : 0
    let x: number
    if (rightSpace >= TIPW) {
      // 그리드 오른쪽 바깥
      x = (gridRect!.right + gap)
    } else if (leftSpace >= TIPW) {
      // 그리드 왼쪽 바깥
      x = gridRect!.left - TIPW - gap
    } else {
      // 여백 없으면 뷰포트 중앙 근처 (fallback)
      x = Math.max(8, Math.min(rect.right + gap, viewW - TIPW - 8))
    }

    // ── Y: 슬롯 기준, 뷰포트 아래 넘으면 위로 올림 ──
    const estH = Math.min(viewH * 0.92, 820)
    const y    = rect.top + estH > viewH - 8
      ? Math.max(8, viewH - estH - 8)
      : rect.top

    setTip({ item, x, y })
  }, [])

  // 셀에서 나갈 때: 150ms 지연 (툴팁으로 마우스 이동 시 취소됨)
  const handleLeave = useCallback(() => {
    closeTimer.current = setTimeout(() => setTip(null), 150)
  }, [])

  // 툴팁 위에 있는 동안: 타이머 취소 → 툴팁 유지
  const handleTipEnter = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
  }, [])

  // 툴팁 밖으로 나갈 때: 즉시 닫기
  const handleTipLeave = useCallback(() => setTip(null), [])

  if (!items.length) {
    return <div className="text-center py-12 text-sm" style={{ color: "var(--text-muted)" }}>장비 정보를 불러올 수 없어요</div>
  }

  return (
    <>
      {/* 장비 그리드 */}
      <div className="flex justify-center">
        <div ref={gridRef} className="grid gap-1.5" style={{ gridTemplateColumns: "repeat(5, 52px)", gridTemplateRows: "repeat(6, 52px)" }}>
          {SLOT_LAYOUT.map(({ slot, col, row }) => (
            <div key={slot} style={{ gridColumn: col, gridRow: row }}>
              <SlotCell
                item={itemMap.get(slot)}
                onClick={setSelected}
                onEnter={handleEnter}
                onLeave={handleLeave}
              />
            </div>
          ))}
        </div>
      </div>

      {/* 데스크탑 hover 툴팁 — position:fixed 포털로 렌더링
          → 레이아웃 전혀 밀어내지 않음 / 페이지 스크롤에 영향 없음
          → pointerEvents:auto → 툴팁 위에서 스크롤 가능 */}
      {mounted && tip && createPortal(
        <div
          className="hidden md:block"
          style={{
            position:      "fixed",
            left:          tip.x,
            top:           tip.y,
            width:         TIPW,
            zIndex:        9999,
            pointerEvents: "auto",
          }}
          onMouseEnter={handleTipEnter}
          onMouseLeave={handleTipLeave}>
          <MapleItemDetail item={tip.item} />
        </div>,
        document.body
      )}

      {/* 모바일 클릭 모달 */}
      {selected && (
        <div
          className="fixed inset-0 z-[9998] flex items-end sm:items-center justify-center"
          style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(6px)", cursor: "pointer" }}
          onPointerDown={() => setSelected(null)}>
          <div
            className="w-full sm:w-auto sm:min-w-[280px] sm:max-w-xs rounded-t-2xl sm:rounded-xl overflow-hidden"
            style={{ maxHeight: "88vh", overflowY: "auto", cursor: "default" }}
            onPointerDown={e => e.stopPropagation()}>
            {/* 닫기 버튼 */}
            <div style={{
              display: "flex", justifyContent: "flex-end",
              padding: "8px 12px 0",
              background: "linear-gradient(175deg, #131522 0%, #0b0d1c 100%)",
            }}>
              <button onClick={() => setSelected(null)} style={{ color: "#888", padding: 2 }}>
                <X size={16} />
              </button>
            </div>
            <MapleItemDetail item={selected} />
          </div>
        </div>
      )}
    </>
  )
}
