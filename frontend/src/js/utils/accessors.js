import {toISOStringInCurrentTimezone} from './date';

export const belopAccessor = t => 
    t.valutta.kurs ? `${t.valutta.belop.toFixed(2)} ${t.valutta.id}` : t.belop.toFixed(2);

export const timestampAccessor = t => 
    toISOStringInCurrentTimezone(t.timestamp).slice(0,10);
