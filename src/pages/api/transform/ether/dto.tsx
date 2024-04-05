export default class EtherTransform {
    static convertTxToInuCap =  (transactionDetails: any) => {

        const filteredResp = transactionDetails.filter((tx: any) => {
            if (tx.transfers[0]?.nft_info?.flags?.is_spam) return false;
            if (tx.transfers[0]?.fungible_info?.symbol?.length > 5) return false
            else return true;

        })


        const transactions = filteredResp.map((transaction: any) => {
            const timestamp = transaction.metadata?.minedAt
            const transfers = transaction.transfers?.map((tx: any) => {
                const val = {
                    symbol: tx.fungible_info?.symbol, 
                    quantity: tx.quantity?.numeric,
                    type: tx.direction,
                    price: tx.price,
                    value: tx.value,
                    hash: transaction.metadata?.hash
                }
                return val
            })

            return {timestamp, transfers}
        })
        
        return transactions
    }
}