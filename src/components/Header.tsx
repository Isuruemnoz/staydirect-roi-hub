import { Check, Copy } from 'lucide-react';

interface HeaderProps {
  onCopySummary: () => void;
  summaryCopied: boolean;
}

export function Header({ onCopySummary, summaryCopied }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-800/80 bg-[#0f172a]/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-8 px-4 py-3.5 sm:px-6 lg:px-8">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#top"
          className="font-display text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-400 rounded-sm"
        >
          StayDirect
        </a>

        {/* Zone 2: Concise single-line nav links */}
        <nav
          aria-label="Primary sections"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300"
        >
          <a
            href="#calculator"
            className="whitespace-nowrap shrink-0 transition-colors hover:text-white hover:underline underline-offset-4"
          >
            Calculator
          </a>
          <a
            href="#roi-dashboard"
            className="whitespace-nowrap shrink-0 transition-colors hover:text-white hover:underline underline-offset-4"
          >
            ROI Overview
          </a>
          <a
            href="#guest-concierge"
            className="whitespace-nowrap shrink-0 transition-colors hover:text-white hover:underline underline-offset-4"
          >
            Guest Concierge
          </a>
        </nav>

        {/* Zone 3: Single primary action */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={onCopySummary}
            className="inline-flex items-center gap-2 rounded-lg bg-sky-500 px-4 py-2 text-xs font-semibold text-slate-950 transition-colors duration-150 hover:bg-sky-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 whitespace-nowrap shrink-0 cursor-pointer"
          >
            {summaryCopied ? (
              <>
                <Check className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Summary Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Copy ROI Summary</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
