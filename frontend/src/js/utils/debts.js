export const settlements = (transfers, kontoer) => {
    if (!transfers.length || !kontoer.length) return undefined;

    kontoer = kontoer.map(k => ({...k, saldo: 0}))
    const kontoerMap = kontoer
        .map(k => ({[k.navn]: k}))
        .reduce((obj, partial) => ({...obj, ...partial}), {});

    for (let i=0; i<transfers.length; i++) {
        const transfer = transfers[i];
        kontoerMap[transfer.fra].saldo -= transfer.belop;
        kontoerMap[transfer.til].saldo += transfer.belop;
    }


    const fellesSaldo = kontoer.find(k => k.felles).saldo;
    const oppgjoersKontoer = Object.keys(kontoer)
        .map(k => kontoer[k])
        .filter(konto => !konto.felles);
    if (oppgjoersKontoer.length !== 2) throw "støtter kun 2 oppgjørskontoer";

    oppgjoersKontoer
        .forEach(konto => konto.saldo += fellesSaldo / 2)

    if (oppgjoersKontoer[0].saldo < 0) return {fra: oppgjoersKontoer[1].navn, til: oppgjoersKontoer[0].navn, belop: oppgjoersKontoer[1].saldo}
    else if (oppgjoersKontoer[1].saldo < 0) return {fra: oppgjoersKontoer[0].navn, til: oppgjoersKontoer[1].navn, belop: oppgjoersKontoer[0].saldo}
}
