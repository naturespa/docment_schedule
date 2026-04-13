import type { Reservation } from '../../types'
import { getFacilityById } from '../../data/facilities'

interface RecentReservationsProps {
  reservations: Reservation[]
  onDelete: (id: string) => void
}

export function RecentReservations({ reservations, onDelete }: RecentReservationsProps) {
  const today = new Date().toISOString().slice(0, 10)

  const upcoming = [...reservations]
    .filter((r) => r.date >= today)
    .sort((a, b) => {
      const da = `${a.date}T${a.startTime}`
      const db = `${b.date}T${b.startTime}`
      return da.localeCompare(db)
    })
    .slice(0, 5)

  if (upcoming.length === 0) {
    return (
      <div>
        <p className="text-xs text-gray-400 uppercase tracking-widest mb-2">直近の予約</p>
        <p className="text-xs text-gray-500">予約なし</p>
      </div>
    )
  }

  return (
    <div>
      <p className="text-xs text-gray-400 uppercase tracking-widest mb-3">直近の予約</p>
      <div className="space-y-3">
        {upcoming.map((res) => {
          const fac = getFacilityById(res.facilityId)
          const [, month, day] = res.date.split('-')
          const dateLabel = `${month}/${day} ${res.startTime}`
          return (
            <div key={res.id} className={`border-l-2 ${fac?.borderColor ?? 'border-gray-400'} pl-3`}>
              <p className={`text-xs font-semibold ${fac?.color ?? 'text-white'}`}>{dateLabel}</p>
              <p className="text-xs text-gray-300">{fac?.label}・{res.title}</p>
              <button
                onClick={() => onDelete(res.id)}
                className="text-xs text-gray-500 hover:text-red-400 mt-0.5"
              >
                削除
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
