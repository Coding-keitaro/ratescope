'use client';

import SliderRow from '@/components/shared/SliderRow';
import MetricCard from '@/components/shared/MetricCard';
import { calcDSCR, getDscrStatus, calcAnnualDebtService, DSCR_THRESHOLD } from '@/lib/calculations';
import { DscrState } from '@/types';

const DSCR_MAX = 3.0;
const GUIDE_TEXT: Record<string, string> = {
  safe: '銀行融資クリア — 余裕あり',
  warning: '融資通過ライン — ギリギリ',
  danger: '融資困難 — NOI増加か借入減額が必要',
};
const STATUS_COLORS: Record<string, string> = { safe: 'bg-green-500', warning: 'bg-yellow-500', danger: 'bg-red-500' };
const STATUS_TEXT_COLORS: Record<string, string> = {
  safe: 'text-green-600 dark:text-green-400',
  warning: 'text-yellow-600 dark:text-yellow-400',
  danger: 'text-red-600 dark:text-red-400',
};

interface DscrSimulatorProps {
  state: DscrState;
  onChange: (state: DscrState) => void;
  compact?: boolean;
}

export default function DscrSimulator({ state, onChange, compact = false }: DscrSimulatorProps) {
  const { noi, loanAmount, loanRate } = state;

  const annualDebt = calcAnnualDebtService(loanAmount, loanRate);
  const dscr = calcDSCR(noi, annualDebt);
  const status = getDscrStatus(dscr);
  const barPercent = Math.min((dscr / DSCR_MAX) * 100, 100);
  const thresholdPercent = (DSCR_THRESHOLD / DSCR_MAX) * 100;

  return (
    <div className="space-y-4">
      {!compact && (
        <div>
          <h2 className="text-base font-semibold text-slate-800 dark:text-slate-100 mb-1">DSCR 計算機</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">銀行が見る返済余力（Debt Service Coverage Ratio）を体感できます</p>
        </div>
      )}

      <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm border border-slate-100 dark:border-slate-700 print:hidden">
        <SliderRow label="年間NOI" min={500} max={5000} step={100} value={noi} unit="万円" formatter={(v) => `${v.toLocaleString()}万円`} onChange={(v) => onChange({ ...state, noi: v })} />
        <SliderRow label="借入額" min={1} max={20} step={0.5} value={loanAmount} unit="億円" formatter={(v) => `${v}億円`} onChange={(v) => onChange({ ...state, loanAmount: v })} />
        <SliderRow label="金利" min={0.5} max={7.0} step={0.1} value={loanRate} unit="%" formatter={(v) => `${v.toFixed(1)}%`} onChange={(v) => onChange({ ...state, loanRate: v })} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <MetricCard label="年間返済額（利息）" value={`${Math.round(annualDebt).toLocaleString()}万円`} note={`借入 ${loanAmount}億 × 金利 ${loanRate.toFixed(1)}%`} />
        <MetricCard label="DSCR" value={dscr.toFixed(2)} note={`NOI ${noi.toLocaleString()}万円 ÷ 返済 ${Math.round(annualDebt).toLocaleString()}万円`} status={status === 'safe' ? 'positive' : status === 'danger' ? 'negative' : 'neutral'} />
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm border border-slate-100 dark:border-slate-700">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400">DSCRメーター</h3>
          <span className={`text-sm font-bold ${STATUS_TEXT_COLORS[status]}`}>{dscr.toFixed(2)}</span>
        </div>
        <div className="relative h-6 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-none ${STATUS_COLORS[status]}`} style={{ width: `${barPercent}%` }} />
          <div className="absolute top-0 bottom-0 w-0.5 bg-slate-800 dark:bg-white" style={{ left: `${thresholdPercent}%` }} />
        </div>
        <div className="flex justify-between text-xs text-slate-400 dark:text-slate-500 mt-1">
          <span>0</span>
          <span className="relative" style={{ left: `calc(${thresholdPercent}% - 20px)` }}>{DSCR_THRESHOLD}</span>
          <span>{DSCR_MAX}</span>
        </div>
        <p className={`text-sm font-medium mt-3 text-center ${STATUS_TEXT_COLORS[status]}`}>{GUIDE_TEXT[status]}</p>
        <div className="mt-3 grid grid-cols-3 gap-2 text-center">
          <div className={`rounded p-2 ${status === 'danger' ? 'bg-red-50 dark:bg-red-900/20' : 'bg-slate-50 dark:bg-slate-700/50'}`}>
            <p className="text-xs text-red-500 font-medium">融資困難</p>
            <p className="text-xs text-slate-400">DSCR &lt; 1.2</p>
          </div>
          <div className={`rounded p-2 ${status === 'warning' ? 'bg-yellow-50 dark:bg-yellow-900/20' : 'bg-slate-50 dark:bg-slate-700/50'}`}>
            <p className="text-xs text-yellow-500 font-medium">ギリギリ</p>
            <p className="text-xs text-slate-400">1.2 〜 1.4</p>
          </div>
          <div className={`rounded p-2 ${status === 'safe' ? 'bg-green-50 dark:bg-green-900/20' : 'bg-slate-50 dark:bg-slate-700/50'}`}>
            <p className="text-xs text-green-500 font-medium">余裕あり</p>
            <p className="text-xs text-slate-400">DSCR ≥ 1.4</p>
          </div>
        </div>
      </div>
    </div>
  );
}
