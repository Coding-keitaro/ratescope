/**
 * RateScope — 全計算ロジック（純粋関数）
 * UIコンポーネントから直接この関数群を呼び出すこと
 */

// ─── Tab 01: 金利→キャップレート→物件価格 ───────────────────────────

/** 要求キャップレートを計算する（金利 + リスクプレミアム2%）*/
export function calcCapRate(interestRate: number): number {
  return interestRate + 2.0;
}

/** 物件理論価格を計算する @returns 万円 */
export function calcPropertyValue(noi: number, capRate: number): number {
  return noi / (capRate / 100);
}

/** 基準値（金利1.5%時点）からの価格変化率 @returns % */
export function calcPriceChange(currentValue: number, baseValue: number): number {
  return ((currentValue - baseValue) / baseValue) * 100;
}

/** 金利帯全体の価格推移データを生成する */
export function buildCapRateCurve(noi: number): { rate: number; value: number }[] {
  const points: { rate: number; value: number }[] = [];
  for (let r = 0.5; r <= 7.0; r = Math.round((r + 0.1) * 10) / 10) {
    const cap = calcCapRate(r);
    const val = calcPropertyValue(noi, cap) / 10000; // 億円換算
    points.push({ rate: r, value: Math.round(val * 10) / 10 });
  }
  return points;
}

// ─── Tab 02: レバレッジの正負 ────────────────────────────────────────

/** 自己資金利回りを計算する @param ltv 0〜1の小数 @returns % */
export function calcEquityYield(
  capRate: number,
  borrowingRate: number,
  ltv: number
): number {
  return (capRate - borrowingRate * ltv) / (1 - ltv);
}

/** 正のレバレッジかどうかを判定する */
export function isPositiveLeverage(capRate: number, borrowingRate: number): boolean {
  return capRate > borrowingRate;
}

// ─── Tab 03: 5年後の崖 ───────────────────────────────────────────────

/**
 * 年間金利負担を計算する
 * @param loanAmountOku 借入額（億円）
 * @param rate 金利（小数：0.01 = 1%）
 * @returns 年間金利負担（万円）
 */
export function calcAnnualInterest(loanAmountOku: number, rate: number): number {
  return loanAmountOku * rate * 10000; // 1億 = 10000万
}

/** 借換タイムラインデータを生成する */
export function buildRefinanceTimeline(
  initialRate: number,
  refinanceRate: number,
  loanAmountOku: number
): { year: number; interest: number; isPost: boolean }[] {
  const before = calcAnnualInterest(loanAmountOku, initialRate / 100);
  const after = calcAnnualInterest(loanAmountOku, refinanceRate / 100);
  return [1, 2, 3, 4, 5, 6, 7, 8].map((year) => ({
    year,
    interest: year <= 5 ? before : after,
    isPost: year > 5,
  }));
}

// ─── Tab 04: DSCR計算機 ──────────────────────────────────────────────

/** DSCRの融資クリア基準 */
export const DSCR_THRESHOLD = 1.2;

/** DSCRを計算する */
export function calcDSCR(noi: number, annualDebtService: number): number {
  if (annualDebtService === 0) return 0;
  return noi / annualDebtService;
}

/** DSCRステータスを返す */
export function getDscrStatus(dscr: number): 'safe' | 'warning' | 'danger' {
  if (dscr >= 1.4) return 'safe';
  if (dscr >= 1.2) return 'warning';
  return 'danger';
}

/**
 * 年間返済額（利息のみ簡易計算）
 * @param loanAmountOku 借入額（億円）
 * @param rate 金利（%）
 * @returns 万円
 */
export function calcAnnualDebtService(loanAmountOku: number, rate: number): number {
  return loanAmountOku * (rate / 100) * 10000;
}
