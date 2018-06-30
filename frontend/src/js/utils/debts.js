export const settlements = (transfers) => {
    const balance = {
        erik: 0,
        beate: 0,
        felles: 0
    };

    for (let i=0; i<transfers.length; i++) {
        const transfer = transfers[i];
        balance[transfer.fra] -= transfer.belop;
        balance[transfer.til] += transfer.belop;
    }
    
    balance.erik += balance.felles / 2;
    balance.beate += balance.felles / 2;

    if (balance.beate < 0) return {fra: "erik", til: "beate", belop: balance.erik}
    else if (balance.erik < 0) return {fra: "beate", til: "erik", belop: balance.beate}
}
