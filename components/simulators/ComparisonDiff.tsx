import { TabId, AllSimulatorStates } from '@/types';
import {
  calcCapRate, calcPropertyValue, calcPriceChange,
  calcEquityYield, isPositiveLeverage,
  calcAnnualInterest,
  calcDSCR, getDscrStatus, calcAnnualDebtService,
} from '@/lib/calculations';

interface DiffRow {
  label: string;
  valueA: string;
  valueB: string;
  diff: string;
  status: 'positive' | 'negative' | 'neutral';
}

function sign(n: number) { return n > 0 ? '+' : ''; }

function buildRows(tab: TabId, a: AllSimulatorStates, b: AllSimulatorStates): DiffRow[] {
  switch (tab) {
    case 'caprate': {
      const capA = calcCapRate(a.caprate.interestRate);
      const capB = calcCapRate(b.caprate.interestRate);
      const valA = calcPropertyValue(a.caprate.annualNOI, capA) / 10000;
      const valB = calcPropertyValue(b.caprate.annualNOI, capB) / 10000;
      const chgA = calcPriceChange(valA * 10000, calcPropertyValue(a.caprate.annualNOI, calcCapRate(1.5)));
      const chgB = calcPriceChange(valB * 10000, calcPropertyValue(b.caprate.annualNOI, calcCapRate(1.5)));
      const dCap = capB - capA;
      const dVal = valB - valA;
      const dChg = chgB - chgA;
      return [
        { label: '要求キャップレート', valueA: `${capA.toFixed(1)}%`, valueB: `${capB.toFixed(1)}%`, diff: `${sign(dCap)}${dCap.toFixed(1)}%`, status: dCap <= 0 ? 'positive' : 'negative' },
        { label: '物件理論価格', valueA: `${valA.toFixed(1)}億円`, valueB: `${valB.toFixed(1)}億円`, diff: `${sign(dVal)}${dVal.toFixed(1)}億円`, status: dVal >= 0 ? 'positive' : 'negative' },
        { label: '価格変化率（1.5%比）', valueA: `${sign(chgA)}${chgA.toFixed(1)}%`, valueB: `${sign(chgB)}${chgB.toFixed(1)}%`, diff: `${sign(dChg)}${dChg.toFixed(1)}%`, status: dChg >= 0 ? 'positive' : 'negative' },
      ];
    }
    case 'leverage': {
      const yA = calcEquityYield(a.leverage.propertyCapRate, a.leverage.borrowingRate, a.leverage.ltv / 100);
      const yB = calcEquityYield(b.leverage.propertyCapRate, b.leverage.borrowingRate, b.leverage.ltv / 100);
      const posA = isPositiveLeverage(a.leverage.propertyCapRate, a.leverage.borrowingRate);
      const posB = isPositiveLeverage(b.leverage.propertyCapRate, b.leverage.borrowingRate);
      const dY = yB - yA;
      return [
        { label: '自己資金利回り', valueA: `${yA.toFixed(1)}%`, valueB: `${yB.toFixed(1)}%`, diff: `${sign(dY)}${dY.toFixed(1)}%`, status: dY >= 0 ? 'positive' : 'negative' },
        { label: 'レバレッジ判定', valueA: posA ? '正のレバレッジ ✓' : '負のレバレッジ ✗', valueB: posB ? '正のレバレッジ ✓' : '負のレバレッジ ✗', diff: posA === posB ? '変化なし' : posB ? '正に改善' : '負に悪化', status: posA === posB ? 'neutral' : posB ? 'positive' : 'negative' },
      ];
    }
    case 'refinance': {
      const bfA = calcAnnualInterest(a.refinance.loanAmount, a.refinance.initialRate / 100);
      const bfB = calcAnnualInterest(b.refinance.loanAmount, b.refinance.initialRate / 100);
      const afA = calcAnnualInterest(a.refinance.loanAmount, a.refinance.refinanceRate / 100);
      const afB = calcAnnualInterest(b.refinance.loanAmount, b.refinance.refinanceRate / 100);
      const incA = afA - bfA;
      const incB = afB - bfB;
      const dBf = bfB - bfA;
      const dAf = afB - afA;
      const dInc = incB - incA;
      return [
        { label: '当初 年間金利', valueA: `${bfA.toLocaleString()}万円`, valueB: `${bfB.toLocaleString()}万円`, diff: `${sign(dBf)}${dBf.toLocaleString()}万円`, status: dBf <= 0 ? 'positive' : 'negative' },
        { label: '借換後 年間金利', valueA: `${afA.toLocaleString()}万円`, valueB: `${afB.toLocaleString()}万円`, diff: `${sign(dAf)}${dAf.toLocaleString()}万円`, status: dAf <= 0 ? 'positive' : 'negative' },
        { label: 'コスト増加額', valueA: `+${incA.toLocaleString()}万円`, valueB: `+${incB.toLocaleString()}万円`, diff: `${sign(dInc)}${dInc.toLocaleString()}万円`, status: dInc <= 0 ? 'positive' : 'negative' },
      ];
    }
    case 'dscr': {
      const debtA = calcAnnualDebtService(a.dscr.loanAmount, a.dscr.loanRate);
      const debtB = calcAnnualDebtService(b.dscr.loanAmount, b.dscr.loanRate);
      const dscrA = calcDSCR(a.dscr.noi, debtA);
      const dscrB = calcDSCR(b.dscr.noi, debtB);
      const stA = getDscrStatus(dscrA);
      const stB = getDscrStatus(dscrB);
      const labels: Record<string, string> = { safe: '余裕あり', warning: 'ギリギリ', danger: '融資困難' };
      const dDebt = debtB - debtA;
      const dDscr = dscrB - dscrA;
      return [
        { label: '年間返済額', valueA: `${Math.round(debtA).toLocaleString()}万円`, valueB: `${Math.round(debtB).toLocaleString()}万円`, diff: `${sign(dDebt)}${Math.round(dDebt).toLocaleString()}万円`, status: dDebt <= 0 ? 'positive' : 'negative' },
        { label: 'DSCR', valueA: dscrA.toFixed(2), valueB: dscrB.toFixed(2), diff: `${sign(dDscr)}${dDscr.toFixed(2)}`, status: dDscr >= 0 ? 'positive' : 'negative' },
        { label: '融資判定', valueA: labels[stA], valueB: labels[stB], diff: stA === stB ? '変化なし' : `${labels[stA]}→${labels[stB]}`, status: stA === stB ? 'neutral' : stB === 'safe' ? 'positive' : stB === 'danger' ? 'negative' : 'neutral' },
      ];
    }
  }
}

