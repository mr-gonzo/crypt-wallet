export type portfolio = {
    wallets: [EthWallet]
}
export type EthWallet = {
    account: [EthAccount]
}

export type EthAccount = {
    ledger: [EthLedgerItem]
}

export type EthLedgerMetaData = {
    operationType: string
    hash: string
    status: string
    minedAt: Date
}
export type EthLedgerTransfer = {
    fungible_info: { name: string, symbol: string }
    nft_info: { flags: { is_spam: boolean } }
    direction: string
    quantity: { numeric: string }
    value: number
    price: number
}
export type EthLedgerItem = {
    id: string
    metadata: EthLedgerMetaData
    transfers: [EthLedgerTransfer]
}