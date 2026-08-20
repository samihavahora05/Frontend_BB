export function formatOrdinalDate(d: Date): string {
  const day = d.getDate();
  const month = d.toLocaleString('en-US', { month: 'long' });
  const year = d.getFullYear();

  const ordinalSuffix = (n: number) => {
    if (n > 3 && n < 21) return 'th';
    switch (n % 10) {
      case 1:  return 'st';
      case 2:  return 'nd';
      case 3:  return 'rd';
      default: return 'th';
    }
  };

  return `${day}${ordinalSuffix(day)} ${month} ${year}`;
}

export interface BatchCycle {
  batchStartFormatted: string;
  nextBatchStartFormatted: string;
  validTillFormatted: string;
  startDate: Date;
  endDate: Date;
  nextStartDate: Date;
}

export function getCurrentBatchCycle(
  durationUnit: 'days' | 'months',
  durationAmount: number,
  now: Date = new Date()
): BatchCycle {
  // Candidate batch start: 1st of current month
  let start = new Date(now.getFullYear(), now.getMonth(), 1);
  let end: Date;

  if (durationUnit === 'days') {
    // 50 days inclusive duration
    end = new Date(start.getFullYear(), start.getMonth(), start.getDate() + durationAmount - 1);
  } else {
    // 3 months duration: ends on the last day of the 3rd month
    end = new Date(start.getFullYear(), start.getMonth() + durationAmount, 0);
  }

  // Auto-rollover: if today has passed the end date of this cycle, roll forward to next cycle
  while (now > end) {
    if (durationUnit === 'days') {
      const nextMonth = new Date(end.getFullYear(), end.getMonth() + 1, 1);
      start = nextMonth;
      end = new Date(start.getFullYear(), start.getMonth(), start.getDate() + durationAmount - 1);
    } else {
      start = new Date(start.getFullYear(), start.getMonth() + durationAmount, 1);
      end = new Date(start.getFullYear(), start.getMonth() + durationAmount, 0);
    }
  }

  let nextStart: Date;
  if (durationUnit === 'days') {
    // Next batch starts day immediately after 50-day period ends
    nextStart = new Date(end.getFullYear(), end.getMonth(), end.getDate() + 1);
  } else {
    // Next batch starts on the 1st of the month immediately following the 3-month period
    nextStart = new Date(start.getFullYear(), start.getMonth() + durationAmount, 1);
  }

  return {
    batchStartFormatted: formatOrdinalDate(start),
    nextBatchStartFormatted: formatOrdinalDate(nextStart),
    validTillFormatted: formatOrdinalDate(end),
    startDate: start,
    endDate: end,
    nextStartDate: nextStart,
  };
}
