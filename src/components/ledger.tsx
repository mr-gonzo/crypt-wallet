import React, { useState, useEffect } from 'react';
import styles from "@/styles/Home.module.css";

type ILedgerMetaData = {
    operationType: string
    hash: string
    status: string
    minedAt: Date
}
type ILedgerTransfer = {
    fungible_info: { name: string, symbol: string }
    nft_info: { flags: { is_spam: boolean } }
    direction: string
    quantity: { numeric: string }
    value: number
    price: number
}
type ILedger = {
    id: string
    metadata: ILedgerMetaData
    transfers: [ILedgerTransfer]
}
type props = {
    walletHash: string
}
const Ledger = ({walletHash}: props) => {
    const url = `https://rpc.walletconnect.com/v1/account/${walletHash}/history?projectId=7cf03f144bfc35f92501d533a91f20ed`
    // State to store the fetched data
    const [data, setData] = useState<ILedger[]>([]);
    // State to track loading status
    const [loading, setLoading] = useState(true);
    // State to track error status
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Make a fetch request to your data source
                const response = await fetch(url);

                // Check if the request was successful
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }

                // Parse the response as JSON
                const jsonData = await response.json();

                // Set the fetched data in the state
                const resp = jsonData.data
                const filteredResp = resp.filter((tx: ILedger) =>{
                    if(tx.transfers[0]?.nft_info?.flags?.is_spam) return false;
                    if(tx.transfers[0]?.fungible_info?.symbol?.length > 5) return false
                    else return true;

                })
                setData(filteredResp);
                setLoading(false);
            } catch (error: Error | any) {
                // Set error state if an error occurs
                setError(error);
                setLoading(false);
            }
        };

        // Call the fetchData function when the component mounts
        if(walletHash !== ''){
            fetchData();
        }
     

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [walletHash]); // Empty dependency array to ensure useEffect only runs once

    if( walletHash === '') return 

    // If loading, display a loading message
    if (loading) {
        return <div>Loading...</div>;
    }

    // If there's an error, display the error message
    if (error) {
        return <div>Error: {JSON.stringify(error)}</div>;
    }

    // If data is fetched successfully, display it
    return (
        <div>
            <div className={`${styles.ledgerRow} ${styles.ledgerHeader}`} >
                <div className={styles.ledgerCell}>Portfolio Asset</div>
                <div className={styles.ledgerCell}>Units Transacted</div>
                <div className={styles.ledgerCell}>Basis</div>
                <div className={styles.ledgerCell}>Type</div>
                <div className={styles.ledgerCell}>Data Source</div>
                <div className={styles.ledgerCell}>Transaction ID</div>
                <div className={styles.ledgerCell}>Asset Transacted</div>
                <div className={styles.ledgerCell}>Spot Rate</div>
            </div>
            {/* Your rendering logic for the fetched data */}
            {data && (
                <div>
                    {data.map((item: ILedger, index: number) => {
                        if (item.metadata.operationType !== 'receive' && item.metadata.operationType === 'send') return;
                        return (
                            <>
                                <div className={`${styles.ledgerRow} ${styles.ledgerHeader}`} >
                                    <div className={styles.ledgerCell}>{new Date(item.metadata.minedAt).toDateString()} </div>
                                </div>


                                {item.transfers?.map((tx) => {
                                    if (tx.nft_info?.flags?.is_spam) {
                                        return (
                                            <div className={styles.ledgerRow}>
                                                <div className={styles.ledgerCell}>Spam transaction </div>
                                            </div>
                                        )
                                    }

                                    return (
                                        <div key={`${item.id}-${index}`} className={styles.ledgerRow}>
                                            <div className={styles.ledgerCell}>{tx.fungible_info?.symbol?.substring(0, 4)}</div>
                                            <div className={styles.ledgerCell}>{tx.quantity?.numeric?.substring(0, 5)}</div>
                                            <div className={styles.ledgerCell}>{tx.price?.toFixed(5)}</div>
                                            <div className={styles.ledgerCell}>{tx.direction === 'out' ? 'Sell' : 'Buy'} </div>
                                            <div className={styles.ledgerCell}>Wallet</div>
                                            <div className={styles.ledgerCell}>TX{item.metadata.hash?.substring(0, 5)}</div>
                                            <div className={styles.ledgerCell}>N/A</div>
                                            <div className={styles.ledgerCell}>N/A</div>
                                        </div>
                                    )
                                })}
                            </>
                        )
                    })
                    }
                </div>
            )}
        </div>
    );
};

export default Ledger;
