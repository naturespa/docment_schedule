import type { Reservation } from '../../types'
import { getFacilityById } from '../../data/facilities'

interface CalendarProps {
  year: number
  month: number
  reservations: Reservation[]
}

const DAY_LABELS = ['日', '月', '火', '水', '木', '金', '土']

function buildCalendarDays(year: number, month: number): (number | null)[] {
  const firstDay = new Date(year, month, 1).getDay()
  const lastDate = new Date(year, month + 1, 0).getDate()
  const days: (number | null)[] = []
  for (let i = 0; i < firstDay; i++) days.push(null)
  for (let d = 1; d <= lastDate; d++) days.push(d)
  while (days.length % 7 !== 0) days.push(null)
  return days
}

function pad2(n: number) {
  return String(n).padStart(2, '0')
}

export function Calendar({ year, month, reservations }: CalendarProps) {
  const today = new Date()
  const isToday = (day: number) =>
    today.getFullYear() === year && today.getMonth() === month && today.getDate() === day

  const days = buildCalendarDays(year, month)

  const getReservationsForDay = (day: number) => {
    const dateStr = `${year}-${pad2(month + 1)}-${pad2(day)}`
    return reservations
      .filter((r) => r.date === dateStr)
      .sort((a, b) => a.startTime.localeCompare(b.startTime))
  }

  const weeks: (number | null)[][] = []
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7))
  }

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      {/* Day header row */}
      <div className="grid grid-cols-7">
        {DAY_LABELS.map((label, i) => (
          <div
            key={label}
            className={`text-center text-sm font-semibold py-2 border-b border-gray-100 ${
              i === 0 ? 'text-red-500' : i === 6 ? 'text-blue-500' : 'text-gray-500'
            }`}
          >
            {label}
          </div>
        ))}
      </div>

      {/* Weeks */}
      {weeks.map((week, wi) => (
        <div key={wi} className="grid grid-cols-7">
          {week.map((day, di) => {
            const dayReservations = day ? getReservationsForDay(day) : []
            const maxVisible = 3
            const overflow = dayReservations.length - maxVisible
            const colIndex = di % 7

            return (
              <div
                key={di}
                className={`min-h-[100px] border-b border-r border-gray-100 p-1 ${
                  day ? 'bg-white' : 'bg-gray-50'
                } ${di === 6 ? 'border-r-0' : ''}`}
              >
                {day && (
                  <>
                    <div
                      className={`text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full mb-1 ${
                        isToday(day)
                          ? 'bg-gold text-white font-bold ring-2 ring-gold ring-offset-1'
                          : colIndex === 0
                          ? 'text-red-500'
                          : colIndex === 6
                          ? 'text-blue-500'
                          : 'text-gray-700'
                      }`}
                    >
                      {day}
                    </div>
                    <div className="space-y-0.5">
                      {dayReservations.slice(0, maxVisible).map((res) => {
                        const fac = getFacilityById(res.facilityId)
                        return (
                          <div
                            key={res.id}
                            className={`flex items-center text-xs px-1 py-0.5 rounded border-l-2 ${fac?.borderColor ?? 'border-gray-300'} ${fac?.bgColor ?? 'bg-gray-50'} truncate`}
                            title={`${res.startTime} ${res.title} (${fac?.label})`}
                          >
                            <span className="text-gray-500 mr-1 shrink-0">{res.startTime}</span>
                            <span className={`font-medium truncate ${fac?.color ?? 'text-gray-600'}`}>{res.title}</span>
                          </div>
                        )
                      })}
                      {overflow > 0 && (
                        <div className="text-xs text-gray-400 pl-1">+{overflow}件</div>
                      )}
                    </div>
                  </>
                )}
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}
