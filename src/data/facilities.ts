import type { Facility } from '../types'

export const FACILITIES: Facility[] = [
  {
    id: 'gymnasium',
    label: '体育館',
    color: 'text-red-500',
    bgColor: 'bg-red-100',
    borderColor: 'border-red-400',
    dotColor: 'bg-red-500',
  },
  {
    id: 'ground',
    label: 'グラウンド',
    color: 'text-green-500',
    bgColor: 'bg-green-100',
    borderColor: 'border-green-400',
    dotColor: 'bg-green-500',
  },
  {
    id: 'meeting1',
    label: '第1会議室',
    color: 'text-blue-500',
    bgColor: 'bg-blue-100',
    borderColor: 'border-blue-400',
    dotColor: 'bg-blue-500',
  },
  {
    id: 'meeting2',
    label: '第2会議室',
    color: 'text-purple-500',
    bgColor: 'bg-purple-100',
    borderColor: 'border-purple-400',
    dotColor: 'bg-purple-500',
  },
  {
    id: 'av_room',
    label: '視聴覚室',
    color: 'text-amber-500',
    bgColor: 'bg-amber-100',
    borderColor: 'border-amber-400',
    dotColor: 'bg-amber-500',
  },
  {
    id: 'computer',
    label: 'コンピュータ室',
    color: 'text-teal-500',
    bgColor: 'bg-teal-100',
    borderColor: 'border-teal-400',
    dotColor: 'bg-teal-500',
  },
]

export const getFacilityById = (id: string) =>
  FACILITIES.find((f) => f.id === id)
