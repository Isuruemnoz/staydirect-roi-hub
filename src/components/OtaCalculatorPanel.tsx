import { RotateCcw } from 'lucide-react';
import {
  CalculatorInputs,
  formatCurrency,
  RoiMetrics,
} from '../utils/roiCalculator';

interface OtaCalculatorPanelProps {
  inputs: CalculatorInputs;
  metrics: RoiMetrics;
  onChange: (updated: CalculatorInputs) => void;
  onReset: () => void;
}

interface SliderControlProps {
  id: string;
  label: string;
  helperText: string;
  value: number;
  min: number;
  max: number;
  step: number;
  prefix?: string;
  suffix?: string;
  accent?: 'emerald' | 'blue';
  onValueChange: (val: number) => void;
}

function SliderControl({
  id,
  label,
  helperText,
  value,
  min,
  max,
  step,
  prefix = '',
  suffix = '',
  accent = 'emerald',
  onValueChange,
}: SliderControlProps) {
  const clamped = Math.min(max, Math.max(min, value));
  const pct = max > min ? ((clamped - min) / (max - min)) * 100 : 0;
  const fillColor = accent === 'emerald' ? '#10b981' : '#38bdf8';
  const trackBg = `linear-gradient(to right, ${fillColor} 0%, ${fillColor} ${pct}%, #334155 ${pct}%, #334155 100%)`;

  return (
    <div className="space-y-2.5">
      <div className="flex items-baseline justify-between gap-4">
        <div>
          <label
            htmlFor={`${id}-range`}
            className="block text-sm font-medium text-slate-100"
          >
            {label}
          </label>
          <p className="text-xs text-slate-400">{helperText}</p>
        </div>
        <div className="flex items-center rounded-lg border border-slate-700/80 bg-slate-950/60 px-2.5 py-1 focus-within:border-sky-400">
          {prefix && (
            <span className="font-mono-tabular text-xs text-slate-400 mr-1" aria-hidden="true">
              {prefix}
            </span>
          )}
          <input
            id={`${id}-number`}
            aria-label={`${label} numeric input`}
            type="number"
            min={0}
            max={max * 10}
            step={step}
            value={Number.isNaN(value) ? 0 : value}
            onChange={(e) => {
              const parsed = parseFloat(e.target.value);
              onValueChange(Number.isNaN(parsed) ? 0 : Math.max(0, parsed));
            }}
            className="font-mono-tabular w-20 bg-transparent text-right text-sm font-semibold text-white focus:outline-none"
          />
          {suffix && (
            <span className="font-mono-tabular text-xs text-slate-400 ml-1" aria-hidden="true">
              {suffix}
            </span>
          )}
        </div>
      </div>

      <input
        id={`${id}-range`}
        type="range"
        min={min}
        max={max}
        step={step}
        value={clamped}
        onChange={(e) => onValueChange(parseFloat(e.target.value))}
        style={{ background: trackBg }}
        className={`stay-slider w-full ${accent === 'blue' ? 'stay-slider-blue' : ''}`}
      />
    </div>
  );
}

