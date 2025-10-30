import type { Appointment } from '../types/appointment';

export interface TimeSlot {
  date: string;
  start_time: string;
  end_time: string;
}

export function checkTimeOverlap(
  slot1: TimeSlot,
  slot2: TimeSlot
): boolean {
  if (slot1.date !== slot2.date) {
    return false;
  }

  const start1 = timeToMinutes(slot1.start_time);
  const end1 = timeToMinutes(slot1.end_time);
  const start2 = timeToMinutes(slot2.start_time);
  const end2 = timeToMinutes(slot2.end_time);

  return start1 < end2 && start2 < end1;
}

export function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

export function isWithinBusinessHours(startTime: string, endTime: string): boolean {
  const start = timeToMinutes(startTime);
  const end = timeToMinutes(endTime);
  const businessStart = 9 * 60;
  const businessEnd = 17 * 60;

  return start >= businessStart && end <= businessEnd && start < end;
}

export function hasAppointmentConflict(
  newSlot: TimeSlot,
  existingAppointments: Appointment[],
  excludeId?: string
): boolean {
  return existingAppointments
    .filter(apt => apt.id !== excludeId && apt.status !== 'cancelled')
    .some(apt => checkTimeOverlap(newSlot, {
      date: apt.appointment_date,
      start_time: apt.start_time,
      end_time: apt.end_time
    }));
}

export function validateAppointmentTime(
  date: string,
  startTime: string,
  endTime: string
): string | null {
  const appointmentDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (appointmentDate < today) {
    return 'Appointment date cannot be in the past';
  }

  if (!isWithinBusinessHours(startTime, endTime)) {
    return 'Appointment must be within business hours (9 AM - 5 PM)';
  }

  const start = timeToMinutes(startTime);
  const end = timeToMinutes(endTime);

  if (end - start < 30) {
    return 'Appointment must be at least 30 minutes long';
  }

  if (end - start > 240) {
    return 'Appointment cannot exceed 4 hours';
  }

  return null;
}
