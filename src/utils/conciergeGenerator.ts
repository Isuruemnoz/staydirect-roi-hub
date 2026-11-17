export type UpsellOffer = 'airport-pickup' | 'spa-discount' | 'both';

export interface ConciergeFormInputs {
  guestName: string;
  propertyName: string;
  checkInDate: string;
  roomType: string;
  upsellOffer: UpsellOffer;
}

export interface ConciergeValidationErrors {
  guestName?: string;
  propertyName?: string;
  checkInDate?: string;
  roomType?: string;
}

export const DEFAULT_CONCIERGE_INPUTS: ConciergeFormInputs = {
  guestName: 'Elena Vance',
  propertyName: 'Villa Aurelia',
  checkInDate: '2026-12-14',
  roomType: 'Oceanview Pool Suite',
  upsellOffer: 'both',
};

export const ROOM_TYPE_OPTIONS = [
  'Oceanview Pool Suite',
  'Garden Terrace King',
  'Panoramic Penthouse Villa',
  'Courtyard Junior Suite',
  'Private Sanctuary Residence',
];

export function formatCheckInDate(isoDate: string): string {
  if (!isoDate.trim()) return '';
  const parts = isoDate.split('-').map(Number);
  if (parts.length !== 3 || parts.some((n) => Number.isNaN(n))) {
    return isoDate;
  }
  const [year, month, day] = parts;
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

export function validateConciergeInputs(inputs: ConciergeFormInputs): ConciergeValidationErrors {
  const errors: ConciergeValidationErrors = {};
  if (!inputs.guestName.trim()) {
    errors.guestName = 'Enter the guest name to personalize the welcome.';
  }
  if (!inputs.propertyName.trim()) {
    errors.propertyName = 'Enter your property name.';
  }
  if (!inputs.checkInDate.trim()) {
    errors.checkInDate = 'Select a check-in date.';
  }
  if (!inputs.roomType.trim()) {
    errors.roomType = 'Select or enter a room type.';
  }
  return errors;
}

export function generateWhatsAppConciergeMessage(inputs: ConciergeFormInputs): string {
  const guest = inputs.guestName.trim();
  const property = inputs.propertyName.trim();
  const room = inputs.roomType.trim();
  const formattedDate = formatCheckInDate(inputs.checkInDate.trim());
  const firstName = guest.split(/\s+/)[0] || guest;

  let upsellSection = '';
  if (inputs.upsellOffer === 'airport-pickup') {
    upsellSection =
      `To ensure a seamless arrival, I would be delighted to arrange our private chauffeur airport pickup directly to ${property}—complete with chilled refreshments waiting in the car. Simply reply with your flight number if you would like us to reserve this for you.`;
  } else if (inputs.upsellOffer === 'spa-discount') {
    upsellSection =
      `As a token of appreciation for booking directly with us, we have reserved a complimentary 20% privilege on any signature spa ritual during your stay. Let me know your preferred afternoon and I will hold a private treatment suite for you.`;
  } else {
    upsellSection =
      `To make your arrival effortless, we can arrange a private chauffeur airport transfer directly to ${property}. In addition, because you booked your stay directly with us, you enjoy an exclusive 20% privilege on all signature spa treatments throughout your stay.`;
  }

  return [
    `Warmest greetings, ${firstName}.`,
    ``,
    `We are counting down the days until your arrival at ${property} on ${formattedDate}. Your ${room} is being thoughtfully prepared ahead of your check-in.`,
    ``,
    upsellSection,
    ``,
    `Should you have any dietary preferences, pillow selections, or special celebration requests before you arrive, please message me directly here on WhatsApp.`,
    ``,
    `Warm regards,`,
    `Guest Concierge Team · ${property}`,
  ].join('\n');
}
