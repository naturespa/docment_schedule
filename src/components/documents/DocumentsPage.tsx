import { useState } from 'react'
import { DOCUMENTS } from '../../data/documents'
import { CATEGORIES, getCategoryById } from '../../data/categories'
import type { CategoryId } from '../../types'
import { DocumentCard } from './DocumentCard'
import { BlankPrintModal } from './BlankPrintModal'
import { FormModal } from './FormModal'
import type { Document } from '../../types'

export function DocumentsPage() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [printDoc, setPrintDoc] = useState<Document | null>(null)
  const [formDoc, setFormDoc] = useState<Document | null>(null)

  const filtered = DOCUMENTS.filter((doc) => {
    const matchCategory = selectedCategory === 'all' || doc.category === selectedCategory
    const q = searchQuery.toLowerCase()
    const matchSearch =
      q === '' || doc.title.toLowerCase().includes(q) || doc.description.toLowerCase().includes(q)
    return matchCategory && matchSearch
  })

  const countByCategory = (catId: CategoryId) =>
    DOCUMENTS.filter((d) => d.category === catId).length

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-navy text-white flex flex-col overflow-y-auto shrink-0">
        <div className="px-5 pt-6 pb-2">
          <p className="text-xs text-gray-400 uppercase tracking-widest">Categories</p>
          <p className="text-sm font-semibold mt-1">カテゴリ</p>
        </div>
        <nav className="flex-1 px-3 pb-6">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg mb-1 text-sm transition-colors ${
              selectedCategory === 'all'
                ? 'bg-gold text-navy font-bold'
                : 'text-gray-300 hover:bg-navy-light'
            }`}
          >
            <span className="flex items-center gap-2">
              <span>📁</span>
              <span>すべて</span>
            </span>
            <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">{DOCUMENTS.length}</span>
          </button>

          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg mb-1 text-sm transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-gold text-navy font-bold'
                  : 'text-gray-300 hover:bg-navy-light'
              }`}
            >
              <span className="flex items-center gap-2">
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </span>
              <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">{countByCategory(cat.id)}</span>
            </button>
          ))}
        </nav>

        <div className="px-5 py-4 border-t border-white/10 text-xs text-gray-500">
          <p>{new Date().toLocaleDateString('ja-JP')}</p>
          <p>書類数: {DOCUMENTS.length} 件</p>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto p-6">
        {/* Page header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-navy">
              {selectedCategory === 'all' ? 'すべての書類' : getCategoryById(selectedCategory)?.label}
            </h1>
            <p className="text-sm text-gray-500 mt-1">{filtered.length} 件</p>
          </div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
            <input
              type="text"
              placeholder="書類を検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-4 py-2 rounded-full border border-gray-200 bg-white text-sm w-64 focus:outline-none focus:ring-2 focus:ring-gold/50"
            />
          </div>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center text-gray-400 py-20 text-sm">該当する書類が見つかりません</div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {filtered.map((doc) => (
              <DocumentCard
                key={doc.id}
                document={doc}
                onFormClick={() => setFormDoc(doc)}
                onPrintClick={() => setPrintDoc(doc)}
              />
            ))}
          </div>
        )}
      </main>

      {printDoc && <BlankPrintModal document={printDoc} onClose={() => setPrintDoc(null)} />}
      {formDoc && <FormModal document={formDoc} onClose={() => setFormDoc(null)} />}
    </div>
  )
}
