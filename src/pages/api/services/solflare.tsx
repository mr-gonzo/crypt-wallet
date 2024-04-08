export default class SolflareService {
     static symbolsMap: Map<string, any> = new Map()

    static async getSymbol(mint: string){
        if(!mint || mint === '') return ''

        const symbol = this.symbolsMap.get(mint);
        if(symbol) return symbol;

        const response = await fetch('https://cdn.jsdelivr.net/gh/solflare-wallet/token-list/solana-tokenlist.json')
        if (!response.ok) {
            return 'err'
        }

        const jsonData = await response.json();
        const tokens = jsonData.tokens;

        tokens.forEach((token: any) => {
            this.symbolsMap.set(token.address, {symbol: token.symbol, symbolUri: token.logoURI})
        })

        return this.symbolsMap.get(mint);
    }

}