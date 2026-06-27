export interface TimezoneConfig {
  city: string;
  province: string;
  timezone: string;
  label: string;
  short: string;
  zoneIndex: number;
}

export const CANADIAN_TIMEZONES: TimezoneConfig[] = [
  { city: "Vancouver",  province: "BC", timezone: "America/Vancouver", label: "Pacific Time",      short: "PT", zoneIndex: 0 },
  { city: "Calgary",    province: "AB", timezone: "America/Edmonton",  label: "Mountain Time",     short: "MT", zoneIndex: 1 },
  { city: "Winnipeg",   province: "MB", timezone: "America/Winnipeg",  label: "Central Time",      short: "CT", zoneIndex: 2 },
  { city: "Toronto",    province: "ON", timezone: "America/Toronto",   label: "Eastern Time",      short: "ET", zoneIndex: 3 },
  { city: "Halifax",    province: "NS", timezone: "America/Halifax",   label: "Atlantic Time",     short: "AT", zoneIndex: 4 },
  { city: "St. John's", province: "NL", timezone: "America/St_Johns",  label: "Newfoundland Time", short: "NT", zoneIndex: 5 },
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

export function getTimeData(timezone: string, use24h: boolean, now: Date): TimeData {
  const base = { timeZone: timezone };

  const timeParts = new Intl.DateTimeFormat("en-CA", {
    ...base, hour: "numeric", minute: "2-digit", second: "2-digit", hour12: !use24h,
  }).formatToParts(now);

  const get = (type: string) => timeParts.find(p => p.type === type)?.value ?? "00";

  const hour24 = parseInt(
    new Intl.DateTimeFormat("en-CA", { ...base, hour: "numeric", hour12: false }).format(now)
  );

  const utcOffset = new Intl.DateTimeFormat("en-CA", { ...base, timeZoneName: "shortOffset" })
    .formatToParts(now).find(p => p.type === "timeZoneName")?.value ?? "";

  const fullDate = new Intl.DateTimeFormat("en-CA", {
    ...base, weekday: "long", year: "numeric", month: "long", day: "numeric",
  }).format(now);

  const shortDate = new Intl.DateTimeFormat("en-CA", {
    ...base, weekday: "short", month: "short", day: "numeric",
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
