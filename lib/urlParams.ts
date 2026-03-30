import { TabId, AllSimulatorStates } from '@/types';

export interface AppState {
  tab: TabId;
  propertyName: string;
  compareMode: boolean;
  stateA: AllSimulatorStates;
  stateB: AllSimulatorStates;
}

export const DEFAULTS: AllSimulatorStates = {
  caprate: { interestRate: 1.5, annualNOI: 1000 },
  leverage: { borrowingRate: 1.5, ltv: 70, propertyCapRate: 4.0 },
  refinance: { initialRate: 1.0, refinanceRate: 4.5, loanAmount: 5 },
  dscr: { noi: 1200, loanAmount: 5, loanRate: 2.0 },
};

export const DEFAULT_APP_STATE: AppState = {
  tab: 'caprate',
  propertyName: '',
  compareMode: false,
  stateA: DEFAULTS,
  stateB: DEFAULTS,
};

function n(params: URLSearchParams, key: string, def: number): number {
  const v = params.get(key);
  return v !== null ? parseFloat(v) : def;
}

export function parseUrlState(search: string): AppState {
  const p = new URLSearchParams(search);
  const d = DEFAULTS;

  return {
    tab: (p.get('tab') as TabId) || 'caprate',
    propertyName: p.has('pn') ? decodeURIComponent(p.get('pn')!) : '',
    compareMode: p.get('cmp') === '1',
    stateA: {
      caprate: {
        interestRate: n(p, 'cr_ir', d.caprate.interestRate),
        annualNOI: n(p, 'cr_noi', d.caprate.annualNOI),
      },
      leverage: {
        borrowingRate: n(p, 'lv_br', d.leverage.borrowingRate),
        ltv: n(p, 'lv_ltv', d.leverage.ltv),
        propertyCapRate: n(p, 'lv_cap', d.leverage.propertyCapRate),
      },
      refinance: {
        initialRate: n(p, 'rf_ir', d.refinance.initialRate),
        refinanceRate: n(p, 'rf_rr', d.refinance.refinanceRate),
        loanAmount: n(p, 'rf_la', d.refinance.loanAmount),
      },
      dscr: {
        noi: n(p, 'dc_noi', d.dscr.noi),
        loanAmount: n(p, 'dc_la', d.dscr.loanAmount),
        loanRate: n(p, 'dc_lr', d.dscr.loanRate),
      },
    },
    stateB: {
      caprate: {
        interestRate: n(p, 'b_cr_ir', d.caprate.interestRate),
        annualNOI: n(p, 'b_cr_noi', d.caprate.annualNOI),
      },
      leverage: {
        borrowingRate: n(p, 'b_lv_br', d.leverage.borrowingRate),
        ltv: n(p, 'b_lv_ltv', d.leverage.ltv),
        propertyCapRate: n(p, 'b_lv_cap', d.leverage.propertyCapRate),
      },
      refinance: {
        initialRate: n(p, 'b_rf_ir', d.refinance.initialRate),
        refinanceRate: n(p, 'b_rf_rr', d.refinance.refinanceRate),
        loanAmount: n(p, 'b_rf_la', d.refinance.loanAmount),
      },
      dscr: {
        noi: n(p, 'b_dc_noi', d.dscr.noi),
        loanAmount: n(p, 'b_dc_la', d.dscr.loanAmount),
        loanRate: n(p, 'b_dc_lr', d.dscr.loanRate),
      },
    },
  };
}

export function buildUrlSearch(state: AppState): string {
  const p = new URLSearchParams();
  p.set('tab', state.tab);
  if (state.propertyName) p.set('pn', encodeURIComponent(state.propertyName));
  if (state.compareMode) p.set('cmp', '1');

  const a = state.stateA;
  p.set('cr_ir', a.caprate.interestRate.toString());
  p.set('cr_noi', a.caprate.annualNOI.toString());
  p.set('lv_br', a.leverage.borrowingRate.toString());
  p.set('lv_ltv', a.leverage.ltv.toString());
  p.set('lv_cap', a.leverage.propertyCapRate.toString());
  p.set('rf_ir', a.refinance.initialRate.toString());
  p.set('rf_rr', a.refinance.refinanceRate.toString());
  p.set('rf_la', a.refinance.loanAmount.toString());
  p.set('dc_noi', a.dscr.noi.toString());
  p.set('dc_la', a.dscr.loanAmount.toString());
  p.set('dc_lr', a.dscr.loanRate.toString());

  const b = state.stateB;
  p.set('b_cr_ir', b.caprate.interestRate.toString());
  p.set('b_cr_noi', b.caprate.annualNOI.toString());
  p.set('b_lv_br', b.leverage.borrowingRate.toString());
  p.set('b_lv_ltv', b.leverage.ltv.toString());
  p.set('b_lv_cap', b.leverage.propertyCapRate.toString());
  p.set('b_rf_ir', b.refinance.initialRate.toString());
  p.set('b_rf_rr', b.refinance.refinanceRate.toString());
  p.set('b_rf_la', b.refinance.loanAmount.toString());
  p.set('b_dc_noi', b.dscr.noi.toString());
  p.set('b_dc_la', b.dscr.loanAmount.toString());
  p.set('b_dc_lr', b.dscr.loanRate.toString());

  return p.toString();
}
