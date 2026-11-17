import { useState } from 'react';
import { ArrowUpRight, AlertTriangle } from 'lucide-react';
import { formatCurrency, RoiMetrics } from '../utils/roiCalculator';

interface StrategyComparisonChartProps {
  metrics: RoiMetrics;
}

type Timeframe = 'annual' | 'monthly';

export function StrategyComparisonChart({ metrics }: StrategyComparisonChartProps) {
  const [timeframe, setTimeframe] = useState<Timeframe>('annual');
  const divisor = timeframe === 'annual' ? 1 : 12;

  const gross = metrics.annualGrossRevenue / divisor;
  const currentNet = metrics.annualCurrentNetRevenue / divisor;
  const currentOtaFees = metrics.annualCurrentOtaFees / divisor;

  const optimizedNet = Math.max(0, metrics.optimizedAnnualNetRevenue / divisor);
  const optimizedOtaFees = metrics.optimizedAnnualOtaFees / divisor;
  const adSpend = metrics.annualMetaAdSpend / divisor;

  const netUplift = metrics.netBottomLineUpliftAnnual / divisor;
  const isPositiveUplift = netUplift >= 0;

  // Max scale reference so bars compare on an exact proportional scale
  const maxTotal = Math.max(gross, optimizedNet + optimizedOtaFees + adSpend, 1);

  const currentNetPct = (currentNet / maxTotal) * 100;
  const currentOtaPct = (currentOtaFees / maxTotal) * 100;

  const optNetPct = (optimizedNet / maxTotal) * 100;
  const optAdPct = (adSpend / maxTotal) * 100;
  const optOtaPct = (optimizedOtaFees / maxTotal) * 100;

  const feeReductionPct =
    metrics.annualCurrentOtaFees > 0
      ? Math.round((metrics.annualOtaCommissionSaved / metrics.annualCurrentOtaFees) * 100)
      : 0;

  return (
    <div
      data-testid="strategy-comparison-chart"
      className="flex flex-1 flex-col justify-between rounded-xl border border-slate-700/60 bg-slate-900/70 backdrop-blur-xl p-6 shadow-xl shadow-slate-950/30"
    >
      <div>
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h3 className="font-display text-base font-semibold text-white">
            Strategy Revenue Comparison
          </h3>
          <p className="mt-0.5 text-xs text-slate-400">
            Current OTA-heavy channel mix vs. direct booking strategy
          </p>
        </div>

        {/* Interactive segmented control */}
        <div
          role="group"
          aria-label="Chart timeframe"
          className="flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-950/70 p-1"
        >
          <button
            type="button"
            onClick={() => setTimeframe('annual')}
            className={`rounded-md px-3 py-1 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              timeframe === 'annual'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Annual
          </button>
          <button
            type="button"
            onClick={() => setTimeframe('monthly')}
            className={`rounded-md px-3 py-1 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              timeframe === 'monthly'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Monthly
          </button>
        </div>
      </div>

      {/* Visual comparison bars */}
      <div className="mt-6 space-y-6">
        {/* Bar 1: Current Revenue (High OTA Fees) */}
        <div className="space-y-2">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <span className="text-sm font-medium text-slate-200">
              Current Revenue (High OTA Fees)
            </span>
            <div className="flex items-center gap-3 text-xs">
              <span className="text-slate-400">
                Net Kept:{' '}
                <strong className="font-mono-tabular text-slate-100">
                  {formatCurrency(currentNet)}
                </strong>
              </span>
              <span aria-hidden="true" className="text-slate-600">
                ·
              </span>
              <span className="text-rose-400">
                OTA Fees:{' '}
                <strong className="font-mono-tabular">
                  -{formatCurrency(currentOtaFees)}
                </strong>
              </span>
            </div>
          </div>

          <div
            className="flex h-10 w-full overflow-hidden rounded-lg border border-slate-800 bg-slate-950/70"
            role="img"
            aria-label={`Current Revenue: ${formatCurrency(currentNet)} net retained, ${formatCurrency(currentOtaFees)} lost to OTA fees`}
          >
            <div
              style={{ width: `${currentNetPct}%` }}
              className="flex items-center bg-slate-600/80 px-3 transition-all duration-200"
            >
              {currentNetPct > 22 && (
                <span className="font-mono-tabular text-xs font-medium text-white truncate">
                  {formatCurrency(currentNet)}
                </span>
              )}
            </div>
            <div
              style={{ width: `${currentOtaPct}%` }}
              className="flex items-center justify-end bg-rose-500/75 px-2.5 transition-all duration-200"
            >
              {currentOtaPct > 12 && (
                <span className="font-mono-tabular text-xs font-medium text-white truncate">
                  -{formatCurrency(currentOtaFees)}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Bar 2: Optimized Direct Strategy */}
        <div className="space-y-2">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <span className="text-sm font-medium text-emerald-300">
              Optimized Direct Strategy
            </span>
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <span className="text-emerald-400">
                Net Kept:{' '}
                <strong className="font-mono-tabular">
                  {formatCurrency(metrics.optimizedAnnualNetRevenue / divisor)}
                </strong>
              </span>
              <span aria-hidden="true" className="text-slate-600">
                ·
              </span>
              <span className="text-sky-400">
                Meta Ads:{' '}
                <strong className="font-mono-tabular">
                  {formatCurrency(adSpend)}
                </strong>
              </span>
              <span aria-hidden="true" className="text-slate-600">
                ·
              </span>
              <span className="text-rose-300/90">
                OTA Fees:{' '}
                <strong className="font-mono-tabular">
                  -{formatCurrency(optimizedOtaFees)}
                </strong>
              </span>
            </div>
          </div>

          <div
            className="flex h-10 w-full overflow-hidden rounded-lg border border-slate-700/80 bg-slate-950/70"
            role="img"
            aria-label={`Optimized Direct Strategy: ${formatCurrency(metrics.optimizedAnnualNetRevenue / divisor)} net retained, ${formatCurrency(adSpend)} Meta ad spend, ${formatCurrency(optimizedOtaFees)} remaining OTA fees`}
          >
            <div
              style={{ width: `${optNetPct}%` }}
              className="flex items-center bg-emerald-500/90 px-3 transition-all duration-200"
            >
              {optNetPct > 22 && (
                <span className="font-mono-tabular text-xs font-semibold text-slate-950 truncate">
                  {formatCurrency(metrics.optimizedAnnualNetRevenue / divisor)}
                </span>
              )}
            </div>
            <div
              style={{ width: `${optAdPct}%` }}
              className="flex items-center justify-center bg-sky-400/90 px-1.5 transition-all duration-200"
            >
              {optAdPct > 10 && (
                <span className="font-mono-tabular text-[11px] font-semibold text-slate-950 truncate">
                  {formatCurrency(adSpend)}
                </span>
              )}
            </div>
            <div
              style={{ width: `${optOtaPct}%` }}
              className="flex items-center justify-end bg-rose-500/55 px-2.5 transition-all duration-200"
            >
              {optOtaPct > 12 && (
                <span className="font-mono-tabular text-xs font-medium text-white truncate">
                  -{formatCurrency(optimizedOtaFees)}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Chart legend */}
      <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-sm bg-slate-600/80" aria-hidden="true" />
          <span>Current Net Revenue</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-sm bg-emerald-500/90" aria-hidden="true" />
          <span>Optimized Net Revenue</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-sm bg-sky-400/90" aria-hidden="true" />
          <span>Meta Ad Spend</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-sm bg-rose-500/75" aria-hidden="true" />
          <span>OTA Commission Fees</span>
        </div>
      </div>

      {/* Bottom-line impact summary row */}
      </div>
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-slate-800 pt-4 text-xs">
        <div className="flex items-center gap-2">
          {isPositiveUplift ? (
            <>
              <ArrowUpRight className="h-4 w-4 text-emerald-400 shrink-0" aria-hidden="true" />
              <span className="text-slate-300">
                Net Profit Uplift (Commission Saved minus Ad Spend):
                <strong className="ml-1.5 font-mono-tabular text-emerald-400 font-semibold">
                  +{formatCurrency(netUplift)}/{timeframe === 'annual' ? 'yr' : 'mo'}
                </strong>
              </span>
            </>
          ) : (
            <>
              <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0" aria-hidden="true" />
              <span className="text-slate-300">
                Commission Savings vs. Ad Spend Deficit:
                <strong className="ml-1.5 font-mono-tabular text-amber-400 font-semibold">
                  {formatCurrency(netUplift)}/{timeframe === 'annual' ? 'yr' : 'mo'}
                </strong>
              </span>
            </>
          )}
        </div>

        <span className="text-slate-400">
          OTA Fee Leakage Reduced by
          <strong className="ml-1.5 font-mono-tabular text-sky-400 font-semibold">
            {feeReductionPct}%
          </strong>
        </span>
      </div>
    </div>
  );
}
