import test from 'node:test';
import assert from 'node:assert/strict';
import {
  DEFAULT_CONCIERGE_INPUTS,
  formatCheckInDate,
  generateWhatsAppConciergeMessage,
  validateConciergeInputs,
} from './conciergeGenerator';

test('validates required concierge form fields', () => {
  const validErrors = validateConciergeInputs(DEFAULT_CONCIERGE_INPUTS);
  assert.deepEqual(validErrors, {});

  const emptyErrors = validateConciergeInputs({
    guestName: '   ',
    propertyName: '',
    checkInDate: '',
    roomType: '',
    upsellOffer: 'both',
  });
  assert.ok(emptyErrors.guestName);
  assert.ok(emptyErrors.propertyName);
  assert.ok(emptyErrors.checkInDate);
  assert.ok(emptyErrors.roomType);
});

test('formats ISO check-in date into readable hospitality format', () => {
  const formatted = formatCheckInDate('2026-12-14');
  assert.match(formatted, /December 14, 2026/);
});

test('generates tailored WhatsApp message for each upsell focus', () => {
  const pickupMsg = generateWhatsAppConciergeMessage({
    ...DEFAULT_CONCIERGE_INPUTS,
    upsellOffer: 'airport-pickup',
  });
  assert.match(pickupMsg, /Elena/);
  assert.match(pickupMsg, /Villa Aurelia/);
  assert.match(pickupMsg, /Oceanview Pool Suite/);
  assert.match(pickupMsg, /chauffeur airport pickup/);
  assert.doesNotMatch(pickupMsg, /20% privilege/);

  const spaMsg = generateWhatsAppConciergeMessage({
    ...DEFAULT_CONCIERGE_INPUTS,
    upsellOffer: 'spa-discount',
  });
  assert.match(spaMsg, /20% privilege on any signature spa ritual/);
  assert.doesNotMatch(spaMsg, /chauffeur airport pickup/);

  const bothMsg = generateWhatsAppConciergeMessage({
    ...DEFAULT_CONCIERGE_INPUTS,
    upsellOffer: 'both',
  });
  assert.match(bothMsg, /chauffeur airport transfer/);
  assert.match(bothMsg, /20% privilege on all signature spa treatments/);
});
