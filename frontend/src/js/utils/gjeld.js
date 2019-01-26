const hashMap = kontoer => 
    kontoer.map(k => ({[k.navn]: k}))
           .reduce((obj, partial) => ({...obj, ...partial}), {});

const paavirketAvTransaksjon = (transaksjon, konto) => 
    !konto.felles && (!konto.fra || konto.fra < transaksjon.timestamp) && (!konto.til || transaksjon.timestamp < konto.til);

export const ikkePaavirketAvTransaksjon = (transaksjon, kontoer) => {
    if (!transaksjon || !kontoer.length) return [];
    const kontoerMap = hashMap(kontoer);
    return [transaksjon.fra, transaksjon.til].some(k => kontoerMap[k].felles)
        ? kontoer.filter(k => !k.felles && !paavirketAvTransaksjon(transaksjon, k))
        : [];
}

export const beregnGjeld = (transaksjoner, kontoer) => {
    if (!transaksjoner.length || !kontoer.length) return [];
    kontoer = kontoer.map(k => ({...k, saldo: 0}))
    
    // Beregner saldoer
    {
        const kontoerMap = hashMap(kontoer);
        const fellesfordeling = transaksjon => {
            const mottakere = kontoer.filter(k => paavirketAvTransaksjon(transaksjon, k));
            const fordeltBelop = mottakere.length && transaksjon.belop / mottakere.length;
            return {mottakere, fordeltBelop};
        }

        transaksjoner.filter(t => t.fra !== t.til).forEach(transaksjon => {
            if (kontoerMap[transaksjon.fra].felles) {
                const {mottakere, fordeltBelop} = fellesfordeling(transaksjon);
                mottakere.forEach(k => k.saldo -= fordeltBelop);
            } else if (kontoerMap[transaksjon.til].felles) {
                const {mottakere, fordeltBelop} = fellesfordeling(transaksjon);
                mottakere.forEach(k => k.saldo += fordeltBelop);
            }
            kontoerMap[transaksjon.fra].saldo -= transaksjon.belop;
            kontoerMap[transaksjon.til].saldo += transaksjon.belop;
        
        });
        kontoer = kontoer.filter(k => !k.felles);
    }

    // Kontrollregner saldoer
    {
        const saldoSum = kontoer.reduce((s, k) => s + k.saldo, 0);
        if (Math.abs(saldoSum) > 1) {
            throw new Error("Summen av alle saldoer er " + saldoSum)
        }
    }

    // Beregner gjeld
    const gjeld = [];
    while (kontoer.some(k => Math.abs(k.saldo) > 1)) {
        const hoyest = kontoer.reduce((hoyest, k) => k.saldo > hoyest.saldo ? k : hoyest, {saldo: 0});
        const lavest = kontoer.reduce((lavest, k) => k.saldo < lavest.saldo ? k : lavest, {saldo: 0});
        const belop = Math.min(hoyest.saldo, Math.abs(lavest.saldo));

        gjeld.push({
            fra: hoyest.navn,
            til: lavest.navn,
            belop
        });

        hoyest.saldo -= belop;
        lavest.saldo += belop;
    }

    return gjeld;
}
