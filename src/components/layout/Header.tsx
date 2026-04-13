import type { TabId } from './Layout'

interface HeaderProps {
  activeTab: TabId
  onTabChange: (tab: TabId) => void
  documentCount: number
  reservationCount: number
}

export function Header({ activeTab, onTabChange, documentCount, reservationCount }: HeaderProps) {
  const now = new Date()
  const days = ['日', '月', '火', '水', '木', '金', '土']
  const dateStr = `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日(${days[now.getDay()]})`

  return (
    <header className="bg-navy-dark text-white flex items-center px-6 h-16 shrink-0">
      <div className="flex flex-col leading-tight mr-10">
        <span className="text-xs text-gray-400">○○高等学校</span>
        <span className="text-base font-bold tracking-wide">校内統合管理システム</span>
      </div>

      <nav className="flex items-end gap-1 flex-1">
        <button
          onClick={() => onTabChange('documents')}
          className={`flex flex-col items-center px-5 py-2 text-sm border-b-2 transition-colors ${
            activeTab === 'documents'
              ? 'border-gold text-white'
              : 'border-transparent text-gray-400 hover:text-gray-200'
          }`}
        >
          <span className="flex items-center gap-1">
            <span>📄</span>
            <span>書類管理</span>
          </span>
          <span className="text-xs">{documentCount}種類</span>
        </button>

        <button
          onClick={() => onTabChange('facilities')}
          className={`flex flex-col items-center px-5 py-2 text-sm border-b-2 transition-colors ${
            activeTab === 'facilities'
              ? 'border-gold text-white'
              : 'border-transparent text-gray-400 hover:text-gray-200'
          }`}
        >
          <span className="flex items-center gap-1">
            <span>📅</span>
            <span>施設予約</span>
          </span>
          <span className="text-xs">{reservationCount}件</span>
        </button>
      </nav>

      <div className="text-sm text-gray-300 ml-4 whitespace-nowrap">{dateStr}</div>
    </header>
  )
}
