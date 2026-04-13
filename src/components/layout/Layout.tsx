import { useState } from 'react'
import { Header } from './Header'
import { DocumentsPage } from '../documents/DocumentsPage'
import { FacilitiesPage } from '../facilities/FacilitiesPage'
import { DOCUMENTS } from '../../data/documents'
import { useReservations } from '../../hooks/useReservations'

export type TabId = 'documents' | 'facilities'

export function Layout() {
  const [activeTab, setActiveTab] = useState<TabId>('documents')
  const { reservations } = useReservations()

  return (
    <div className="flex flex-col h-screen bg-cream">
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        documentCount={DOCUMENTS.length}
        reservationCount={reservations.length}
      />
      <div className="flex flex-1 overflow-hidden">
        {activeTab === 'documents' ? <DocumentsPage /> : <FacilitiesPage />}
      </div>
    </div>
  )
}
