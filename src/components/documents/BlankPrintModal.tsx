import { useEffect } from 'react'
import type { Document } from '../../types'
import { getCategoryById } from '../../data/categories'

interface BlankPrintModalProps {
  document: Document
  onClose: () => void
}

export function BlankPrintModal({ document, onClose }: BlankPrintModalProps) {
  const category = getCategoryById(document.category)

  const handlePrint = () => {
    window.print()
  }

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Modal header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-navy">空白印刷プレビュー</h2>
            <p className="text-xs text-gray-400 mt-0.5">{document.title}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
        </div>

        {/* Print area */}
        <div id="print-area" className="flex-1 overflow-y-auto p-6">
          <div className="border border-gray-200 rounded-lg p-8">
            {/* Document header */}
            <div className="text-center mb-8">
              <div className="text-xs text-gray-400 mb-1">○○高等学校</div>
              <h1 className="text-2xl font-bold text-navy border-b-2 border-navy pb-2 inline-block px-8">
                {document.title}
              </h1>
              <div className="mt-3 text-sm text-gray-500">{category?.label}</div>
            </div>

            {/* Fields */}
            <div className="space-y-5">
              {document.fields.map((field) => (
                <div key={field.id} className="flex items-start gap-4">
                  <label className="text-sm font-medium text-navy w-40 shrink-0 pt-2">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  <div className="flex-1">
                    {field.type === 'textarea' ? (
                      <div className="border border-gray-300 rounded h-20 w-full" />
                    ) : field.type === 'radio' || field.type === 'checkbox' ? (
                      <div className="flex gap-6 pt-2">
                        {field.options?.map((opt) => (
                          <div key={opt} className="flex items-center gap-2">
                            <div className="w-4 h-4 border border-gray-400 rounded-full" />
                            <span className="text-sm text-gray-600">{opt}</span>
                          </div>
                        ))}
                      </div>
                    ) : field.type === 'select' ? (
                      <div className="border border-gray-300 rounded px-3 py-2 text-sm text-gray-400 w-full">
                        {field.options?.join(' / ')}
                      </div>
                    ) : (
                      <div className="border-b border-gray-400 h-8 w-full" />
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="mt-10 flex justify-end gap-8 text-sm">
              <div className="flex items-center gap-4">
                <span className="text-gray-500">提出日:</span>
                <div className="border-b border-gray-400 w-32" />
              </div>
              <div className="flex items-center gap-4">
                <span className="text-gray-500">担当者印:</span>
                <div className="border border-gray-400 w-14 h-14 rounded" />
              </div>
            </div>
          </div>
        </div>

        {/* Footer buttons */}
        <div className="flex gap-3 px-6 py-4 border-t border-gray-100">
          <button
            onClick={onClose}
            className="flex-1 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors"
          >
            閉じる
          </button>
          <button
            onClick={handlePrint}
            className="flex-1 py-2 bg-navy text-white rounded-lg text-sm font-semibold hover:bg-navy-light transition-colors flex items-center justify-center gap-2"
          >
            <span>🖨️</span>
            <span>印刷する</span>
          </button>
        </div>
      </div>
    </div>
  )
}