export function OtaCalculatorPanel({
  inputs,
  metrics,
  onChange,
  onReset,
}: OtaCalculatorPanelProps) {
  const updateField = <K extends keyof CalculatorInputs>(
    field: K,
    value: CalculatorInputs[K]
  ) => {
    onChange({
      ...inputs,
      [field]: value,
    });
  };

  return (
    <section
      id="calculator"
      aria-labelledby="calculator-heading"
      className="flex h-full flex-col justify-between rounded-xl border border-slate-700/60 bg-slate-900/70 backdrop-blur-xl p-6 shadow-xl shadow-slate-950/30"
    >
      <div>
      <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2
            id="calculator-heading"
            className="font-display text-lg font-semibold text-white"
          >
            OTA Savings Calculator
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            Model your room rate, OTA dependency, and Meta Ads shift target.
          </p>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700/80 bg-slate-800/60 px-3 py-1.5 text-xs font-medium text-slate-200 transition-colors hover:bg-slate-800 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 whitespace-nowrap shrink-0 cursor-pointer"
        >
          <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Reset</span>
        </button>
      </div>

      <div className="mt-6 space-y-6">
        <SliderControl
          id="adr"
          label="Average Room Rate (ADR)"
          helperText="Blended nightly rate across room tiers"
          value={inputs.averageRoomRate}
          min={80}
          max={1500}
          step={10}
          prefix="$"
          accent="emerald"
          onValueChange={(v) => updateField('averageRoomRate', v)}
        />

        <SliderControl
          id="monthly-nights"
          label="Total Monthly Room Nights Booked"
          helperText="Total occupied room nights per month"
          value={inputs.monthlyRoomNights}
          min={20}
          max={900}
          step={5}
          suffix="nts"
          accent="emerald"
          onValueChange={(v) => updateField('monthlyRoomNights', v)}
        />

        <SliderControl
          id="ota-share"
          label="Current OTA Share"
          helperText="Bookings from Booking.com, Airbnb, or Expedia"
          value={inputs.currentOtaSharePct}
          min={0}
          max={100}
          step={1}
          suffix="%"
          accent="blue"
          onValueChange={(v) => updateField('currentOtaSharePct', Math.min(100, v))}
        />

        <SliderControl
          id="ota-commission"
          label="Average OTA Commission"
          helperText="Platform fee rate (standard 15%)"
          value={inputs.averageOtaCommissionPct}
          min={5}
          max={30}
          step={0.5}
          suffix="%"
          accent="blue"
          onValueChange={(v) => updateField('averageOtaCommissionPct', Math.min(100, v))}
        />

        <SliderControl
          id="direct-shift"
          label="Target Direct Booking Shift"
          helperText="Share of OTA bookings shifted to direct via Meta Ads"
          value={inputs.targetDirectShiftPct}
          min={0}
          max={100}
          step={1}
          suffix="%"
          accent="emerald"
          onValueChange={(v) => updateField('targetDirectShiftPct', Math.min(100, v))}
        />

        {/* Dedicated Monthly Meta Ad Spend Input */}
        <div className="border-t border-slate-800 pt-5 space-y-2.5">
          <div className="flex items-baseline justify-between gap-4">
            <div>
              <label
                htmlFor="meta-ad-spend"
                className="block text-sm font-medium text-slate-100"
              >
                Estimated Monthly Meta Ad Spend
              </label>
              <p className="text-xs text-slate-400">
                Retargeting &amp; direct-booking acquisition budget
              </p>
            </div>
            <div className="flex items-center rounded-lg border border-sky-500/40 bg-slate-950/80 px-3 py-1.5 focus-within:border-sky-400">
              <span className="font-mono-tabular text-sm text-sky-400 mr-1" aria-hidden="true">
                $
              </span>
              <input
                id="meta-ad-spend"
                type="number"
                min={0}
                max={50000}
                step={50}
                value={Number.isNaN(inputs.monthlyMetaAdSpend) ? 0 : inputs.monthlyMetaAdSpend}
                onChange={(e) => {
                  const parsed = parseFloat(e.target.value);
                  updateField('monthlyMetaAdSpend', Number.isNaN(parsed) ? 0 : Math.max(0, parsed));
                }}
                className="font-mono-tabular w-24 bg-transparent text-right text-sm font-semibold text-white focus:outline-none"
              />
            </div>
          </div>

          <input
            aria-label="Estimated Monthly Meta Ad Spend slider"
            type="range"
            min={0}
            max={10000}
            step={50}
            value={Math.min(10000, Math.max(0, inputs.monthlyMetaAdSpend))}
            onChange={(e) => updateField('monthlyMetaAdSpend', parseFloat(e.target.value))}
            style={{
              background: `linear-gradient(to right, #38bdf8 0%, #38bdf8 ${
                Math.min(100, (inputs.monthlyMetaAdSpend / 10000) * 100)
              }%, #334155 ${
                Math.min(100, (inputs.monthlyMetaAdSpend / 10000) * 100)
              }%, #334155 100%)`,
            }}
            className="stay-slider stay-slider-blue w-full"
          />
        </div>
      </div>
      </div>

      {/* Unboxed volume metadata strip */}
      <div className="mt-6 border-t border-slate-800 pt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400">
        <span>
          Gross Annual Revenue:{' '}
          <strong className="font-mono-tabular text-slate-200 font-semibold">
            {formatCurrency(metrics.annualGrossRevenue)}
          </strong>
        </span>
        <span aria-hidden="true">·</span>
        <span>
          Current OTA:{' '}
          <strong className="font-mono-tabular text-slate-200 font-semibold">
            {Math.round(metrics.currentOtaNights)} nts/mo
          </strong>
        </span>
        <span aria-hidden="true">·</span>
        <span>
          Shifted Direct:{' '}
          <strong className="font-mono-tabular text-emerald-400 font-semibold">
            {Math.round(metrics.shiftedDirectNightsMonthly)} nts/mo
          </strong>
        </span>
      </div>
    </section>
  );
}
