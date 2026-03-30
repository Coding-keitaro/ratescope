'use client';

import { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from 'recharts';
import SliderRow from '@/components/shared/SliderRow';
import MetricCard from '@/components/shared/MetricCard';
import StatusBadge from '@/components/shared/StatusBadge';
import { calcEquityYield, isPositiveLeverage } from '@/lib/calculations';

export default function LeverageSimulator() {
  const [borrowingRate, setBorrowingRate] = useState(1.5);
  const [ltv, setLtv] = useState(70);
  const [propertyCapRate, setPropertyCapRate] = useState(4.0);

  const ltvDecimal = ltv / 100;
  const equityYield = calcEquityYield(propertyCapRate, borrowingRate, ltvDecimal);
  const positive = isPositiveLeverage(propertyCapRate, borrowingRate);

  const chartData = [
    { name: '物件利回り', value: propertyCapRate, color: '#3b82f6' },
    { name: '借入コスト', value: borrowingRate, color: borrowingRate > propertyCapRate ? '#ef4444' : '#3b82f6' },
    { name: '自己資金利回り', value: Math.max(equityYield, 0), color: equityYield >= propertyCapRate ? '#22c55e' : equityYield > 0 ? '#3b82f6' : '#ef4444' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-base font-semibold text-slate-800 dark:text-slate-100 mb-1">
          レバレッジの正負
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          キャップレート vs 借入金利の大小がレバレッジの方向を決めます
        </p>
      </div>

      {/* スライダー */}
      <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm border border-slate-100 dark:border-slate-700">
        <SliderRow
          label="借入金利"
          min={0.5}
          max={7.0}
          step={0.1}
          value={borrowingRate}
          unit="%"
          formatter={(v) => `${v.toFixed(1)}%`}
          onChange={setBorrowingRate}
        />
        <SliderRow
          label="LTV（借入比率）"
          min={30}
          max={90}
          step={5}
          value={ltv}
          unit="%"
          formatter={(v) => `${v}%`}
          onChange={setLtv}
        />
        <SliderRow
          label="物件キャップレート"
          min={2.0}
          max={8.0}
          step={0.1}
          value={propertyCapRate}
          unit="%"
          formatter={(v) => `${v.toFixed(1)}%`}
          onChange={setPropertyCapRate}
        />
      </div>

      {/* メトリクスカード */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <MetricCard
          label="自己資金利回り"
          value={`${equityYield.toFixed(1)}%`}
          note={`LTV ${ltv}% 、Cap ${propertyCapRate.toFixed(1)}% 、金利 ${borrowingRate.toFixed(1)}%`}
          status={equityYield > propertyCapRate ? 'positive' : equityYield > 0 ? 'neutral' : 'negative'}
        />
        <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm border border-slate-100 dark:border-slate-700">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">
            レバレッジ判定
          </p>
          <StatusBadge positive={positive} />
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
            {positive
              ? `Cap ${propertyCapRate.toFixed(1)}% > 金利 ${borrowingRate.toFixed(1)}%`
              : `Cap ${propertyCapRate.toFixed(1)}% < 金利 ${borrowingRate.toFixed(1)}%`}
          </p>
        </div>
      </div>

      {/* グラフ */}
      <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm border border-slate-100 dark:border-slate-700">
        <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-3">
          利回り比較
        </h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
            <XAxis
              type="number"
              tickFormatter={(v) => `${v}%`}
              tick={{ fontSize: 12 }}
              stroke="#94a3b8"
            />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fontSize: 12 }}
              stroke="#94a3b8"
              width={90}
            />
            <Tooltip
              formatter={(value) => [`${Number(value).toFixed(1)}%`]}
              contentStyle={{
                backgroundColor: 'rgba(255,255,255,0.95)',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '12px',
              }}
            />
            <Bar dataKey="value" radius={[0, 4, 4, 0]} isAnimationActive={false}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
