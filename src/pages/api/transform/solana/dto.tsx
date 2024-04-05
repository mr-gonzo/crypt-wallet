import SolflareService from "../../services/solflare";

export default class SolanaTransform {
    static convertTxToInuCap = async (transactionDetails: any, publicKey: any) => {
        const transactions = []
        for (const transactionDetail of transactionDetails) {
            // const transactionDetail = await connection.getTransaction(signature, { maxSupportedTransactionVersion: 0 });
            if (!transactionDetail || !transactionDetail.meta || !transactionDetail.blockTime) {
                continue; // Skip this iteration if transaction details are incomplete
            }

            // Extract relevant details from the transaction and meta data
            const accountIndex = transactionDetail.transaction.message.accountKeys.findIndex((key: any) => key.pubkey.equals(publicKey));
            if (accountIndex === -1) continue; // Skip if public key not found in the transaction

            const preBalance = transactionDetail.meta.preBalances[accountIndex] / 1e9; // Convert lamports to SOL
            const postBalance = transactionDetail.meta.postBalances[accountIndex] / 1e9; // Convert lamports to SOL
            const timestamp = new Date(transactionDetail.blockTime * 1000).toISOString();

            const preTokenBalance = transactionDetail?.meta?.preTokenBalances?.[accountIndex]
            const postTokenBalance = transactionDetail?.meta?.postTokenBalances?.[accountIndex];
            const preSymbol = await SolflareService.getSymbol(preTokenBalance?.mint ?? '')
            const postSymbol = await SolflareService.getSymbol(postTokenBalance?.mint ?? '')

      

            if(preSymbol !== '' || postSymbol !== ''){
                const preValue = {
                    symbol: preSymbol,
                    quantity: '',
                    type: '',
                    price: preTokenBalance?.uiTokenAmount?.uiAmount,
                    value: (postTokenBalance?.uiTokenAmount?.uiAmount ?? 0) - (preTokenBalance?.uiTokenAmount?.uiAmount ?? 0),
                    hash: transactionDetail.transaction?.signatures[accountIndex]
                };
                const postVlue = {
                    symbol: postSymbol, 
                    quantity: '',
                    type: '',
                    price: postTokenBalance.uiTokenAmount?.uiAmount,
                    value: (postTokenBalance?.uiTokenAmount?.uiAmount ?? 0) - (preTokenBalance?.uiTokenAmount?.uiAmount ?? 0),
                    hash: transactionDetail.transaction?.signatures[accountIndex]
                }
                const transfers = [preValue, postVlue]
                transactions.push( { timestamp, transfers} );
            }
        }
        return transactions
    }
}