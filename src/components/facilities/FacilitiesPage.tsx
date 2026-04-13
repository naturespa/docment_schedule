import { useState } from 'react'
import type { FacilityId } from '../../types'
import { FACILITIES } from '../../data/facilities'
import { useReservations } from '../../hooks/useReservations'
import { Calendar } from './Calendar'
import { ReservationModal } from './ReservationModal'
import { RecentReservations } from './RecentReservations'

export function FacilitiesPage() {
  const [selectedFacility, setSelectedFacility] = useState<FacilityId | 'all'>('all')
  const [showModal, setShowModal] = useState(false)
  const [currentYear, setCurrentYear] = useState(() => new Date().getFullYear())
  const [currentMonth, setCurrentMonth] = useState(() => new Date().getMonth())
  const { reservations, addReservation, deleteReservation } = useReservations()

  const filtered =
    selectedFacility === 'all'
      ? reservations
      : reservations.filter((r) => r.facilityId === selectedFacility)

  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear((y) => y - 1) }
    else setCurrentMonth((m) => m - 1)
  }
  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear((y) => y + 1) }
    else setCurrentMonth((m) => m + 1)
  }
  const goToday = () => {
    const now = new Date()
    setCurrentYear(now.getFullYear())
    setCurrentMonth(now.getMonth())
  }

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-navy text-white flex flex-col overflow-y-auto shrink-0">
        <div className="px-5 pt-6 pb-2">
          <p className="text-xs text-gray-400 uppercase tracking-widest">Facilities</p>
          <p className="text-sm font-semibold mt-1">施設フィルター</p>
        </div>

        <nav className="px-3 pb-4">
          <button
            onClick={() => setSelectedFacility('all')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg mb-1 text-sm transition-colors ${
              selectedFacility === 'all'
                ? 'bg-gold text-navy font-bold'
                : 'text-gray-300 hover:bg-navy-light'
            }`}
          >
            <span className="w-3 h-3 rounded-full bg-gold shrink-0" />
            <span>すべての施設</span>
          </button>
          {FACILITIES.map((fac) => (
            <button
              key={fac.id}
              onClick={() => setSelectedFacility(fac.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg mb-1 text-sm transition-colors ${
                selectedFacility === fac.id
                  ? 'bg-gold text-navy font-bold'
                  : 'text-gray-300 hover:bg-navy-light'
              }`}
            >
              <span className={`w-3 h-3 rounded-full ${fac.dotColor} shrink-0`} />
              <span>{fac.label}</span>
            </button>
          ))}
        </nav>

        <div className="border-t border-white/10 px-5 py-4">
          <RecentReservations reservations={reservations} onDelete={deleteReservation} />
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto p-6 bg-cream">
        {/* Calendar header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={prevMonth}
              className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100 text-gray-600 font-bold"
            >
              ‹
            </button>
            <h2 className="text-2xl font-bold text-navy min-w-[160px] text-center">
              {currentYear}年 {currentMonth + 1}月
            </h2>
            <button
              onClick={nextMonth}
              className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100 text-gray-600 font-bold"
            >
              ›
            </button>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={goToday}
              className="px-4 py-1.5 border border-gray-300 rounded-lg text-sm text-navy hover:bg-gray-100 transition-colors"
            >
              今月
            </button>
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-1.5 bg-gold text-white rounded-lg text-sm font-semibold hover:bg-amber-600 transition-colors flex items-center gap-1"
            >
              <span>+</span>
              <span>予約追加</span>
            </button>
          </div>
        </div>

        <Calendar
          year={currentYear}
          month={currentMonth}
          reservations={filtered}
        />
      </main>

      {showModal && (
        <ReservationModal
          onClose={() => setShowModal(false)}
          onSubmit={(data) => {
            addReservation(data)
            setShowModal(false)
          }}
          reservations={reservations}
        />
      )}
    </div>
  )
}
