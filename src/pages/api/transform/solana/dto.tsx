import { calculateTokenBalanceChanges } from './calculateTokenBalanceChange';
import {getTokenPriceAndVAA} from './spotRates'

export default class SolanaTransform {
    static convertTxToInuCap = async (transactionDetailsArray: any[], publicKey: any, walletAddress: string) => {
        const allTransactions:any = [];

        for (const transactionDetails of transactionDetailsArray) {
            console.log(transactionDetails)
            if (!transactionDetails || !transactionDetails.meta || !transactionDetails.blockTime) continue;
            const accountIndex = transactionDetails.transaction.message.accountKeys.findIndex((key: any) => key.pubkey.equals(publicKey));
            if (accountIndex === -1) continue;

            const preBalance = transactionDetails.meta.preBalances[accountIndex] / 1e9; // Convert lamports to SOL
            const postBalance = transactionDetails.meta.postBalances[accountIndex] / 1e9; // Convert lamports to SOL
            const hash = transactionDetails.transaction?.signatures[0]; // Assuming first signature is what you're interested in
            const timestamp = new Date(transactionDetails.blockTime * 1000).toISOString();

            const transfers = []
            const solSpotPriceData = await getTokenPriceAndVAA(transactionDetails.blockTime.toString(), "SOL"); // Example for "SOL", adjust as needed
            const solSpotPrice = solSpotPriceData ? solSpotPriceData.price.price : 0;

            const token = {
                timestamp,
                symbol: "SOL",
                quantity: '',
                type: '',
                price: 0,
                value: (postBalance ?? 0) - (preBalance ?? 0),
                hash: hash,
                spotPrice: solSpotPrice
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


async function fetchPriceAndVAA() {
    const blockTime = '1690576641'; // Example block time
    const token = "MNGO"; // Example token
    const data = await getTokenPriceAndVAA(blockTime, token);
  
    if (data) {
      const tokenPrice = data.price.price;
      const vaa = data.vaa;
      console.log("Token Price:", tokenPrice, "VAA:", vaa);
      // You can now use tokenPrice and vaa as needed
    } else {
      console.log("Failed to fetch data");
    }
  }