'use client';

import { useState, useEffect, useCallback } from 'react';
import Header from '@/components/layout/Header';
import TabBar from '@/components/layout/TabBar';
import CapRateSimulator from '@/components/simulators/CapRateSimulator';
import LeverageSimulator from '@/components/simulators/LeverageSimulator';
import RefinanceSimulator from '@/components/simulators/RefinanceSimulator';
import DscrSimulator from '@/components/simulators/DscrSimulator';
import ComparisonDiff from '@/components/simulators/ComparisonDiff';
import { TabId, AllSimulatorStates } from '@/types';
import { AppState, DEFAULT_APP_STATE, parseUrlState, buildUrlSearch } from '@/lib/urlParams';

const TAB_LABELS: Record<TabId, string> = {
  caprate: '金利→物件価格の連鎖',
  leverage: 'レバレッジの正負',
  refinance: '5年後の崖',
  dscr: 'DSCR計算機',
};

export default function Home() {
  const [appState, setAppState] = useState<AppState>(DEFAULT_APP_STATE);
  const [urlReady, setUrlReady] = useState(false);
  const [copied, setCopied] = useState(false);

  // URLから初期化
  useEffect(() => {
    setAppState(parseUrlState(window.location.search));
    setUrlReady(true);
  }, []);

  // stateをURLに同期
  useEffect(() => {
    if (!urlReady) return;
    window.history.replaceState(null, '', `?${buildUrlSearch(appState)}`);
  }, [appState, urlReady]);

  const setTab = useCallback((tab: TabId) => setAppState((s) => ({ ...s, tab })), []);

  const setPropertyName = useCallback(
    (propertyName: string) => setAppState((s) => ({ ...s, propertyName })),
    []
  );

  const toggleCompareMode = useCallback(
    () => setAppState((s) => ({ ...s, compareMode: !s.compareMode })),
    []
  );

  const updateA = useCallback(
    (patch: Partial<AllSimulatorStates>) =>
      setAppState((s) => ({ ...s, stateA: { ...s.stateA, ...patch } })),
    []
  );

  const updateB = useCallback(
    (patch: Partial<AllSimulatorStates>) =>
      setAppState((s) => ({ ...s, stateB: { ...s.stateB, ...patch } })),
    []
  );

  const handleShare = useCallback(async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  const { tab, propertyName, compareMode, stateA, stateB } = appState;

  function renderSimulator(
    states: AllSimulatorStates,
    update: (patch: Partial<AllSimulatorStates>) => void,
    compact: boolean
  ) {
    switch (tab) {
      case 'caprate':
        return <CapRateSimulator state={states.caprate} onChange={(s) => update({ caprate: s })} compact={compact} />;
      case 'leverage':
        return <LeverageSimulator state={states.leverage} onChange={(s) => update({ leverage: s })} compact={compact} />;
      case 'refinance':
        return <RefinanceSimulator state={states.refinance} onChange={(s) => update({ refinance: s })} compact={compact} />;
      case 'dscr':
        return <DscrSimulator state={states.dscr} onChange={(s) => update({ dscr: s })} compact={compact} />;
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* 印刷時のみ表示するヘッダー */}
      <div className="hidden print:block px-6 py-4 border-b-2 border-slate-800">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xl font-bold text-slate-900">RateScope 試算書</p>
            {propertyName && <p className="text-base text-slate-700 mt-1">物件名: {propertyName}</p>}
            <p className="text-sm text-slate-600 mt-0.5">{TAB_LABELS[tab]}</p>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {new Date().toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <p className="text-xs text-slate-400 mt-2">※ 本試算は参考値です。実際の取引においては専門家にご相談ください。</p>
      </div>

      <Header
        propertyName={propertyName}
        onPropertyNameChange={setPropertyName}
        onPrint={() => window.print()}
        onShare={handleShare}
        copied={copied}
        compareMode={compareMode}
        onCompareModeToggle={toggleCompareMode}
      />
      <TabBar activeTab={tab} onTabChange={setTab} />

      <main className="max-w-5xl mx-auto px-4 py-6">
        {!compareMode ? (
          <div key={tab} style={{ animation: 'fadeIn 150ms ease-in-out' }}>
            {renderSimulator(stateA, updateA, false)}
          </div>
        ) : (
          <div style={{ animation: 'fadeIn 150ms ease-in-out' }}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* シナリオ A */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-500 text-white text-xs font-bold">A</span>
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-400">シナリオ A</span>
                </div>
                {renderSimulator(stateA, updateA, true)}
              </div>
              {/* シナリオ B */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-orange-500 text-white text-xs font-bold">B</span>
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-400">シナリオ B</span>
                </div>
                {renderSimulator(stateB, updateB, true)}
              </div>
            </div>
            <div className="mt-4">
              <ComparisonDiff tab={tab} stateA={stateA} stateB={stateB} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
