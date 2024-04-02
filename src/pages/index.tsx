import Head from "next/head";
import styles from "@/styles/Home.module.css";
import AppHeader from "@/components/header";
import { useBalance } from 'wagmi'
import { useState } from "react";
import type { Address } from "wagmi";
import Ledger from "@/components/ledger";
import Balance from "@/components/balance"

export default function Home() {
	const [address, setAddress] = useState<string>('')

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
						<Balance walletAddress={address} setAddress={setAddress}/>
						<Ledger walletAddress={address}/>
					</div>	
				</div>
			</main>
		</>
	);
}
