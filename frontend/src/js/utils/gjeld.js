export const beregnGjeld = (transaksjoner, kontoer) => {
    if (!transaksjoner.length || !kontoer.length) return [];

    kontoer = kontoer.map(k => ({...k, saldo: 0}))
    
    // Beregner saldoer
    {
        const kontoerMap = kontoer
            .map(k => ({[k.navn]: k}))
            .reduce((obj, partial) => ({...obj, ...partial}), {});

        for (let i=0; i<transaksjoner.length; i++) {
            const transaksjon = transaksjoner[i];
            kontoerMap[transaksjon.fra].saldo -= transaksjon.belop;
            kontoerMap[transaksjon.til].saldo += transaksjon.belop;
        }
    }

    // Fordeler felleskonto
    {
        const felles = kontoer.find(k => k.felles);
        kontoer = kontoer.filter(k => !k.felles);
        kontoer.forEach(konto => konto.saldo += felles.saldo / kontoer.length)
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
