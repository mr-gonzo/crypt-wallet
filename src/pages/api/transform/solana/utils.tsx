import getTokenPriceAndVAA from "../../services/pyth"
import { SOL_SYMBOL } from "./constants"

export const setFiatDeposit = (symbol: string, qty: number) => {
    if (symbol === 'USDC' || symbol === 'USDT') return 'DEPOSIT'
}

export const setExternalDeposits = (additionalTransfers: any[]) => {
    if (additionalTransfers.length !== 2) return

    if (additionalTransfers[0].symbol === SOL_SYMBOL && additionalTransfers[0].quantity === 0) {
        additionalTransfers[0].type = ''
        additionalTransfers[1].type = 'DEPOSIT'
    }

}

export const setSolSaleAndDeposits = (additionalTransfers: any[]) => {
    if (additionalTransfers.length !== 1) return

    if (additionalTransfers[0].symbol === SOL_SYMBOL && additionalTransfers[0].quantity > 0) {
        additionalTransfers[0].type = 'DEPOSIT'
    }

    if (additionalTransfers[0].symbol === SOL_SYMBOL && additionalTransfers[0].quantity < 0) {
        additionalTransfers[0].type = 'SELL'
    }

}


export const setTransfer = (additionalTransfers: any[]) => {
    if (additionalTransfers.length !== 2) return

    if (additionalTransfers[1].type === 'DEPOSIT') return

    additionalTransfers[0].type = 'TRANSFER'
    additionalTransfers[1].type = 'TRANSFER'
}

/**
 * add cost basis on all transactions where a new coing was purchased with SOL
 */
export const addCostBasisToPurchase = async (transfers: any[], despositsMeta: any[]) => {

    try {
        const depositToken = transfers.findIndex((transfer: any) => transfer.type === 'DEPOSIT')

        if (depositToken > -1) {
            const spotPriceMeta = await getTokenPriceAndVAA(transfers[depositToken].blockTime, transfers[depositToken].symbol);
            const boughtCostBasis = calculateCostBasis(spotPriceMeta)
            transfers[depositToken].value = calculateFiatValue(boughtCostBasis, transfers[depositToken].quantity)
            transfers[depositToken].costBasis = boughtCostBasis

            despositsMeta.push({
                symbol: transfers[0].symbol,
                hash: transfers[0].hash,
                quantity: transfers[0].quantity,
                spotPriceMeta: calculateCostBasis(spotPriceMeta)
            })
            return
        }


        const purchaseToken = transfers.findIndex((transfer: any) => transfer.quantity < 0)
        if (purchaseToken === -1) return

      

        const boughtToken = purchaseToken === 1 ? 0 : 1

        for (let i = 0; i < despositsMeta.length; i++) {
            if (despositsMeta[i].symbol === transfers[purchaseToken].symbol && despositsMeta[i].quantity > 0) {
                despositsMeta[i].quantity = despositsMeta[i].quantity + transfers[purchaseToken].quantity
                transfers[purchaseToken].refHash = despositsMeta[i].hash
                transfers[purchaseToken].costBasis = despositsMeta[i].spotPriceMeta
                const val = calculateFiatValue(despositsMeta[i].spotPriceMeta, transfers[purchaseToken].quantity)
                transfers[purchaseToken].value = val ? val * -1 : val
                if(transfers[0].type === 'SELL') break
                
                transfers[boughtToken].refHash = despositsMeta[i].hash

                const spotPriceMeta = await getTokenPriceAndVAA(transfers[boughtToken].blockTime, transfers[boughtToken].symbol);
                const boughtCostBasis = calculateCostBasis(spotPriceMeta)
                if(transfers[boughtToken].symbol === 'MNGO'){
                    console.log('kj')
                }
                transfers[boughtToken].costBasis = boughtCostBasis
                transfers[boughtToken].value = calculateFiatValue(boughtCostBasis, transfers[boughtToken].quantity)
                
                if(transfers[purchaseToken].value && transfers[boughtToken].value){
                    const gains = transfers[purchaseToken].value + transfers[boughtToken].value
                    transfers.push({
                            blockTime: transfers[boughtToken].blockTime,
                            timestamp: transfers[boughtToken].timestamp,
                            symbol: '',
                            symbolUri: gains > 0 ? '/gain.png' : '/loss.png',
                            quantity: 0,
                            type: gains > 0 ? 'GAIN' : 'LOSS',
                            price: 0,
                            value: gains,
                            hash: transfers[boughtToken].hash
                    }) 
                }
                
                despositsMeta.push({
                    symbol: transfers[boughtToken].symbol,
                    hash: transfers[boughtToken].hash,
                    quantity: transfers[boughtToken].quantity,
                    spotPriceMeta: boughtCostBasis
                })
                break;
            }
        }
    } catch (error) {
        console.log(error)
    }
    return

}

const calculateFiatValue = (boughtCostBasis: any, quantity: any) => {
    if(!(typeof boughtCostBasis === 'number') || isNaN(boughtCostBasis)) return

    if(!(typeof quantity === 'number') || isNaN(quantity)) return

    const qty = Math.abs(quantity)
    return boughtCostBasis * qty
}

const calculateCostBasis = (costBasis: any) => {
    const price = costBasis?.price?.price
    const decimals = Math.abs(costBasis?.price?.expo)
    if (!price) return 'N/A'

    // Convert string to number
    const number = parseFloat(price);

    // Check if the conversion was successful
    if (isNaN(number)) {
        return 'NaN'; // Return NaN if the conversion failed
    }

    // Convert number to string
    let result = number.toString();

    if(result.length < decimals){
       result =  "0".repeat((decimals - result.length) + 1) + result
    }

    // Insert decimal at the 5th index from the right
    const index = result.length - decimals;
    result = result.slice(0, index) + '.' + result.slice(index);

    return parseFloat(result); // Convert string back to number and return

}