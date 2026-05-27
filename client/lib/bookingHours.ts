/**
 * Clinic operating hours and lead-time constants used by the booking flow.
 *
 * - Times are stored in local browser time (the clinic operates in IE/Cork).
 * - All times are in 24-hour HH:mm format with a 30-minute slot grid.
 */

export interface DaySchedule {
  /** Open time in HH:mm. Null when closed. */
  open: string | null;
  /** Close time in HH:mm. Null when closed. */
  close: string | null;
}

/** Mon-Sun mapped to schedule. JS getDay() returns 0=Sun ... 6=Sat. */
export const CLINIC_SCHEDULE: Record<number, DaySchedule> = {
  0: { open: null, close: null }, // Sunday — closed
  1: { open: "09:00", close: "17:30" },
  2: { open: "09:00", close: "17:30" },
  3: { open: "09:00", close: "17:30" },
  4: { open: "09:00", close: "17:30" },
  5: { open: "09:00", close: "17:30" },
  6: { open: "09:00", close: "14:00" }, // Saturday — half day
};

/** How far in advance the soonest slot can be (in minutes). */
export const MIN_LEAD_MINUTES = 60;

/** Maximum days ahead a patient can book. */
export const MAX_DAYS_AHEAD = 60;

/** Slot grid step in minutes. */
export const SLOT_STEP_MINUTES = 30;

/* -------------------- Helpers -------------------- */

export function todayIsoDate(): string {
  const now = new Date();
  const tzOffsetMs = now.getTimezoneOffset() * 60_000;
  return new Date(now.getTime() - tzOffsetMs).toISOString().split("T")[0];
}

export function maxIsoDate(): string {
  const max = new Date();
  max.setDate(max.getDate() + MAX_DAYS_AHEAD);
  const tzOffsetMs = max.getTimezoneOffset() * 60_000;
  return new Date(max.getTime() - tzOffsetMs).toISOString().split("T")[0];
}

function toMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function pad(n: number) {
  return n < 10 ? `0${n}` : String(n);
}

function fromMinutes(mins: number): string {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${pad(h)}:${pad(m)}`;
}

/**
 * Validate a YYYY-MM-DD date string. Returns null if valid, else an error message.
 */
export function validateBookingDate(dateStr: string): string | null {
  if (!dateStr) return "Please select a date.";

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const picked = new Date(`${dateStr}T00:00:00`);

  if (Number.isNaN(picked.getTime())) return "Invalid date.";
  if (picked < today) return "Please pick today or a future date.";

  const max = new Date();
  max.setDate(max.getDate() + MAX_DAYS_AHEAD);
  max.setHours(0, 0, 0, 0);
  if (picked > max) {
    return `Bookings can only be made up to ${MAX_DAYS_AHEAD} days ahead.`;
  }

  const day = picked.getDay();
  const schedule = CLINIC_SCHEDULE[day];
  if (!schedule.open) return "The clinic is closed on this day.";

  return null;
}

/**
 * Generate the list of available time slots for a given date.
 * Filters out past times if the date is today (uses MIN_LEAD_MINUTES).
 */
export function generateSlotsForDate(
  dateStr: string,
  options: { stepMinutes?: number; durationMinutes?: number } = {}
): string[] {
  const error = validateBookingDate(dateStr);
  if (error) return [];

  const stepMinutes = options.stepMinutes ?? SLOT_STEP_MINUTES;
  const duration = options.durationMinutes ?? stepMinutes;

  const day = new Date(`${dateStr}T00:00:00`).getDay();
  const schedule = CLINIC_SCHEDULE[day];
  if (!schedule.open || !schedule.close) return [];

  const openMins = toMinutes(schedule.open);
  // Last slot must FINISH by close time
  const lastStartMins = toMinutes(schedule.close) - duration;

  // If the chosen date is today, push the start past the lead-time cutoff.
  const isToday = dateStr === todayIsoDate();
  let earliestStart = openMins;
  if (isToday) {
    const now = new Date();
    const nowMins =
      now.getHours() * 60 + now.getMinutes() + MIN_LEAD_MINUTES;
    // Round up to next slot boundary
    const rounded = Math.ceil(nowMins / stepMinutes) * stepMinutes;
    earliestStart = Math.max(openMins, rounded);
  }

  const slots: string[] = [];
  for (
    let mins = earliestStart;
    mins <= lastStartMins;
    mins += stepMinutes
  ) {
    slots.push(fromMinutes(mins));
  }
  return slots;
}

export function isFutureSlot(dateStr: string, timeStr: string): boolean {
  if (!dateStr || !timeStr) return false;
  const slot = new Date(`${dateStr}T${timeStr}:00`);
  if (Number.isNaN(slot.getTime())) return false;
  const now = new Date();
  now.setMinutes(now.getMinutes() + MIN_LEAD_MINUTES);
  return slot.getTime() >= now.getTime();
}