interface ComparisonDiffProps {
  tab: TabId;
  stateA: AllSimulatorStates;
  stateB: AllSimulatorStates;
}

export default function ComparisonDiff({ tab, stateA, stateB }: ComparisonDiffProps) {
  const rows = buildRows(tab, stateA, stateB);

  const diffColor = (status: DiffRow['status']) => {
    if (status === 'positive') return 'text-green-600 dark:text-green-400 font-bold';
    if (status === 'negative') return 'text-red-600 dark:text-red-400 font-bold';
    return 'text-slate-500 dark:text-slate-400';
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
      <div className="px-4 py-3 bg-slate-50 dark:bg-slate-700/50 border-b border-slate-100 dark:border-slate-700">
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">A / B 差分サマリー</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-700">
              <th className="text-left px-4 py-2 text-xs font-medium text-slate-500 dark:text-slate-400">指標</th>
              <th className="text-right px-4 py-2 text-xs font-medium text-blue-600 dark:text-blue-400">シナリオ A</th>
              <th className="text-right px-4 py-2 text-xs font-medium text-orange-500">シナリオ B</th>
              <th className="text-right px-4 py-2 text-xs font-medium text-slate-500 dark:text-slate-400">差分 (B−A)</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-b border-slate-50 dark:border-slate-700/50 last:border-0">
                <td className="px-4 py-2.5 text-slate-600 dark:text-slate-400 text-xs">{row.label}</td>
                <td className="px-4 py-2.5 text-right font-medium text-slate-800 dark:text-slate-200">{row.valueA}</td>
                <td className="px-4 py-2.5 text-right font-medium text-slate-800 dark:text-slate-200">{row.valueB}</td>
                <td className={`px-4 py-2.5 text-right ${diffColor(row.status)}`}>{row.diff}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
