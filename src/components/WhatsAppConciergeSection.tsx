import { FormEvent, useState } from 'react';
import { Check, Copy, MessageSquare, RotateCcw, Send } from 'lucide-react';
import {
  ConciergeFormInputs,
  ConciergeValidationErrors,
  DEFAULT_CONCIERGE_INPUTS,
  generateWhatsAppConciergeMessage,
  ROOM_TYPE_OPTIONS,
  UpsellOffer,
  validateConciergeInputs,
} from '../utils/conciergeGenerator';

const UPSELL_OPTIONS: { id: UpsellOffer; label: string }[] = [
  { id: 'both', label: 'Pickup + 20% Spa' },
  { id: 'airport-pickup', label: 'Airport Pickup' },
  { id: 'spa-discount', label: '20% Spa Privilege' },
];

export function WhatsAppConciergeSection() {
  const [form, setForm] = useState<ConciergeFormInputs>(DEFAULT_CONCIERGE_INPUTS);
  const [errors, setErrors] = useState<ConciergeValidationErrors>({});
  const [generatedMessage, setGeneratedMessage] = useState<string>(() =>
    generateWhatsAppConciergeMessage(DEFAULT_CONCIERGE_INPUTS)
  );
  const [copied, setCopied] = useState(false);

  const handleFieldChange = <K extends keyof ConciergeFormInputs>(
    field: K,
    value: ConciergeFormInputs[K]
  ) => {
    const next = { ...form, [field]: value };
    setForm(next);
    if (errors[field as keyof ConciergeValidationErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    if (field === 'upsellOffer') {
      const nextErrors = validateConciergeInputs(next);
      if (Object.keys(nextErrors).length === 0) {
        setGeneratedMessage(generateWhatsAppConciergeMessage(next));
      }
    }
  };

  const handleGenerate = (e: FormEvent) => {
    e.preventDefault();
    const validationErrors = validateConciergeInputs(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setGeneratedMessage(generateWhatsAppConciergeMessage(form));
    setCopied(false);
  };

  const handleReset = () => {
    setForm(DEFAULT_CONCIERGE_INPUTS);
    setErrors({});
    setGeneratedMessage(generateWhatsAppConciergeMessage(DEFAULT_CONCIERGE_INPUTS));
    setCopied(false);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedMessage);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2400);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = generatedMessage;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2400);
    }
  };

  return (
    <section
      id="guest-concierge"
      aria-labelledby="concierge-heading"
      className="rounded-xl border border-slate-700/60 bg-slate-900/70 backdrop-blur-xl p-6 lg:p-8 shadow-xl shadow-slate-950/30"
    >
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h2
            id="concierge-heading"
            className="font-display text-xl font-semibold text-white"
          >
            Automated WhatsApp Guest Concierge
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            Generate a personalized pre-arrival welcome and direct-booking upsell message in one click.
          </p>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700/80 bg-slate-800/60 px-3 py-1.5 text-xs font-medium text-slate-200 transition-colors hover:bg-slate-800 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 whitespace-nowrap shrink-0 cursor-pointer"
        >
          <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Reset Sample</span>
        </button>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left: Quick Form */}
        <form onSubmit={handleGenerate} noValidate className="lg:col-span-5 flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div>
              <label
                htmlFor="concierge-guest-name"
                className="block text-xs font-medium text-slate-300 mb-1.5"
              >
                Guest Name
              </label>
              <input
                id="concierge-guest-name"
                type="text"
                value={form.guestName}
                onChange={(e) => handleFieldChange('guestName', e.target.value)}
                placeholder="e.g., Elena Vance"
                aria-invalid={Boolean(errors.guestName)}
                className="w-full rounded-lg border border-slate-700/80 bg-slate-950/70 px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-sky-400 focus:outline-none"
              />
              {errors.guestName && (
                <p role="alert" className="mt-1 text-xs text-rose-400">
                  {errors.guestName}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="concierge-property-name"
                className="block text-xs font-medium text-slate-300 mb-1.5"
              >
                Property Name
              </label>
              <input
                id="concierge-property-name"
                type="text"
                value={form.propertyName}
                onChange={(e) => handleFieldChange('propertyName', e.target.value)}
                placeholder="e.g., Villa Aurelia"
                aria-invalid={Boolean(errors.propertyName)}
                className="w-full rounded-lg border border-slate-700/80 bg-slate-950/70 px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-sky-400 focus:outline-none"
              />
              {errors.propertyName && (
                <p role="alert" className="mt-1 text-xs text-rose-400">
                  {errors.propertyName}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="concierge-checkin-date"
                  className="block text-xs font-medium text-slate-300 mb-1.5"
                >
                  Check-in Date
                </label>
                <input
                  id="concierge-checkin-date"
                  type="date"
                  value={form.checkInDate}
                  onChange={(e) => handleFieldChange('checkInDate', e.target.value)}
                  aria-invalid={Boolean(errors.checkInDate)}
                  className="font-mono-tabular w-full rounded-lg border border-slate-700/80 bg-slate-950/70 px-3.5 py-2.5 text-sm text-white focus:border-sky-400 focus:outline-none [color-scheme:dark]"
                />
                {errors.checkInDate && (
                  <p role="alert" className="mt-1 text-xs text-rose-400">
                    {errors.checkInDate}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="concierge-room-type"
                  className="block text-xs font-medium text-slate-300 mb-1.5"
                >
                  Room Type
                </label>
                <input
                  id="concierge-room-type"
                  type="text"
                  list="room-type-suggestions"
                  value={form.roomType}
                  onChange={(e) => handleFieldChange('roomType', e.target.value)}
                  placeholder="e.g., Oceanview Pool Suite"
                  aria-invalid={Boolean(errors.roomType)}
                  className="w-full rounded-lg border border-slate-700/80 bg-slate-950/70 px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-sky-400 focus:outline-none"
                />
                <datalist id="room-type-suggestions">
                  {ROOM_TYPE_OPTIONS.map((option) => (
                    <option key={option} value={option} />
                  ))}
                </datalist>
                {errors.roomType && (
                  <p role="alert" className="mt-1 text-xs text-rose-400">
                    {errors.roomType}
                  </p>
                )}
              </div>
            </div>

            <div>
              <span className="block text-xs font-medium text-slate-300 mb-1.5">
                Upsell Privilege Focus
              </span>
              <div
                role="group"
                aria-label="Upsell privilege focus"
                className="flex flex-wrap sm:grid sm:grid-cols-3 gap-1 rounded-lg border border-slate-800 bg-slate-950/70 p-1"
              >
                {UPSELL_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleFieldChange('upsellOffer', opt.id)}
                    className={`flex-1 sm:flex-initial rounded-md px-3 py-2 text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                      form.upsellOffer === opt.id
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'text-slate-400 hover:text-slate-200 border border-transparent'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-slate-950 transition-colors duration-150 hover:bg-emerald-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400 cursor-pointer"
          >
            <Send className="h-4 w-4" aria-hidden="true" />
            <span>Generate Welcome Message</span>
          </button>
        </form>

        {/* Right: WhatsApp Preview & Copy */}
        <div className="lg:col-span-7 flex flex-col rounded-xl border border-slate-800 bg-slate-950/80 overflow-hidden">
          <div className="flex items-center justify-between gap-4 border-b border-slate-800 bg-slate-900/80 px-5 py-3.5">
            <div className="flex items-center gap-2.5 min-w-0">
              <MessageSquare className="h-4 w-4 text-emerald-400 shrink-0" aria-hidden="true" />
              <span className="text-sm font-medium text-white truncate">
                WhatsApp Guest Preview · {form.propertyName.trim() || 'Property Concierge'}
              </span>
            </div>
            <span className="font-mono-tabular text-xs text-slate-400 whitespace-nowrap shrink-0">
              {generatedMessage.length} chars
            </span>
          </div>

          <div className="flex-1 p-5 sm:p-6 flex flex-col justify-between gap-5">
            <div
              data-testid="whatsapp-message-preview"
              className="rounded-xl rounded-tl-sm border border-emerald-500/25 bg-emerald-950/35 p-4 sm:p-5 text-sm leading-relaxed text-slate-100 whitespace-pre-line"
            >
              {generatedMessage}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-800/80 pt-4">
              <p className="text-xs text-slate-400">
                Direct-booking welcome · Includes personalized upsell offer
              </p>

              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-2 rounded-lg border border-sky-500/40 bg-sky-500/15 px-4 py-2 text-xs font-semibold text-sky-300 transition-colors duration-150 hover:bg-sky-500/25 hover:text-sky-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 whitespace-nowrap shrink-0 cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-400" aria-hidden="true" />
                    <span className="text-emerald-300">Copied to Clipboard</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Copy to Clipboard</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
