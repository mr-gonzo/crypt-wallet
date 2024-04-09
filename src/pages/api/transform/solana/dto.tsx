import { timeStamp } from 'console';
import SolflareService from '../../services/solflare';
import { extractAdditionalTransfers } from './calculateTokenBalanceChange';
import { SOL_SYMBOL } from './constants';
import { setFiatDeposit, setExternalDeposits, setSolSaleAndDeposits, setTransfer, addCostBasisToPurchase } from './utils';

export default class SolanaTransform {
    static convertTxToInuCap = async (transactionDetailsArray: any[], publicKey: any, walletAddress: string) => {
        const allTransactions: any = [];
        const despositsMeta: any = []

        for (const transactionDetails of transactionDetailsArray) {
            if (!transactionDetails || !transactionDetails.meta || !transactionDetails.blockTime) continue;
            const accountIndex = transactionDetails.transaction.message.accountKeys.findIndex((key: any) => key.pubkey.equals(publicKey));
            if (accountIndex === -1) continue;

            const preBalance = transactionDetails.meta.preBalances[accountIndex] / 1e9; // Convert lamports to SOL
            const postBalance = transactionDetails.meta.postBalances[accountIndex] / 1e9; // Convert lamports to SOL
            const hash = transactionDetails.transaction?.signatures[0]; // Assuming first signature is what you're interested in
            const timestamp = new Date(transactionDetails.blockTime * 1000).toISOString();

            const transfers = []
            const qty = (postBalance ?? 0) - (preBalance ?? 0)

            const token = {
                blockTime: transactionDetails.blockTime,
                timestamp,
                symbol: SOL_SYMBOL,
                symbolUri: '/sol_symbol.png',
                quantity: qty,
                type: setFiatDeposit(SOL_SYMBOL, qty),
                price: 0,
                value: 0,
                hash: hash
            }
            transfers.push(token);


            const preTokenBalances = transactionDetails?.meta?.preTokenBalances ?? [];
            const postTokenBalances = transactionDetails?.meta?.postTokenBalances ?? [];

            const additionalTransfers = await extractAdditionalTransfers(
                preTokenBalances,
                postTokenBalances,
                walletAddress,
                hash,
                timestamp,
                transactionDetails.blockTime
            );


            // Append the SOL transaction and token balance changes to the allTransactions array.
            additionalTransfers.forEach(token => {
                transfers.push(token)
            })

            setExternalDeposits(transfers)
            setSolSaleAndDeposits(transfers)
            setTransfer(transfers)
            allTransactions.push({ timestamp, transfers })
        }


        //iterate backwards but dont want to change the array order
        for (let i = allTransactions.length - 1; i >= 0; i--) {
           await addCostBasisToPurchase(allTransactions[i].transfers, despositsMeta)
        }

        const response = []
          for (let i = 0; i < allTransactions.length; i++) {
            let hash = allTransactions[i].transfers[0]?.hash
            let blockTime = allTransactions[i].transfers[0]?.blockTime
            let timestamp = allTransactions[i].transfers[0]?.timestamp
            const cleanTransfers = allTransactions[i].transfers?.map((transfer: any) => {
                delete transfer.hash
                delete transfer.blockTime
                delete transfer.timestamp
                return transfer
            })
            const tx = {
                blockTime,
                hash,
                timestamp,
                transfers: cleanTransfers
            }

            response.push(tx)
            
         }

        return response;
    }
}
