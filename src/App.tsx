import { useMemo, useState } from 'react';
import { Header } from './components/Header';
import { OtaCalculatorPanel } from './components/OtaCalculatorPanel';
import { RoiDashboardPanel } from './components/RoiDashboardPanel';
import { WhatsAppConciergeSection } from './components/WhatsAppConciergeSection';
import {
  calculateRoiMetrics,
  CalculatorInputs,
  DEFAULT_CALCULATOR_INPUTS,
  formatCurrency,
  formatRoas,
  PROPERTY_PRESETS,
  PropertyPreset,
} from './utils/roiCalculator';

export default function App() {
  const [inputs, setInputs] = useState<CalculatorInputs>(DEFAULT_CALCULATOR_INPUTS);
  const [activePresetId, setActivePresetId] = useState<PropertyPreset['id'] | 'custom'>(
    'boutique-hotel'
  );
  const [summaryCopied, setSummaryCopied] = useState(false);

  const metrics = useMemo(() => calculateRoiMetrics(inputs), [inputs]);

  const handleInputsChange = (updated: CalculatorInputs) => {
    setInputs(updated);
    setActivePresetId('custom');
  };

  const handleSelectPreset = (preset: PropertyPreset) => {
    setInputs(preset.inputs);
    setActivePresetId(preset.id);
  };

  const handleReset = () => {
    setInputs(DEFAULT_CALCULATOR_INPUTS);
    setActivePresetId('boutique-hotel');
  };

  const handleCopySummary = async () => {
    const summaryText = [
      'StayDirect ROI & Direct Booking Forecast',
      `ADR: ${formatCurrency(inputs.averageRoomRate)} | Monthly Nights: ${inputs.monthlyRoomNights} | OTA Share: ${inputs.currentOtaSharePct}%`,
      `OTA Commission: ${inputs.averageOtaCommissionPct}% | Target Direct Shift: ${inputs.targetDirectShiftPct}% | Meta Ad Spend: ${formatCurrency(inputs.monthlyMetaAdSpend)}/mo`,
      `Annual OTA Commission Saved: ${formatCurrency(metrics.annualOtaCommissionSaved)}`,
      `Net Direct Revenue Gained: ${formatCurrency(metrics.netDirectRevenueGainedAnnual)}/yr`,
      `Projected Ad ROAS: ${formatRoas(metrics.projectedAdRoas)}`,
      `Break-Even Direct Bookings Needed: ${metrics.breakEvenDirectBookingsNeeded} nights/mo`,
    ].join('\n');

    try {
      await navigator.clipboard.writeText(summaryText);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = summaryText;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
    setSummaryCopied(true);
    window.setTimeout(() => setSummaryCopied(false), 2400);
  };

  return (
    <div id="top" className="relative min-h-screen bg-[#0f172a] text-slate-50 overflow-x-hidden">
      {/* Subtle atmospheric slate lighting for glassmorphic depth */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 overflow-hidden"
      >
        <div className="absolute -top-40 left-1/4 h-[28rem] w-[28rem] rounded-full bg-emerald-500/8 blur-3xl" />
        <div className="absolute top-24 right-1/5 h-[26rem] w-[26rem] rounded-full bg-sky-500/8 blur-3xl" />
      </div>

      <Header onCopySummary={handleCopySummary} summaryCopied={summaryCopied} />

      <main className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* Executive Header & Property Presets */}
        <section className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white [text-wrap:balance]">
              StayDirect ROI &amp; Guest Hub
            </h1>
            <p className="mt-2 text-sm sm:text-base text-slate-400">
              Quantify OTA commission savings from direct Meta Ads bookings and craft personalized pre-arrival guest concierge messages.
            </p>
          </div>

          <div
            role="group"
            aria-label="Property scenario presets"
            className="flex flex-wrap items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900/80 p-1 self-start lg:self-auto"
          >
            {PROPERTY_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleSelectPreset(preset)}
                className={`rounded-md px-3.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  activePresetId === preset.id
                    ? 'bg-emerald-500 text-slate-950 font-semibold'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </section>

        {/* Two-Column Executive Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <div className="lg:col-span-5 flex flex-col">
            <OtaCalculatorPanel
              inputs={inputs}
              metrics={metrics}
              onChange={handleInputsChange}
              onReset={handleReset}
            />
          </div>

          <div className="lg:col-span-7 flex flex-col">
            <RoiDashboardPanel inputs={inputs} metrics={metrics} />
          </div>
        </div>

        {/* Bottom Section: Automated WhatsApp Guest Concierge Generator */}
        <WhatsAppConciergeSection />
      </main>

      <footer className="relative mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 border-t border-slate-800/70">
        <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
          <span>StayDirect ROI &amp; Guest Hub · Direct Hospitality Revenue Suite</span>
          <span>Calculated dynamically from property ADR, OTA share, and Meta Ads parameters</span>
        </div>
      </footer>
    </div>
  );
}
