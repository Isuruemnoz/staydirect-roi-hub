import { TrendingUp, AlertTriangle, CheckCircle2 } from 'lucide-react';
import {
  CalculatorInputs,
  formatCurrency,
  formatRoas,
  RoiMetrics,
} from '../utils/roiCalculator';
import { StrategyComparisonChart } from './StrategyComparisonChart';

interface RoiDashboardPanelProps {
  inputs: CalculatorInputs;
  metrics: RoiMetrics;
}

export function RoiDashboardPanel({ inputs, metrics }: RoiDashboardPanelProps) {
  const roasValue = metrics.projectedAdRoas;
  const roasStatus =
    roasValue === null
      ? { label: 'No Ad Spend Set', tone: 'text-slate-400', icon: CheckCircle2 }
      : roasValue >= 4
        ? { label: 'High-Efficiency Direct Return', tone: 'text-emerald-400', icon: TrendingUp }
        : roasValue >= 1
          ? { label: 'Positive Direct Return', tone: 'text-sky-400', icon: CheckCircle2 }
          : { label: 'Below 1.0x — Adjust Spend or Shift', tone: 'text-amber-400', icon: AlertTriangle };

  const RoasIcon = roasStatus.icon;
  const netDirectPositive = metrics.netDirectRevenueGainedAnnual >= 0;

  return (
    <section
      id="roi-dashboard"
      aria-labelledby="roi-dashboard-heading"
      className="flex h-full flex-col gap-5"
    >
      <h2 id="roi-dashboard-heading" className="sr-only">
        Live ROI and Savings Dashboard
      </h2>

      {/* 4 Big Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Card 1: Annual OTA Commission Saved */}
        <article
          data-testid="metric-ota-saved"
          className="rounded-xl border border-slate-700/60 bg-slate-900/70 backdrop-blur-xl p-5 shadow-lg shadow-slate-950/25"
        >
          <p className="text-xs font-medium text-slate-400">
            Annual OTA Commission Saved
          </p>
          <p className="font-mono-tabular mt-2 text-3xl font-bold tracking-tight text-emerald-400">
            {formatCurrency(metrics.annualOtaCommissionSaved)}
          </p>
          <p className="mt-2 text-xs text-slate-400">
            <span className="font-mono-tabular text-slate-200 font-medium">
              {formatCurrency(metrics.monthlyOtaCommissionSaved)}/mo
            </span>{' '}
            retained at {inputs.averageOtaCommissionPct}% avg fee
          </p>
        </article>

        {/* Card 2: Net Direct Revenue Gained */}
        <article
          data-testid="metric-net-direct-revenue"
          className="rounded-xl border border-slate-700/60 bg-slate-900/70 backdrop-blur-xl p-5 shadow-lg shadow-slate-950/25"
        >
          <p className="text-xs font-medium text-slate-400">
            Net Direct Revenue Gained
          </p>
          <p
            className={`font-mono-tabular mt-2 text-3xl font-bold tracking-tight ${
              netDirectPositive ? 'text-white' : 'text-amber-400'
            }`}
          >
            {formatCurrency(metrics.netDirectRevenueGainedAnnual)}
          </p>
          <p className="mt-2 text-xs text-slate-400">
            <span className="font-mono-tabular text-slate-200 font-medium">
              {formatCurrency(metrics.netDirectRevenueGainedMonthly)}/mo
            </span>{' '}
            direct bookings net of ad spend
          </p>
        </article>

        {/* Card 3: Projected Ad ROAS */}
        <article
          data-testid="metric-projected-roas"
          className="rounded-xl border border-slate-700/60 bg-slate-900/70 backdrop-blur-xl p-5 shadow-lg shadow-slate-950/25"
        >
          <p className="text-xs font-medium text-slate-400">
            Projected Ad ROAS
          </p>
          <p className="font-mono-tabular mt-2 text-3xl font-bold tracking-tight text-sky-400">
            {formatRoas(metrics.projectedAdRoas)}
          </p>
          <p className={`mt-2 inline-flex items-center gap-1.5 text-xs font-medium ${roasStatus.tone}`}>
            <RoasIcon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span>{roasStatus.label}</span>
          </p>
        </article>

        {/* Card 4: Break-Even Direct Bookings Needed */}
        <article
          data-testid="metric-breakeven-bookings"
          className="rounded-xl border border-slate-700/60 bg-slate-900/70 backdrop-blur-xl p-5 shadow-lg shadow-slate-950/25"
        >
          <p className="text-xs font-medium text-slate-400">
            Break-Even Direct Bookings Needed
          </p>
          <p className="font-mono-tabular mt-2 text-3xl font-bold tracking-tight text-white">
            {metrics.breakEvenDirectBookingsNeeded}{' '}
            <span className="text-base font-medium text-slate-300">
              {metrics.breakEvenDirectBookingsNeeded === 1 ? 'night/mo' : 'nights/mo'}
            </span>
          </p>
          <p className="mt-2 text-xs text-slate-400">
            Covers {formatCurrency(inputs.monthlyMetaAdSpend)}/mo spend ·{' '}
            <span className="font-mono-tabular text-emerald-400 font-medium">
              {Math.round(metrics.shiftedDirectNightsMonthly)} projected
            </span>
          </p>
        </article>
      </div>

      {/* Visual Bar Chart */}
      <StrategyComparisonChart metrics={metrics} />
    </section>
  );
}
