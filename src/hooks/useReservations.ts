import { useState, useEffect } from 'react'
import type { Reservation } from '../types'
import { INITIAL_RESERVATIONS } from '../data/reservations'

const STORAGE_KEY = 'school_reservations'

export function useReservations() {
  const [reservations, setReservations] = useState<Reservation[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) return JSON.parse(stored) as Reservation[]
    } catch {
      // ignore
    }
    return INITIAL_RESERVATIONS
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reservations))
  }, [reservations])

  const addReservation = (data: Omit<Reservation, 'id' | 'createdAt'>) => {
    const newRes: Reservation = {
      ...data,
      id: `res-${Date.now()}`,
      createdAt: new Date().toISOString(),
    }
    setReservations((prev) => [...prev, newRes])
  }

  const deleteReservation = (id: string) => {
    setReservations((prev) => prev.filter((r) => r.id !== id))
  }

  return { reservations, addReservation, deleteReservation }
}
