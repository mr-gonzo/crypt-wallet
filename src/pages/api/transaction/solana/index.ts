export const runtime = 'edge'
import { Connection, PublicKey } from '@solana/web3.js';
import SolanaTransform from '../../transform/solana/dto';

const handler = async (req: any, res: any) => {
 
  if (req.method === 'GET') {
      const walletAddress = req.nextUrl.search.split('=')[1];
      const connection = new Connection(`${process.env.SOLANA_URL}`, 'confirmed');

      try {
        const publicKey = new PublicKey(walletAddress);
        const signatures = await connection.getSignaturesForAddress(publicKey);
        
        const sigs = signatures.map((sig) => {return sig.signature})
        const transactionDetails = await connection.getParsedTransactions(sigs, { maxSupportedTransactionVersion: 0 });
        const transactions = await SolanaTransform.convertTxToInuCap(transactionDetails, publicKey)

        return Response.json({ transactions });
      } catch (error) {
        console.error('Error fetching transactions:', JSON.stringify(error));
        return Response.json({ mesage: '500 error' })
      }

  }
}
export default handler