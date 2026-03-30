'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ReferenceLine, ResponsiveContainer } from 'recharts';
import SliderRow from '@/components/shared/SliderRow';
import MetricCard from '@/components/shared/MetricCard';
import { calcAnnualInterest, buildRefinanceTimeline } from '@/lib/calculations';
import { RefinanceState } from '@/types';

interface RefinanceSimulatorProps {
  state: RefinanceState;
  onChange: (state: RefinanceState) => void;
  compact?: boolean;
}

export default function RefinanceSimulator({ state, onChange, compact = false }: RefinanceSimulatorProps) {
  const { initialRate, refinanceRate, loanAmount } = state;

  const beforeInterest = calcAnnualInterest(loanAmount, initialRate / 100);
  const afterInterest = calcAnnualInterest(loanAmount, refinanceRate / 100);
  const costIncrease = afterInterest - beforeInterest;
  const timelineData = buildRefinanceTimeline(initialRate, refinanceRate, loanAmount);

  return (
    <div className="space-y-4">
      {!compact && (
        <div>
          <h2 className="text-base font-semibold text-slate-800 dark:text-slate-100 mb-1">5年後の崖：借換時コスト急騰</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">バルーン型ローンの借換リスクを視覚化します</p>
        </div>
      )}

      <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm border border-slate-100 dark:border-slate-700 print:hidden">
        <SliderRow label="当初金利" min={0.5} max={5.0} step={0.1} value={initialRate} unit="%" formatter={(v) => `${v.toFixed(1)}%`} onChange={(v) => onChange({ ...state, initialRate: v })} />
        <SliderRow label="5年後の借換金利" min={0.5} max={8.0} step={0.1} value={refinanceRate} unit="%" formatter={(v) => `${v.toFixed(1)}%`} onChange={(v) => onChange({ ...state, refinanceRate: v })} />
        <SliderRow label="借入額" min={1} max={20} step={0.5} value={loanAmount} unit="億円" formatter={(v) => `${v}億円`} onChange={(v) => onChange({ ...state, loanAmount: v })} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <MetricCard label="当初 年間金利負担" value={`${beforeInterest.toLocaleString()}万円`} note={`借入 ${loanAmount}億 × 金利 ${initialRate.toFixed(1)}%`} />
        <MetricCard label="借換後 年間金利負担" value={`${afterInterest.toLocaleString()}万円`} note={`借入 ${loanAmount}億 × 金利 ${refinanceRate.toFixed(1)}%`} />
        <MetricCard label="コスト増加額" value={`+${costIncrease.toLocaleString()}万円`} note="借換後の年間増加分" status="negative" />
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm border border-slate-100 dark:border-slate-700">
        <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-3">年間金利負担の推移（8年間）</h3>
        <ResponsiveContainer width="100%" height={compact ? 180 : 260}>
          <BarChart data={timelineData} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="year" tickFormatter={(v) => `${v}年目`} tick={{ fontSize: 11 }} stroke="#94a3b8" />
            <YAxis tickFormatter={(v) => `${v.toLocaleString()}万`} tick={{ fontSize: 11 }} stroke="#94a3b8" />
            <Tooltip
              formatter={(value) => [`${Number(value).toLocaleString()}万円`, '年間金利負担']}
              labelFormatter={(label) => `${label}年目`}
              contentStyle={{ backgroundColor: 'rgba(255,255,255,0.95)', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '12px' }}
            />
            <ReferenceLine x={5.5} stroke="#94a3b8" strokeDasharray="4 4" label={{ value: '借換', position: 'top', fontSize: 11, fill: '#94a3b8' }} />
            <Bar dataKey="interest" radius={[4, 4, 0, 0]} isAnimationActive={false}>
              {timelineData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.isPost ? '#ef4444' : '#3b82f6'} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="flex gap-4 justify-center mt-2 text-xs text-slate-400 dark:text-slate-500">
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-blue-500 inline-block" /> 1〜5年目</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-red-500 inline-block" /> 6〜8年目（借換後）</span>
        </div>
      </div>
    </div>
  );
}
