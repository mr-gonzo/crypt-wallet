import { EthWallet } from "../ether/transaction"

export type portfolio = {
    wallets: [EthWallet]
}
export type Wallet = {
    account: [Account]
}

export type Account = {
    ledger: [LedgerItem]
}

export type LedgerMetaData = {
    operationType: string
    hash: string
    status: string
    minedAt: Date
}
export type LedgerTransfer = {
    fungible_info: { name: string, symbol: string }
    nft_info: { flags: { is_spam: boolean } }
    direction: string
    quantity: { numeric: string }
    value: number
    price: number
}
export type LedgerItem = {
    id: string
    metadata: LedgerMetaData
    transfers: [LedgerTransfer]
}