'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceDot,
  ResponsiveContainer,
} from 'recharts';
import SliderRow from '@/components/shared/SliderRow';
import MetricCard from '@/components/shared/MetricCard';
import { calcCapRate, calcPropertyValue, calcPriceChange, buildCapRateCurve } from '@/lib/calculations';
import { CapRateState } from '@/types';

const BASE_RATE = 1.5;

interface CapRateSimulatorProps {
  state: CapRateState;
  onChange: (state: CapRateState) => void;
  compact?: boolean;
}

export default function CapRateSimulator({ state, onChange, compact = false }: CapRateSimulatorProps) {
  const { interestRate, annualNOI } = state;

  const currentCapRate = calcCapRate(interestRate);
  const currentValueMan = calcPropertyValue(annualNOI, currentCapRate);
  const currentValueOku = currentValueMan / 10000;
  const baseCapRate = calcCapRate(BASE_RATE);
  const baseValueMan = calcPropertyValue(annualNOI, baseCapRate);
  const priceChange = calcPriceChange(currentValueMan, baseValueMan);
  const chartData = buildCapRateCurve(annualNOI);

  return (
    <div className="space-y-4">
      {!compact && (
        <div>
          <h2 className="text-base font-semibold text-slate-800 dark:text-slate-100 mb-1">
            金利 → キャップレート → 物件価格の連鎖
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            金利が上がると物件価格がなぜ下がるかを直感的に理解できます
          </p>
        </div>
      )}

      <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm border border-slate-100 dark:border-slate-700 print:hidden">
        <SliderRow
          label="金利"
          min={0.5}
          max={7.0}
          step={0.1}
          value={interestRate}
          unit="%"
          formatter={(v) => `${v.toFixed(1)}%`}
          onChange={(v) => onChange({ ...state, interestRate: v })}
        />
        <SliderRow
          label="年間NOI"
          min={500}
          max={5000}
          step={100}
          value={annualNOI}
          unit="万円"
          formatter={(v) => `${v.toLocaleString()}万円`}
          onChange={(v) => onChange({ ...state, annualNOI: v })}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <MetricCard
          label="要求キャップレート"
          value={`${currentCapRate.toFixed(1)}%`}
          note={`金利 ${interestRate.toFixed(1)}% + リスクプレミアム 2.0%`}
        />
        <MetricCard
          label="物件理論価格"
          value={`${currentValueOku.toFixed(1)}億円`}
          note={`NOI ${annualNOI.toLocaleString()}万円 ÷ Cap ${currentCapRate.toFixed(1)}%`}
        />
        <MetricCard
          label="低金利時代（1.5%）との比較"
          value={`${priceChange >= 0 ? '+' : ''}${priceChange.toFixed(1)}%`}
          note={`基準価格 ${(baseValueMan / 10000).toFixed(1)}億円`}
          status={priceChange >= 0 ? 'positive' : 'negative'}
        />
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm border border-slate-100 dark:border-slate-700">
        <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-3">
          金利別 物件価格推移
        </h3>
        <ResponsiveContainer width="100%" height={compact ? 180 : 260}>
          <LineChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="rate" tickFormatter={(v) => `${v}%`} tick={{ fontSize: 11 }} stroke="#94a3b8" />
            <YAxis tickFormatter={(v) => `${v}億`} tick={{ fontSize: 11 }} stroke="#94a3b8" />
            <Tooltip
              formatter={(value) => [`${Number(value).toFixed(1)}億円`, '物件価格']}
              labelFormatter={(label) => `金利: ${label}%`}
              contentStyle={{ backgroundColor: 'rgba(255,255,255,0.95)', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '12px' }}
            />
            <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} dot={false} isAnimationActive={false} />
            <ReferenceDot x={interestRate} y={Math.round(currentValueOku * 10) / 10} r={6} fill="#ef4444" stroke="#fff" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 text-center">赤い点が現在の設定値</p>
      </div>
    </div>
  );
}
