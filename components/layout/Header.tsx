'use client';

interface HeaderProps {
  propertyName: string;
  onPropertyNameChange: (name: string) => void;
  onPrint: () => void;
  onShare: () => void;
  copied: boolean;
  compareMode: boolean;
  onCompareModeToggle: () => void;
}

export default function Header({
  propertyName,
  onPropertyNameChange,
  onPrint,
  onShare,
  copied,
  compareMode,
  onCompareModeToggle,
}: HeaderProps) {
  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-4 py-3">
      <div className="max-w-5xl mx-auto flex items-center gap-3 flex-wrap">
        {/* ロゴ */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
            </svg>
          </div>
          <div className="hidden sm:block">
            <h1 className="text-base font-bold text-slate-900 dark:text-white leading-none">RateScope</h1>
            <p className="text-xs text-slate-400 dark:text-slate-500 leading-none mt-0.5">不動産シミュレーター</p>
          </div>
        </div>

        {/* 物件名入力 — 印刷時はテキストとして表示 */}
        <div className="flex-1 min-w-[140px] max-w-xs">
          <input
            type="text"
            placeholder="物件名（任意）"
            value={propertyName}
            onChange={(e) => onPropertyNameChange(e.target.value)}
            className="w-full px-3 py-1.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-md text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 print:hidden"
          />
          {propertyName && (
            <p className="hidden print:block text-base font-semibold text-slate-800">{propertyName}</p>
          )}
        </div>

        {/* ボタン群 — 印刷時は非表示 */}
        <div className="flex items-center gap-2 ml-auto print:hidden">
          <button
            onClick={onCompareModeToggle}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              compareMode
                ? 'bg-orange-500 text-white hover:bg-orange-600'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
            }`}
          >
            {compareMode ? '比較中' : '比較モード'}
          </button>
          <button
            onClick={onShare}
            className="px-3 py-1.5 text-xs font-medium rounded-md bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors whitespace-nowrap"
          >
            {copied ? '✓ コピー済み' : 'URL共有'}
          </button>
          <button
            onClick={onPrint}
            className="px-3 py-1.5 text-xs font-medium rounded-md bg-blue-500 text-white hover:bg-blue-600 transition-colors whitespace-nowrap"
          >
            PDF出力
          </button>
        </div>
      </div>
    </header>
  );
}
