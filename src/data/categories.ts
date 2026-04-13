import type { Category } from '../types'

export const CATEGORIES: Category[] = [
  {
    id: 'student',
    label: '生徒関係',
    icon: '👤',
    color: 'text-orange-600',
    borderColor: 'border-orange-400',
    badgeBg: 'bg-orange-100 text-orange-700',
  },
  {
    id: 'staff',
    label: '教職員関係',
    icon: '🎓',
    color: 'text-green-600',
    borderColor: 'border-green-400',
    badgeBg: 'bg-green-100 text-green-700',
  },
  {
    id: 'parent',
    label: '保護者向け',
    icon: '👨‍👩‍👧',
    color: 'text-purple-600',
    borderColor: 'border-purple-400',
    badgeBg: 'bg-purple-100 text-purple-700',
  },
  {
    id: 'event',
    label: '行事・部活',
    icon: '🎉',
    color: 'text-blue-600',
    borderColor: 'border-blue-400',
    badgeBg: 'bg-blue-100 text-blue-700',
  },
  {
    id: 'ict',
    label: '情報・ICT',
    icon: '💻',
    color: 'text-teal-600',
    borderColor: 'border-teal-400',
    badgeBg: 'bg-teal-100 text-teal-700',
  },
]

export const getCategoryById = (id: string) =>
  CATEGORIES.find((c) => c.id === id)
