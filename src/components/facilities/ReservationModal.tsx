import { useState, useEffect } from 'react'
import type { Reservation, FacilityId } from '../../types'
import { FACILITIES } from '../../data/facilities'

interface ReservationModalProps {
  onClose: () => void
  onSubmit: (data: Omit<Reservation, 'id' | 'createdAt'>) => void
  reservations: Reservation[]
}

interface FormState {
  facilityId: FacilityId | ''
  title: string
  date: string
  startTime: string
  endTime: string
  organizer: string
  notes: string
}

const EMPTY: FormState = {
  facilityId: '',
  title: '',
  date: '',
  startTime: '',
  endTime: '',
  organizer: '',
  notes: '',
}

function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number)
  return (h ?? 0) * 60 + (m ?? 0)
}

function hasConflict(
  reservations: Reservation[],
  facilityId: FacilityId,
  date: string,
  startTime: string,
  endTime: string,
): boolean {
  const start = timeToMinutes(startTime)
  const end = timeToMinutes(endTime)
  return reservations
    .filter((r) => r.facilityId === facilityId && r.date === date)
    .some((r) => {
      const rStart = timeToMinutes(r.startTime)
      const rEnd = timeToMinutes(r.endTime)
      return start < rEnd && end > rStart
    })
}

export function ReservationModal({ onClose, onSubmit, reservations }: ReservationModalProps) {
  const [form, setForm] = useState<FormState>(EMPTY)
  const [error, setError] = useState('')

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  const set = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setError('')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.facilityId) { setError('施設を選択してください'); return }
    if (!form.title.trim()) { setError('タイトルを入力してください'); return }
    if (!form.date) { setError('日付を選択してください'); return }
    if (!form.startTime) { setError('開始時刻を入力してください'); return }
    if (!form.endTime) { setError('終了時刻を入力してください'); return }
    if (timeToMinutes(form.endTime) <= timeToMinutes(form.startTime)) {
      setError('終了時刻は開始時刻より後にしてください')
      return
    }
    if (!form.organizer.trim()) { setError('予約者名を入力してください'); return }

    if (hasConflict(reservations, form.facilityId, form.date, form.startTime, form.endTime)) {
      setError('その施設・時間帯はすでに予約されています')
      return
    }

    onSubmit({
      facilityId: form.facilityId,
      title: form.title.trim(),
      date: form.date,
      startTime: form.startTime,
      endTime: form.endTime,
      organizer: form.organizer.trim(),
      notes: form.notes.trim() || undefined,
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-navy">予約を追加</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {/* 施設 */}
            <div>
              <label className="block text-sm font-medium text-navy mb-1">施設 <span className="text-red-500">*</span></label>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 bg-white"
                value={form.facilityId}
                onChange={(e) => set('facilityId', e.target.value)}
              >
                <option value="">選択してください</option>
                {FACILITIES.map((fac) => (
                  <option key={fac.id} value={fac.id}>{fac.label}</option>
                ))}
              </select>
            </div>

            {/* タイトル */}
            <div>
              <label className="block text-sm font-medium text-navy mb-1">タイトル / 用途 <span className="text-red-500">*</span></label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
                placeholder="例：バスケットボール部練習"
                value={form.title}
                onChange={(e) => set('title', e.target.value)}
              />
            </div>

            {/* 日付 */}
            <div>
              <label className="block text-sm font-medium text-navy mb-1">日付 <span className="text-red-500">*</span></label>
              <input
                type="date"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
                value={form.date}
                onChange={(e) => set('date', e.target.value)}
              />
            </div>

            {/* 時刻 */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-navy mb-1">開始時刻 <span className="text-red-500">*</span></label>
                <input
                  type="time"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
                  value={form.startTime}
                  onChange={(e) => set('startTime', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy mb-1">終了時刻 <span className="text-red-500">*</span></label>
                <input
                  type="time"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
                  value={form.endTime}
                  onChange={(e) => set('endTime', e.target.value)}
                />
              </div>
            </div>

            {/* 予約者 */}
            <div>
              <label className="block text-sm font-medium text-navy mb-1">予約者名・団体 <span className="text-red-500">*</span></label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
                placeholder="例：野球部"
                value={form.organizer}
                onChange={(e) => set('organizer', e.target.value)}
              />
            </div>

            {/* 備考 */}
            <div>
              <label className="block text-sm font-medium text-navy mb-1">備考</label>
              <textarea
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 resize-none"
                rows={2}
                placeholder="任意"
                value={form.notes}
                onChange={(e) => set('notes', e.target.value)}
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
            )}
          </div>

          <div className="flex gap-3 px-6 py-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors"
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="flex-1 py-2 bg-gold text-white rounded-lg text-sm font-semibold hover:bg-amber-600 transition-colors"
            >
              予約を追加
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
