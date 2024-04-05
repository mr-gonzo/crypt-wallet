import EtherTransform from "../../transform/ether/dto";

export const runtime = 'edge'

const handler = async (req: any, res: any) => {

    if (req.method === 'GET') {
        const walletAddress = req.nextUrl.search.split('=')[1];


        const url = `https://rpc.walletconnect.com/v1/account/${walletAddress}/history?projectId=${process.env.NEXT_PUBLIC_PROJECT_ID}`

        try {
            // Make a fetch request to your data source
            const response = await fetch(url);

            // Check if the request was successful
            if (!response.ok) {
                return Response.json({ mesage: '500 error' })
            }

            // Parse the response as JSON
            const jsonData = await response.json();
            const transactions = EtherTransform.convertTxToInuCap(jsonData.data)
            return Response.json({ transactions });

        } catch (error) {
            console.error('Error fetching transactions:', JSON.stringify(error));
            return Response.json({ mesage: '500 error' })
        }

    }
}
export default handler