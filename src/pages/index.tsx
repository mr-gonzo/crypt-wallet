import Head from "next/head";
import styles from "@/styles/Home.module.css";
import AppHeader from "@/components/header";
import { useBalance } from 'wagmi'
import { useState } from "react";
import type { Address } from "wagmi";
import Ledger from "@/components/ledger";

export default function Home() {
	// const { address, isConnecting, isDisconnected } = useAccount()
	const [address, setAddress] = useState<string>('')

	 function FindBalance() {
		
		const { data, isLoading, refetch } = useBalance({
		  address: address as Address,
		});
	  
		const [value, setValue] = useState("");
	  
		return (
		  <div>
			Wallet Address: <input onChange={(e) => setValue(e.target.value)} placeholder="wallet address" value={value} />
			<button onClick={() => (value === address ? refetch() : setAddress(value))}>{isLoading ? "fetching..." : "Import"}</button>
			{data?.formatted && <div>Balance: {data?.formatted}</div>}
		  </div>
		);
	  }

	return (
		<>
			<Head>
				<title>Wallet CPA</title>
				<meta
					name="description"
					content="dapp to calculate tax gains and losses"
				/>
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1"
				/>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<AppHeader />
			<main className={styles.main}>
				<div className={styles.wrapper}>
					<div className={styles.container}>
						<h1>Wallet Transactions</h1>
						
						{FindBalance()}
						<Ledger walletHash={address}/>
					</div>	
				</div>
			</main>
		</>
	);
}
