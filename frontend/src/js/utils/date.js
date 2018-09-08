export const withoutTimezone = d => new Date(d.getTime() - d.getTimezoneOffset()*1000*60);
export const toISOStringInCurrentTimezone = d => withoutTimezone(d).toISOString().slice(0, -1);
