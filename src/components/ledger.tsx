import React, { useState, useEffect } from 'react';
import Image from "next/image";
import styles from "@/styles/Home.module.css";
import { EthLedgerItem, EthLedgerTransfer } from "@/models/ether/transaction"

type props = {
    accountAddress: string
}
const Ledger = ({ accountAddress }: props) => {
    const ethUrl = `http://localhost:3000/api/transaction/ether?walletAddress=${accountAddress}`
    const solanaUrl = `http://localhost:3000/api/transaction/solana?walletAddress=${accountAddress}`

    // State to store the fetched data
    const [data, setData] = useState<[]>([]);
    // State to track loading status
    const [loading, setLoading] = useState(true);
    // State to track error status
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Make a fetch request to your data source
                let response = await fetch(solanaUrl);
                // Check if the request was successful
                // if (!response.ok) {
                //     throw new Error('Failed to fetch data');
                // }

                // Parse the response as JSON
                let jsonData = await response.json();

                if (!jsonData || !jsonData.transactions || jsonData.transactions.length === 0) {
                    response = await fetch(ethUrl);
                    jsonData = await response.json();
                }
                // Set the fetched data in the state
                const resp = jsonData.transactions

                setData(resp);
                setLoading(false);
                setError(null);
            } catch (error: Error | any) {
                // Set error state if an error occurs
                setError(error);
                setLoading(false);
            }
        };

        // Call the fetchData function when the component mounts
        if (accountAddress !== '') {
            fetchData();
        }


        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [accountAddress]); //// Empty dependency array to ensure useEffect only runs once

    const renderCostBasis = (costBasis: any) => {
        const price = costBasis?.price?.price
        const decimals = Math.abs(costBasis?.price?.expo)
        if (!price) return 'N/A'

        // Convert string to number
        const number = parseFloat(price);

        // Check if the conversion was successful
        if (isNaN(number)) {
            return NaN; // Return NaN if the conversion failed
        }

        // Convert number to string
        let result = number.toString();

        // Insert decimal at the 5th index from the right
        const index = result.length - decimals;
        result = result.slice(0, index) + '.' + result.slice(index);

        return parseFloat(result); // Convert string back to number and return

    }

    if (accountAddress === '') return

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
                <div className={styles.ledgerCell}>Token</div>
                <div className={styles.ledgerCell}>Units</div>
                <div className={styles.ledgerCell}>Basis</div>
                <div className={styles.ledgerCell}>Type</div>
                <div className={styles.ledgerCell}>ID</div>
                <div className={styles.ledgerCell}>ID Ref</div>
                <div className={styles.ledgerCell}>Spot Rate</div>
            </div>

            {data && (
                data.map((item: any, idx: number) => {
                    return (
                        <>
                            <div key={`${item.id}-date-header-${idx}`} className={`${styles.ledgerRow} ${styles.ledgerHeader}`} >
                                <div key={`${item.id}-date-${idx}`} className={styles.ledgerCell}>{new Date(item.timestamp).toDateString()} </div>
                            </div>


                            {item.transfers?.map((tx: any, index: number) => {
                                if(tx.type?.endsWith('GAIN/LOSS') || tx.type === 'CASH'){
                                    return (
                                        <div key={`${item.id}-row-${index}`} className={styles.ledgerRow}>
                                            <div key={`${item.id}-sym-${index}`} className={styles.ledgerCell}></div>
                                            <div key={`${item.id}-value-${index}`} className={styles.ledgerCell}></div>
                                            <div key={`${item.id}-price-${index}`} className={styles.ledgerCell}>{tx.value?.toFixed(2)}</div>
                                            <div key={`${item.id}-dir-${index}`} className={styles.ledgerCell}>{tx.type} </div>
                                            <div key={`${item.id}-tx-${index}`} className={styles.ledgerCell}></div>
                                            <div key={`${item.id}-hash-${index}`} className={styles.ledgerCell}></div>
                                            <div key={`${item.id}-na-${index}`} className={styles.ledgerCell}>{tx.type === 'CASH' ? tx.costBasis : ''}</div>
                                        </div>
                                    )
                                } else {
                                return (
                                    <div key={`${item.id}-row-${index}`} className={styles.ledgerRow}>
                                        <div key={`${item.id}-sym-${index}`} className={styles.ledgerCell}>
                                            <Image
                                                src={tx.symbolUri}
                                                alt=""
                                                height="35"
                                                width="35"
                                                className={styles.round}
                                            />
                                            {tx.symbol}</div>
                                        <div key={`${item.id}-value-${index}`} className={styles.ledgerCell}>{tx.quantity?.toFixed(4)}</div>
                                        <div key={`${item.id}-price-${index}`} className={styles.ledgerCell}>{tx.value?.toFixed(2)}</div>
                                        <div key={`${item.id}-dir-${index}`} className={styles.ledgerCell}>{tx.type} </div>
                                        <div key={`${item.id}-tx-${index}`} className={styles.ledgerCell}>{item.hash?.substring(0, 7)}</div>
                                        <div key={`${item.id}-hash-${index}`} className={styles.ledgerCell}>{tx.refHash?.substring(0,7)}</div>
                                        <div key={`${item.id}-na-${index}`} className={styles.ledgerCell}>{tx.costBasis}</div>
                                    </div>
                                )
                            }
                            })
                            }
                        </>
                    )
                })
            )}
        </div>
    );
};

export default Ledger;
