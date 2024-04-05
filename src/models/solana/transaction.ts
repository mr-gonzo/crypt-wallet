// https://github.com/solana-labs/solana-web3.js/blob/31916ae5d4fb29f239c63252a59745e33a6979ea/packages/rpc-graphql/src/schema/transaction.ts
interface TransactionInstruction {
    [key: string]: any;
}

interface UiTokenAmount {
    amount: string,
    decimals: number,
    uiAmount: number,
    uiAmountString: string
}
interface TokenBalance {
    accountIndex: 2,
    mint: string,
    owner: string,
    programId: string,
    uiTokenAmount: UiTokenAmount
}
interface Reward {
    [key: string]: any;
}
interface Address {
    [key: string]: any;
}
interface TransactionEncoding {
    [key: string]: any;
}
interface ReturnData {
    [key: string]: any;
}
interface Signature {
    [key: string]: any;
}
interface Slot {
    [key: string]: any;
}

export type TransactionStatusOk = {
    Ok: string
}

export type TransactionStatusErr = {
    Err: string
}
export type TransactionStatus = TransactionStatusOk | TransactionStatusErr

export type TransactionLoadedAddresses = {
    readonly: [string]
    writable: [string]
}

export type TransactionInnerInstruction = {
    index: number
    instructions: [TransactionInstruction]
}

export type TransactionMeta = {
    computeUnitsConsumed: BigInt
    err: string
    fee: BigInt
    innerInstructions: [TransactionInnerInstruction]
    loadedAddresses: TransactionLoadedAddresses
    logMessages: [string]
    postBalances: [BigInt]
    postTokenBalances: [TokenBalance]
    preBalances: [BigInt]
    preTokenBalances: [TokenBalance]
    returnData: ReturnData
    rewards: [Reward]
    status: TransactionStatus
}

export type TransactionMessageAccountKey = {
    pubkey: Address
    signer: Boolean
    source: string
    writable: Boolean
}

export type TransactionMessageAddressTableLookup = {
    accountKey: Address
    readableIndexes: [number]
    writableIndexes: [number]
}

export type TransactionMessageHeader = {
    numReadonlySignedAccounts: number
    numReadonlyUnsignedAccounts: any
    numRequiredSignatures: number
}

export type TransactionMessage = {
    accountKeys: [string]
    addressTableLookups: [TransactionMessageAddressTableLookup]
    header: TransactionMessageHeader
    instructions: [TransactionInstruction]
    recentBlockhash: string
}


export type Transaction = {
    blockTime: BigInt
    data(encoding: TransactionEncoding): string
    transaction: TransactionMessage
    meta: TransactionMeta
    signatures: [Signature]
    slot: Slot
    version: string
}
