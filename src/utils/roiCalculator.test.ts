import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateRoiMetrics,
  DEFAULT_CALCULATOR_INPUTS,
  formatCompactCurrency,
  formatCurrency,
  formatRoas,
} from './roiCalculator';

test('calculates default boutique hotel ROI metrics accurately', () => {
  const metrics = calculateRoiMetrics(DEFAULT_CALCULATOR_INPUTS);

  // 340 * 210 = 71,400/mo; 856,800/yr
  assert.equal(metrics.monthlyGrossRevenue, 71400);
  assert.equal(metrics.annualGrossRevenue, 856800);

  // 65% of 210 = 136.5 OTA nights; 35% shifted = 47.775 nights
  assert.ok(Math.abs(metrics.currentOtaNights - 136.5) < 0.001);
  assert.ok(Math.abs(metrics.shiftedDirectNightsMonthly - 47.775) < 0.001);

  // Shifted direct revenue = 47.775 * 340 = 16,243.5/mo
  assert.ok(Math.abs(metrics.shiftedDirectRevenueMonthly - 16243.5) < 0.01);

  // Commission saved = 16,243.5 * 0.15 = 2,436.525/mo -> 29,238.30/yr
  assert.ok(Math.abs(metrics.monthlyOtaCommissionSaved - 2436.525) < 0.01);
  assert.ok(Math.abs(metrics.annualOtaCommissionSaved - 29238.3) < 0.1);

  // Net Direct Revenue Gained = (16,243.5 - 1,650) * 12 = 175,122/yr
  assert.ok(Math.abs(metrics.netDirectRevenueGainedAnnual - 175122) < 0.1);

  // Projected ROAS = 16,243.5 / 1,650 = 9.8445x
  assert.ok(metrics.projectedAdRoas !== null);
  assert.ok(Math.abs(metrics.projectedAdRoas - 9.8445) < 0.01);

  // Break-even direct bookings = ceil(1650 / 340) = 5 nights
  assert.equal(metrics.breakEvenDirectBookingsNeeded, 5);
});

test('handles zero ad spend and zero direct shift edge cases cleanly', () => {
  const zeroAdMetrics = calculateRoiMetrics({
    ...DEFAULT_CALCULATOR_INPUTS,
    monthlyMetaAdSpend: 0,
  });
  assert.equal(zeroAdMetrics.projectedAdRoas, null);
  assert.equal(zeroAdMetrics.breakEvenDirectBookingsNeeded, 0);
  assert.equal(formatRoas(zeroAdMetrics.projectedAdRoas), 'N/A');

  const zeroShiftMetrics = calculateRoiMetrics({
    ...DEFAULT_CALCULATOR_INPUTS,
    targetDirectShiftPct: 0,
  });
  assert.equal(zeroShiftMetrics.annualOtaCommissionSaved, 0);
  assert.equal(zeroShiftMetrics.shiftedDirectRevenueMonthly, 0);
  assert.equal(zeroShiftMetrics.projectedAdRoas, 0);
  assert.equal(zeroShiftMetrics.netBottomLineUpliftAnnual, -DEFAULT_CALCULATOR_INPUTS.monthlyMetaAdSpend * 12);
});

test('clamps negative or out-of-range inputs safely', () => {
  const safeMetrics = calculateRoiMetrics({
    averageRoomRate: -100,
    monthlyRoomNights: -50,
    currentOtaSharePct: 140,
    averageOtaCommissionPct: -10,
    targetDirectShiftPct: 200,
    monthlyMetaAdSpend: -500,
  });

  assert.equal(safeMetrics.annualGrossRevenue, 0);
  assert.equal(safeMetrics.annualOtaCommissionSaved, 0);
  assert.equal(safeMetrics.breakEvenDirectBookingsNeeded, 0);
});

test('formats currencies and ROAS cleanly', () => {
  assert.equal(formatCurrency(29238.3), '$29,238');
  assert.equal(formatCurrency(-1200), '-$1,200');
  assert.equal(formatCompactCurrency(856800), '$857k');
  assert.equal(formatCompactCurrency(1250000), '$1.25M');
  assert.equal(formatRoas(6.54), '6.5x');
});
