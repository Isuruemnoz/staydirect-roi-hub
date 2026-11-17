export interface CalculatorInputs {
  averageRoomRate: number; // $ per night
  monthlyRoomNights: number; // total nights booked per month
  currentOtaSharePct: number; // 0 - 100
  averageOtaCommissionPct: number; // 0 - 35 (default 15)
  targetDirectShiftPct: number; // 0 - 100 (% of OTA nights shifted to direct)
  monthlyMetaAdSpend: number; // $ per month
}

export interface RoiMetrics {
  // Monthly baseline
  monthlyGrossRevenue: number;
  currentOtaNights: number;
  currentDirectNights: number;
  currentMonthlyOtaFees: number;
  currentMonthlyNetRevenue: number;

  // Annual baseline
  annualGrossRevenue: number;
  annualCurrentOtaFees: number;
  annualCurrentNetRevenue: number;

  // Optimized direct strategy
  shiftedDirectNightsMonthly: number;
  shiftedDirectRevenueMonthly: number;
  shiftedDirectRevenueAnnual: number;
  remainingOtaNightsMonthly: number;
  optimizedMonthlyOtaFees: number;
  optimizedAnnualOtaFees: number;
  annualMetaAdSpend: number;
  optimizedMonthlyNetRevenue: number;
  optimizedAnnualNetRevenue: number;

  // Headline KPI metrics
  annualOtaCommissionSaved: number;
  monthlyOtaCommissionSaved: number;
  netDirectRevenueGainedAnnual: number;
  netDirectRevenueGainedMonthly: number;
  netBottomLineUpliftAnnual: number;
  projectedAdRoas: number | null; // null if ad spend is 0
  breakEvenDirectBookingsNeeded: number;
  commissionBreakEvenBookings: number;
}

export interface PropertyPreset {
  id: 'boutique-hotel' | 'luxury-villa' | 'coastal-resort';
  label: string;
  subtitle: string;
  inputs: CalculatorInputs;
}

export const DEFAULT_CALCULATOR_INPUTS: CalculatorInputs = {
  averageRoomRate: 340,
  monthlyRoomNights: 210,
  currentOtaSharePct: 65,
  averageOtaCommissionPct: 15,
  targetDirectShiftPct: 35,
  monthlyMetaAdSpend: 1650,
};

export const PROPERTY_PRESETS: PropertyPreset[] = [
  {
    id: 'boutique-hotel',
    label: 'Boutique Hotel',
    subtitle: '18-suite urban sanctuary',
    inputs: DEFAULT_CALCULATOR_INPUTS,
  },
  {
    id: 'luxury-villa',
    label: 'Luxury Villa',
    subtitle: 'Private multi-bedroom estate',
    inputs: {
      averageRoomRate: 850,
      monthlyRoomNights: 68,
      currentOtaSharePct: 72,
      averageOtaCommissionPct: 15,
      targetDirectShiftPct: 40,
      monthlyMetaAdSpend: 2200,
    },
  },
  {
    id: 'coastal-resort',
    label: 'Coastal Resort',
    subtitle: '42-key oceanfront retreat',
    inputs: {
      averageRoomRate: 460,
      monthlyRoomNights: 520,
      currentOtaSharePct: 58,
      averageOtaCommissionPct: 17,
      targetDirectShiftPct: 30,
      monthlyMetaAdSpend: 3800,
    },
  },
];

function clampNonNegative(val: number): number {
  if (!Number.isFinite(val) || val < 0) return 0;
  return val;
}

function clampPct(val: number, max = 100): number {
  if (!Number.isFinite(val) || val < 0) return 0;
  if (val > max) return max;
  return val;
}

