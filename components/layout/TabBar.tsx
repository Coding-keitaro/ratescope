'use client';

import { TabDef, TabId } from '@/types';

const TABS: TabDef[] = [
  { id: 'caprate', label: '金利→価格連鎖', shortLabel: '01 価格連鎖' },
  { id: 'leverage', label: 'レバレッジ正負', shortLabel: '02 レバレッジ' },
  { id: 'refinance', label: '5年後の崖', shortLabel: '03 借換崖' },
  { id: 'dscr', label: 'DSCR計算機', shortLabel: '04 DSCR' },
];

interface TabBarProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

export default function TabBar({ activeTab, onTabChange }: TabBarProps) {
  return (
    <nav className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex-shrink-0 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:border-slate-300'
              }`}
            >
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.shortLabel}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
