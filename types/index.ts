/** SliderRow共通コンポーネントのProps */
export interface SliderRowProps {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  unit: string;
  formatter?: (v: number) => string;
  onChange: (value: number) => void;
}

/** MetricCard共通コンポーネントのProps */
export interface MetricCardProps {
  label: string;
  value: string;
  note?: string;
  status?: 'positive' | 'negative' | 'neutral';
}

/** StatusBadge共通コンポーネントのProps */
export interface StatusBadgeProps {
  positive: boolean;
  positiveLabel?: string;
  negativeLabel?: string;
}

/** タブの識別子 */
export type TabId = 'caprate' | 'leverage' | 'refinance' | 'dscr';

/** タブ定義 */
export interface TabDef {
  id: TabId;
  label: string;
  shortLabel: string;
}

// ─── シミュレーター別 State 型 ────────────────────────────────────────

export interface CapRateState {
  interestRate: number;
  annualNOI: number;
}

export interface LeverageState {
  borrowingRate: number;
  ltv: number;
  propertyCapRate: number;
}

export interface RefinanceState {
  initialRate: number;
  refinanceRate: number;
  loanAmount: number;
}

export interface DscrState {
  noi: number;
  loanAmount: number;
  loanRate: number;
}

export interface AllSimulatorStates {
  caprate: CapRateState;
  leverage: LeverageState;
  refinance: RefinanceState;
  dscr: DscrState;
}