export function calculateRoiMetrics(rawInputs: CalculatorInputs): RoiMetrics {
  const adr = clampNonNegative(rawInputs.averageRoomRate);
  const monthlyNights = clampNonNegative(rawInputs.monthlyRoomNights);
  const otaSharePct = clampPct(rawInputs.currentOtaSharePct, 100);
  const otaCommissionPct = clampPct(rawInputs.averageOtaCommissionPct, 100);
  const directShiftPct = clampPct(rawInputs.targetDirectShiftPct, 100);
  const monthlyAdSpend = clampNonNegative(rawInputs.monthlyMetaAdSpend);

  // Baseline monthly
  const monthlyGrossRevenue = adr * monthlyNights;
  const currentOtaNights = monthlyNights * (otaSharePct / 100);
  const currentDirectNights = monthlyNights - currentOtaNights;
  const currentMonthlyOtaFees = currentOtaNights * adr * (otaCommissionPct / 100);
  const currentMonthlyNetRevenue = monthlyGrossRevenue - currentMonthlyOtaFees;

  // Baseline annual
  const annualGrossRevenue = monthlyGrossRevenue * 12;
  const annualCurrentOtaFees = currentMonthlyOtaFees * 12;
  const annualCurrentNetRevenue = currentMonthlyNetRevenue * 12;

  // Optimized Direct Strategy
  const shiftedDirectNightsMonthly = currentOtaNights * (directShiftPct / 100);
  const shiftedDirectRevenueMonthly = shiftedDirectNightsMonthly * adr;
  const shiftedDirectRevenueAnnual = shiftedDirectRevenueMonthly * 12;

  const remainingOtaNightsMonthly = currentOtaNights - shiftedDirectNightsMonthly;
  const optimizedMonthlyOtaFees = remainingOtaNightsMonthly * adr * (otaCommissionPct / 100);
  const optimizedAnnualOtaFees = optimizedMonthlyOtaFees * 12;

  const annualMetaAdSpend = monthlyAdSpend * 12;

  // Net retained revenue under optimized direct strategy = Gross Revenue - Remaining OTA Fees - Ad Spend
  const optimizedMonthlyNetRevenue = monthlyGrossRevenue - optimizedMonthlyOtaFees - monthlyAdSpend;
  const optimizedAnnualNetRevenue = optimizedMonthlyNetRevenue * 12;

  // Headline KPIs
  const monthlyOtaCommissionSaved = currentMonthlyOtaFees - optimizedMonthlyOtaFees;
  const annualOtaCommissionSaved = monthlyOtaCommissionSaved * 12;

  // Net Direct Revenue Gained: Direct channel booking revenue generated minus ad spend invested
  const netDirectRevenueGainedMonthly = shiftedDirectRevenueMonthly - monthlyAdSpend;
  const netDirectRevenueGainedAnnual = netDirectRevenueGainedMonthly * 12;

  // Bottom-line profit uplift vs current strategy (Commission saved minus ad spend)
  const netBottomLineUpliftAnnual = annualOtaCommissionSaved - annualMetaAdSpend;

  // Projected Ad ROAS = Direct Booking Revenue Generated / Monthly Meta Ad Spend
  const projectedAdRoas = monthlyAdSpend > 0 ? shiftedDirectRevenueMonthly / monthlyAdSpend : null;

  // Break-Even Direct Bookings Needed per month to cover Meta Ad Spend at current ADR
  const breakEvenDirectBookingsNeeded =
    adr > 0 && monthlyAdSpend > 0 ? Math.ceil(monthlyAdSpend / adr) : 0;

  // Commission-only break-even bookings (nights needed so saved commission alone covers ad spend)
  const commissionPerNight = adr * (otaCommissionPct / 100);
  const commissionBreakEvenBookings =
    commissionPerNight > 0 && monthlyAdSpend > 0
      ? Math.ceil(monthlyAdSpend / commissionPerNight)
      : 0;

  return {
    monthlyGrossRevenue,
    currentOtaNights,
    currentDirectNights,
    currentMonthlyOtaFees,
    currentMonthlyNetRevenue,
    annualGrossRevenue,
    annualCurrentOtaFees,
    annualCurrentNetRevenue,
    shiftedDirectNightsMonthly,
    shiftedDirectRevenueMonthly,
    shiftedDirectRevenueAnnual,
    remainingOtaNightsMonthly,
    optimizedMonthlyOtaFees,
    optimizedAnnualOtaFees,
    annualMetaAdSpend,
    optimizedMonthlyNetRevenue,
    optimizedAnnualNetRevenue,
    annualOtaCommissionSaved,
    monthlyOtaCommissionSaved,
    netDirectRevenueGainedAnnual,
    netDirectRevenueGainedMonthly,
    netBottomLineUpliftAnnual,
    projectedAdRoas,
    breakEvenDirectBookingsNeeded,
    commissionBreakEvenBookings,
  };
}

export function formatCurrency(amount: number): string {
  const abs = Math.abs(Math.round(amount));
  const formatted = abs.toLocaleString('en-US');
  return amount < 0 ? `-$${formatted}` : `$${formatted}`;
}

export function formatCompactCurrency(amount: number): string {
  const abs = Math.abs(amount);
  const sign = amount < 0 ? '-' : '';
  if (abs >= 1_000_000) {
    return `${sign}$${(abs / 1_000_000).toFixed(2)}M`;
  }
  if (abs >= 10_000) {
    return `${sign}$${Math.round(abs / 1_000)}k`;
  }
  return formatCurrency(amount);
}

export function formatRoas(roas: number | null): string {
  if (roas === null) return 'N/A';
  return `${roas.toFixed(1)}x`;
}
