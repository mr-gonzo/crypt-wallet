import { calculateTokenBalanceChanges } from './calculateTokenBalanceChange';

export default class SolanaTransform {
    static convertTxToInuCap = async (transactionDetailsArray: any[], publicKey: any, walletAddress: string) => {
        const allTransactions:any = [];

        for (const transactionDetails of transactionDetailsArray) {
            if (!transactionDetails || !transactionDetails.meta || !transactionDetails.blockTime) continue;
            const accountIndex = transactionDetails.transaction.message.accountKeys.findIndex((key: any) => key.pubkey.equals(publicKey));
            if (accountIndex === -1) continue;

            const preBalance = transactionDetails.meta.preBalances[accountIndex] / 1e9; // Convert lamports to SOL
            const postBalance = transactionDetails.meta.postBalances[accountIndex] / 1e9; // Convert lamports to SOL
            const hash = transactionDetails.transaction?.signatures[0]; // Assuming first signature is what you're interested in
            const timestamp = new Date(transactionDetails.blockTime * 1000).toISOString();

            const transfers = []
            const token = {
                timestamp,
                symbol: "SOL",
                quantity: '',
                type: '',
                price: 0,
                value: (postBalance ?? 0) - (preBalance ?? 0),
                hash: hash
            }
            transfers.push(token);


            const preTokenBalances = transactionDetails?.meta?.preTokenBalances ?? [];
            const postTokenBalances = transactionDetails?.meta?.postTokenBalances ?? [];

            const tokenChanges = await calculateTokenBalanceChanges(
                preTokenBalances,
                postTokenBalances,
                walletAddress,
                hash,
                timestamp
            );

                
            // Append the SOL transaction and token balance changes to the allTransactions array.
            tokenChanges.forEach(token => {
                transfers.push(token)
            })

            allTransactions.push({timestamp, transfers})
        }

        return allTransactions;
    }
}
