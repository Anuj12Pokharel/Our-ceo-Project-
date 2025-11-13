import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getYearsFromDate(date: Date): number {
  const now = new Date();
  let years = now.getFullYear() - date.getFullYear();

  // Adjust if the current month/day is before the date's month/day
  const hasNotHadBirthdayThisYear =
    now.getMonth() < date.getMonth() ||
    (now.getMonth() === date.getMonth() && now.getDate() < date.getDate());

  if (hasNotHadBirthdayThisYear) {
    years -= 1;
  }

  return years;
}

export function getTimeUntilDate(futureDate: Date): string {
  const now = new Date();
  const diffMs = futureDate.getTime() - now.getTime();

  if (diffMs <= 0) {
    return "Expired";
  }

  const msInDay = 1000 * 60 * 60 * 24;
  const msInMonth = msInDay * 30; // approx month
  const msInYear = msInDay * 365; // approx year

  if (diffMs < msInMonth) {
    // less than 1 month → show days left
    const daysLeft = Math.ceil(diffMs / msInDay);
    return `${daysLeft}D left`;
  } else if (diffMs < msInYear) {
    // less than 1 year → show months left
    const monthsLeft = Math.ceil(diffMs / msInMonth);
    return `${monthsLeft}M left`;
  } else {
    // 1 year or more → show years left
    const yearsLeft = Math.floor(diffMs / msInYear);
    return `${yearsLeft}y left`;
  }
}
