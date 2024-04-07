// Function to calculate balance changes for each token type for a specific owner address
import SolflareService from "../../services/solflare";
import {getTokenPriceAndVAA} from './spotRates'


// Function to calculate balance changes for each token type for a specific owner address
export async function calculateTokenBalanceChanges(preBalances:any, postBalances:any, ownerAddress:any, hash: any, timestamp:any) {
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

            const preSymbol: string = await SolflareService.getSymbol(preBalance?.mint ?? '') || '';
            
            const spotPriceData = await getTokenPriceAndVAA(timestamp.toString(), preSymbol); // Example for "SOL", adjust as needed
            const spotPrice = spotPriceData ? spotPriceData.price.price : 0;

            const token = {
                timestamp,
                symbol:preSymbol,
                quantity:'',
                type: '',
                price: 0,
                value: postValue,
                hash,
                spotPrice: spotPrice
            }
        tokenTransactions.push(token);
    }

    // Check for any new tokens added that weren't in preBalances
    for (const postBalance of filteredPostBalances) {
        if (!filteredPreBalances.find((balance:any)  => balance.mint === postBalance.mint)) {
            const postSymbol = await SolflareService.getSymbol(postBalance?.mint ?? '') || ''
            const spotPriceData = await getTokenPriceAndVAA(timestamp.toString(), postSymbol); // Example for "SOL", adjust as needed
            const spotPrice = spotPriceData ? spotPriceData.price.price : 0;
            const token = {
                timestamp,
                symbol:postSymbol,
                quantity:'',
                type: '',
                price: 0,
                value:postBalance.uiTokenAmount.uiAmount, // Entire postBalance is the net addition,
                hash, // Entire postBalance is the net addition
                spotPrice: spotPrice 
            }
            tokenTransactions.push(token);
        }
    }

    return tokenTransactions;
}