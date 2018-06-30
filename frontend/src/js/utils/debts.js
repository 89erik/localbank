export const settlements = (transfers, accounts) => {
    const balance = {
        erik: 0,
        beate: 0,
        felles: 0
    };

    for (let i=0; i<transfers.length; i++) {
        const transfer = transfers[i];
        balance[transfer.from] -= transfer.amount;
        balance[transfer.to]   += transfer.amount;
    }
    
    balance.erik += balance.felles / 2;
    balance.beate += balance.felles / 2;

    if (balance.beate < 0) return {from: "erik", to: "beate", amount: balance.erik}
    else if (balance.erik < 0) return {from: "beate", to: "erik", amount: balance.beate}
}
