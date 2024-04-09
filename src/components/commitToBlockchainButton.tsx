import React from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey, Transaction, TransactionInstruction } from '@solana/web3.js';
import * as borsh from 'borsh';

// Use bigint only for fields that might exceed JavaScript's safe integer limit.
interface ITransfer {
  timestamp: string;
  symbol: string;
  symbolUri: string;
  quantity: bigint; // bigint is used for representing large numbers
  type: string;
  price: bigint;
  costBasis: bigint | "N/A"; // "N/A" for non-applicable values
}

interface IDataObject {
  blockTime: bigint;
  timestamp: string;
  hash: string;
  transfers: ITransfer[];
}

class Transfer {
  timestamp: string;
  symbol: string;
  symbolUri: string;
  quantity: bigint;
  type: string;
  price: bigint;
  costBasis: bigint | "N/A";

  constructor({ timestamp, symbol, symbolUri, quantity, type, price, costBasis }: ITransfer) {
    this.timestamp = timestamp;
    this.symbol = symbol;
    this.symbolUri = symbolUri;
    this.quantity = quantity;
    this.type = type;
    this.price = price;
    this.costBasis = costBasis;
  }
}

class DataObject {
  blockTime: bigint;
  timestamp: string;
  hash: string;
  transfers: Transfer[];

  constructor({ blockTime, timestamp, hash, transfers }: IDataObject) {
    this.blockTime = blockTime;
    this.timestamp = timestamp;
    this.hash = hash;
    this.transfers = transfers.map(transfer => new Transfer(transfer));
  }
}

// Define Borsh schema for serialization
const schema: borsh.Schema = new Map([
    [Transfer, {
      kind: 'struct',
      fields: [
        ['timestamp', 'string'],
        ['symbol', 'string'],
        ['symbolUri', 'string'],
        ['quantity', 'u64'], // Adjust based on your actual use case
        ['type', 'string'],
        ['price', 'u64'], // Adjust based on your actual use case
        // Note: Handling 'costBasis' as 'u64' or a custom type will require adjustments
        ['costBasis', 'string'], // Simplified for example purposes
      ],
    }],
    [DataObject, {
      kind: 'struct',
      fields: [
        ['blockTime', 'u64'], // Adjust based on your actual use case
        ['timestamp', 'string'],
        ['hash', 'string'],
        ['transfers', [Transfer]],
      ],
    }],
  ]) as any; // Using 'as any' to bypass TypeScript's static typing for borsh schema
  

const CommitToBlockChain: React.FC<{ data: IDataObject }> = ({ data }) => {
  const wallet = useWallet();

  const commit = async () => {
    if (!wallet.connected || !wallet.publicKey) {
      console.log('Wallet is not connected');
      return;
    }

    try {
      const connection = new Connection("https://api.devnet.solana.com", 'confirmed');
      const programId = new PublicKey('Eni3PSJNViHa85m4t9whHUdHKacs23HhjvhnjFtd7RLT');

      // Prepare the data for serialization
      const preparedData = new DataObject(data); // Assuming data matches IDataObject
      
      // Serialize the data using the Borsh schema
      const serializedData = borsh.serialize(schema, preparedData);

      const instruction = new TransactionInstruction({
        keys: [{ pubkey: wallet.publicKey, isSigner: true, isWritable: false }],
        programId,
        data: Buffer.from(serializedData),
      });

      const transaction = new Transaction().add(instruction);
      const signature = await wallet.sendTransaction(transaction, connection);
      console.log('Transaction sent:', signature);

      const latestBlockHash = await connection.getLatestBlockhash();

        await connection.confirmTransaction({
            blockhash: latestBlockHash.blockhash,
            lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
            signature: signature,
        });           console.log('Transaction confirmed');
    } catch (error) {
      console.error('Transaction error:', error);
    }
  };

  return (
    <div>
      <button onClick={commit} disabled={!wallet.connected}>
        Commit Transaction
      </button>
    </div>
  );
};

export default CommitToBlockChain;




// const commit = async () => {
//     if (!wallet.connected || !wallet.publicKey) {
//         console.log('Wallet is not connected');
//         return;
//     }

//     try {
//         const connection = new Connection("https://api.devnet.solana.com", 'confirmed');
//         const programId = new PublicKey('Eni3PSJNViHa85m4t9whHUdHKacs23HhjvhnjFtd7RLT');

//         // Assuming the add function expects two numbers as u8 integers
//         const numbersToAdd = Buffer.from([3, 5]); // Example: adding 3 and 5

//         const instruction = new TransactionInstruction({
//             keys: [{ pubkey: wallet.publicKey, isSigner: true, isWritable: false }], // Adjust based on your program's needs
//             programId,
//             data: numbersToAdd, // Your instruction data here
//         });

//         const transaction = new Transaction().add(instruction);
//         console.log('transaction', transaction)
//         console.log('connection', connection)
//         console.log('Wallet connection', wallet.connected);

//         const signature = await wallet.sendTransaction(transaction, connection);
//         console.log('Transaction sent:', signature);

//         const latestBlockHash = await connection.getLatestBlockhash();

//         await connection.confirmTransaction({
//             blockhash: latestBlockHash.blockhash,
//             lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
//             signature: signature,
//         });            
//         console.log('Transaction confirmed');
//     } catch (error) {
//         console.error('Transaction error:', error);
//     }
// };
  