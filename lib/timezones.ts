export interface TimezoneConfig {
  city: string;
  province: string;
  timezone: string;
  label: string;
  short: string;
  zoneIndex: number;
  noDst?: boolean;
}

// One entry per Canadian province/territory (13 total). Where a
// province/territory observes DST identically to a neighbour, it shares
// that zoneIndex/colour; Saskatchewan and Yukon get their own index because
// they sit on standard time year-round (no DST), unlike their neighbours.
export const CANADIAN_TIMEZONES: TimezoneConfig[] = [
  { city: "Vancouver",     province: "BC", timezone: "America/Vancouver",   label: "Pacific Time",       short: "PT",  zoneIndex: 0 },
  { city: "Whitehorse",    province: "YT", timezone: "America/Whitehorse",  label: "Yukon Time",         short: "MST", zoneIndex: 6, noDst: true },
  { city: "Calgary",       province: "AB", timezone: "America/Edmonton",    label: "Mountain Time",      short: "MT",  zoneIndex: 1 },
  { city: "Yellowknife",   province: "NT", timezone: "America/Yellowknife", label: "Mountain Time",      short: "MT",  zoneIndex: 1 },
  { city: "Regina",        province: "SK", timezone: "America/Regina",      label: "Central Standard",   short: "CST", zoneIndex: 7, noDst: true },
  { city: "Winnipeg",      province: "MB", timezone: "America/Winnipeg",    label: "Central Time",       short: "CT",  zoneIndex: 2 },
  { city: "Toronto",       province: "ON", timezone: "America/Toronto",     label: "Eastern Time",       short: "ET",  zoneIndex: 3 },
  { city: "Montreal",      province: "QC", timezone: "America/Toronto",     label: "Eastern Time",       short: "ET",  zoneIndex: 3 },
  { city: "Iqaluit",       province: "NU", timezone: "America/Iqaluit",     label: "Eastern Time",       short: "ET",  zoneIndex: 3 },
  { city: "Fredericton",   province: "NB", timezone: "America/Moncton",     label: "Atlantic Time",      short: "AT",  zoneIndex: 4 },
  { city: "Halifax",       province: "NS", timezone: "America/Halifax",     label: "Atlantic Time",      short: "AT",  zoneIndex: 4 },
  { city: "Charlottetown", province: "PE", timezone: "America/Halifax",     label: "Atlantic Time",      short: "AT",  zoneIndex: 4 },
  { city: "St. John's",    province: "NL", timezone: "America/St_Johns",    label: "Newfoundland Time",  short: "NT",  zoneIndex: 5 },
];

export interface TimeData {
  hours: string;
  minutes: string;
  seconds: string;
  period: string;
  fullDate: string;
  shortDate: string;
  utcOffset: string;
  isDay: boolean;
}

// Intl.DateTimeFormat construction is relatively expensive and these apps
// re-render every second for every zone on screen. Formatters only depend on
// (timezone, use24h) and never change after that, so we build each one once
// and reuse it for the lifetime of the page instead of allocating ~5 new
// formatters per card, per tick.
const formatterCache = new Map<string, Intl.DateTimeFormat>();

function getFormatter(key: string, timezone: string, options: Intl.DateTimeFormatOptions): Intl.DateTimeFormat {
  let formatter = formatterCache.get(key);
  if (!formatter) {
    formatter = new Intl.DateTimeFormat("en-CA", { timeZone: timezone, ...options });
    formatterCache.set(key, formatter);
  }
  return formatter;
}

export function getTimeData(timezone: string, use24h: boolean, now: Date): TimeData {
  const timeParts = getFormatter(`time:${timezone}:${use24h}`, timezone, {
    hour: "numeric", minute: "2-digit", second: "2-digit", hour12: !use24h,
  }).formatToParts(now);

  const get = (type: string) => timeParts.find(p => p.type === type)?.value ?? "00";

  const hour24 = parseInt(
    getFormatter(`hour24:${timezone}`, timezone, { hour: "numeric", hour12: false }).format(now)
  );

  const utcOffset = getFormatter(`offset:${timezone}`, timezone, { timeZoneName: "shortOffset" })
    .formatToParts(now).find(p => p.type === "timeZoneName")?.value ?? "";

  const fullDate = getFormatter(`full:${timezone}`, timezone, {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  }).format(now);

  const shortDate = getFormatter(`short:${timezone}`, timezone, {
    weekday: "short", month: "short", day: "numeric",
  }).format(now);

  return {
    hours: get("hour"),
    minutes: get("minute"),
    seconds: get("second"),
    period: get("dayPeriod").toUpperCase(),
    fullDate,
    shortDate,
    utcOffset,
    isDay: hour24 >= 6 && hour24 < 20,
  };
}
