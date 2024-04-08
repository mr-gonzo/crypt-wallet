// Function to calculate balance changes for each token type for a specific owner address
import SolflareService from "../../services/solflare";
import { setFiatDeposit } from "./utils";

// Function to calculate balance changes for each token type for a specific owner address
export async function extractAdditionalTransfers(preBalances:any, postBalances:any, ownerAddress:any, hash: any, timestamp:any, blockTime: any) {
    const tokenTransactions = [];

    // Filter balances for the specified owner
    const filteredPreBalances = preBalances.filter((balance: any) => {
        return balance.owner === ownerAddress;
    });
    const filteredPostBalances = postBalances.filter((balance:any) => balance.owner === ownerAddress);

    // Iterate over preBalances to calculate net changes
    for (const preBalance of filteredPreBalances) {
        const postBalance = filteredPostBalances.find((balance:any) => balance.mint === preBalance.mint);
        if(!postBalance) continue;

        const postValue = postBalance 
            ? postBalance.uiTokenAmount.uiAmount - preBalance.uiTokenAmount.uiAmount
            : -preBalance.uiTokenAmount.uiAmount; // If no postBalance, the entire amount was deducted

            const {symbol,symbolUri} : any = await SolflareService.getSymbol(preBalance?.mint ?? '') || '';

            const token = {
                blockTime,
                timestamp,
                symbol:symbol,
                symbolUri: symbolUri,
                quantity: postValue,
                type: setFiatDeposit(symbol, postValue),
                price: 0,
                value: 0,
                hash
            }
        tokenTransactions.push(token);
    }

    // Check for any new tokens added that weren't in preBalances
    for (const postBalance of filteredPostBalances) {
        if (!filteredPreBalances.find((balance:any)  => balance.mint === postBalance.mint)) {
            const {symbol,symbolUri} = await SolflareService.getSymbol(postBalance?.mint ?? '') || ''

            const qty = postBalance.uiTokenAmount.uiAmount
            const token = {
                blockTime,
                timestamp,
                symbol:symbol,
                symbolUri: symbolUri,
                quantity:qty,
                type: setFiatDeposit(symbol, qty),
                price: 0,
                value: 0, // Entire postBalance is the net addition,
                hash // Entire postBalance is the net addition
                }
            tokenTransactions.push(token);
        }
    }

    return tokenTransactions;
}