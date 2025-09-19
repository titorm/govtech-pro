import {
  format,
  parseISO,
  addDays,
  addMonths,
  addYears,
  differenceInDays,
  isWeekend,
  isValid,
} from "date-fns";
import { ptBR } from "date-fns/locale";

/**
 * Date utilities for Brazilian locale and business rules
 */

export function formatDate(
  date: Date | string,
  pattern: string = "dd/MM/yyyy"
): string {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return format(dateObj, pattern, { locale: ptBR });
}

export function formatDateTime(
  date: Date | string,
  pattern: string = "dd/MM/yyyy HH:mm"
): string {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return format(dateObj, pattern, { locale: ptBR });
}

export function formatDateLong(date: Date | string): string {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return format(dateObj, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
}

export function addBusinessDays(date: Date, days: number): Date {
  let result = new Date(date);
  let addedDays = 0;

  while (addedDays < days) {
    result = addDays(result, 1);
    if (!isWeekend(result)) {
      addedDays++;
    }
  }

  return result;
}

export function calculateDeadline(startDate: Date, businessDays: number): Date {
  return addBusinessDays(startDate, businessDays);
}

export function isOverdue(deadline: Date): boolean {
  return new Date() > deadline;
}

export function getDaysUntilDeadline(deadline: Date): number {
  return differenceInDays(deadline, new Date());
}

export function getDeadlineStatus(
  deadline: Date
): "overdue" | "urgent" | "warning" | "normal" {
  const daysLeft = getDaysUntilDeadline(deadline);

  if (daysLeft < 0) return "overdue";
  if (daysLeft <= 1) return "urgent";
  if (daysLeft <= 3) return "warning";
  return "normal";
}

export function formatTimeAgo(date: Date | string): string {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  const now = new Date();
  const diffInMinutes = Math.floor(
    (now.getTime() - dateObj.getTime()) / (1000 * 60)
  );

  if (diffInMinutes < 1) return "agora mesmo";
  if (diffInMinutes < 60)
    return `${diffInMinutes} minuto${diffInMinutes > 1 ? "s" : ""} atrás`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24)
    return `${diffInHours} hora${diffInHours > 1 ? "s" : ""} atrás`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30)
    return `${diffInDays} dia${diffInDays > 1 ? "s" : ""} atrás`;

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12)
    return `${diffInMonths} mês${diffInMonths > 1 ? "es" : ""} atrás`;

  const diffInYears = Math.floor(diffInMonths / 12);
  return `${diffInYears} ano${diffInYears > 1 ? "s" : ""} atrás`;
}

export function getBusinessHours(): { start: string; end: string } {
  return { start: "08:00", end: "17:00" };
}

export function isBusinessHour(date: Date = new Date()): boolean {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const currentTime = hours * 60 + minutes;

  const businessStart = 8 * 60; // 08:00
  const businessEnd = 17 * 60; // 17:00

  return (
    !isWeekend(date) &&
    currentTime >= businessStart &&
    currentTime <= businessEnd
  );
}

export function getNextBusinessDay(date: Date = new Date()): Date {
  let nextDay = addDays(date, 1);
  while (isWeekend(nextDay)) {
    nextDay = addDays(nextDay, 1);
  }
  return nextDay;
}

export function validateBrazilianDate(dateString: string): boolean {
  // Accepts formats: DD/MM/YYYY, DD-MM-YYYY, DD.MM.YYYY
  const regex = /^(\d{2})[\/\-\.](\d{2})[\/\-\.](\d{4})$/;
  const match = dateString.match(regex);

  if (!match) return false;

  const day = parseInt(match[1]);
  const month = parseInt(match[2]);
  const year = parseInt(match[3]);

  const date = new Date(year, month - 1, day);

  return (
    isValid(date) &&
    date.getDate() === day &&
    date.getMonth() === month - 1 &&
    date.getFullYear() === year
  );
}
