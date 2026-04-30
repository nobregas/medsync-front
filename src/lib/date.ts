export function formatDateToBr(date: string): string {
  if (!date) return "";
  const d = new Date(date);
  return new Intl.DateTimeFormat("pt-BR").format(d);
}

export function formatDateToIso(date: string): string {
  if (!date) return "";
  const d = new Date(date);
  return d.toISOString().split("T")[0];
}

export function formatTime(time: string): string {
  if (!time) return "";
  const [hours, minutes] = time.split(":");
  return `${hours}:${minutes}`;
}

export function getToday(): string {
  return new Date().toISOString().split("T")[0];
}

export function getWeekDates(startDate: Date): Date[] {
  const dates: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    dates.push(date);
  }
  return dates;
}

export function formatDateTime(date: string, time: string): string {
  return `${formatDateToBr(date)} às ${formatTime(time)}`;
}

export function isToday(date: string): boolean {
  return date === getToday();
}

export function getDayName(date: string): string {
  const d = new Date(date);
  return new Intl.DateTimeFormat("pt-BR", { weekday: "long" }).format(d);
}

export function getShortDayName(date: string): string {
  const d = new Date(date);
  return new Intl.DateTimeFormat("pt-BR", { weekday: "short" }).format(d);
}