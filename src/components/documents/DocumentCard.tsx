import type { Document } from '../../types'
import { getCategoryById } from '../../data/categories'

interface DocumentCardProps {
  document: Document
  onFormClick: () => void
  onPrintClick: () => void
}

export function DocumentCard({ document, onFormClick, onPrintClick }: DocumentCardProps) {
  const category = getCategoryById(document.category)

  return (
    <div className={`bg-white rounded-xl shadow-sm border-t-4 ${category?.borderColor ?? 'border-gray-300'} flex flex-col`}>
      <div className="p-5 flex-1">
        <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium mb-3 ${category?.badgeBg ?? 'bg-gray-100 text-gray-600'}`}>
          <span>{category?.icon}</span>
          <span>{category?.label}</span>
        </span>
        <h2 className="text-lg font-bold text-navy mb-1">{document.title}</h2>
        <p className="text-sm text-gray-500 mb-3">{document.description}</p>
        <p className="text-xs text-gray-400 flex items-center gap-1">
          <span>📋</span>
          <span>{document.fields.length} 項目</span>
        </p>
      </div>

      <div className="flex border-t border-gray-100">
        <button
          onClick={onFormClick}
          className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold text-white bg-navy hover:bg-navy-light transition-colors rounded-bl-xl"
        >
          <span>📝</span>
          <span>FORM入力</span>
        </button>
        <button
          onClick={onPrintClick}
          className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold text-navy border-l border-gray-100 hover:bg-gray-50 transition-colors rounded-br-xl"
        >
          <span>🖨️</span>
          <span>空白印刷</span>
        </button>
      </div>
    </div>
  )
}
