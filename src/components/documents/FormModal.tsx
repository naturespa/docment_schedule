import { useState, useEffect } from 'react'
import type { Document, FormField } from '../../types'
import { getCategoryById } from '../../data/categories'

interface FormModalProps {
  document: Document
  onClose: () => void
}

type FormValues = Record<string, string>

function FieldInput({ field, value, onChange }: { field: FormField; value: string; onChange: (v: string) => void }) {
  switch (field.type) {
    case 'textarea':
      return (
        <textarea
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 resize-none"
          rows={3}
          placeholder={field.placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={field.required}
        />
      )
    case 'select':
      return (
        <select
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 bg-white"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={field.required}
        >
          <option value="">選択してください</option>
          {field.options?.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      )
    case 'radio':
      return (
        <div className="flex flex-wrap gap-4 pt-1">
          {field.options?.map((opt) => (
            <label key={opt} className="flex items-center gap-2 cursor-pointer text-sm">
              <input
                type="radio"
                name={field.id}
                value={opt}
                checked={value === opt}
                onChange={() => onChange(opt)}
                className="accent-gold"
              />
              {opt}
            </label>
          ))}
        </div>
      )
    case 'checkbox':
      return (
        <div className="flex flex-wrap gap-4 pt-1">
          {field.options?.map((opt) => (
            <label key={opt} className="flex items-center gap-2 cursor-pointer text-sm">
              <input
                type="checkbox"
                checked={value.split(',').includes(opt)}
                onChange={(e) => {
                  const vals = value ? value.split(',').filter(Boolean) : []
                  if (e.target.checked) {
                    onChange([...vals, opt].join(','))
                  } else {
                    onChange(vals.filter((v) => v !== opt).join(','))
                  }
                }}
                className="accent-gold"
              />
              {opt}
            </label>
          ))}
        </div>
      )
    default:
      return (
        <input
          type={field.type}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
          placeholder={field.placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={field.required}
        />
      )
  }
}

const STORAGE_KEY_PREFIX = 'school_form_draft_'

export function FormModal({ document, onClose }: FormModalProps) {
  const category = getCategoryById(document.category)
  const storageKey = `${STORAGE_KEY_PREFIX}${document.id}`

  const [values, setValues] = useState<FormValues>(() => {
    try {
      const stored = localStorage.getItem(storageKey)
      if (stored) return JSON.parse(stored) as FormValues
    } catch {
      // ignore
    }
    return {}
  })
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(values))
  }, [values, storageKey])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  const setField = (id: string, val: string) => {
    setValues((prev) => ({ ...prev, [id]: val }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    localStorage.removeItem(storageKey)
    window.print()
  }

  const handleReset = () => {
    setValues({})
    localStorage.removeItem(storageKey)
    setSubmitted(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${category?.badgeBg ?? ''}`}>
                {category?.icon} {category?.label}
              </span>
            </div>
            <h2 className="text-lg font-bold text-navy mt-1">{document.title}</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
        </div>

        {submitted ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8">
            <div className="text-5xl">✅</div>
            <p className="text-navy font-bold text-lg">印刷が完了しました</p>
            <p className="text-gray-400 text-sm">印刷ダイアログから印刷してください</p>
            <div className="flex gap-3 mt-4">
              <button onClick={handleReset} className="px-6 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50">
                もう一度入力
              </button>
              <button onClick={onClose} className="px-6 py-2 bg-navy text-white rounded-lg text-sm font-semibold hover:bg-navy-light">
                閉じる
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
            <div id="print-area" className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {document.fields.map((field) => (
                <div key={field.id}>
                  <label className="block text-sm font-medium text-navy mb-1">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  <FieldInput
                    field={field}
                    value={values[field.id] ?? ''}
                    onChange={(v) => setField(field.id, v)}
                  />
                </div>
              ))}
            </div>

            <div className="flex gap-3 px-6 py-4 border-t border-gray-100">
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors"
              >
                リセット
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors"
              >
                閉じる
              </button>
              <button
                type="submit"
                className="flex-1 py-2 bg-navy text-white rounded-lg text-sm font-semibold hover:bg-navy-light transition-colors flex items-center justify-center gap-2"
              >
                <span>🖨️</span>
                <span>印刷する</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
