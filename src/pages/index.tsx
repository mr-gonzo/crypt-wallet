import Head from "next/head";
import styles from "@/styles/Home.module.css";
import AppHeader from "@/components/header";
import { useState } from "react";
import Balance from "@/components/balance"
import Ledger from "@/components/ledger";

export default function Home() {
	const [address, setAddress] = useState<string>('')

	return (
		<>
			<Head>
				<title>Inu Capital</title>
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
						<h1>Account Transactions</h1>
						<Balance accountAddress={address} setAddress={setAddress}/>
						<Ledger accountAddress={address}/>
					</div>	
				</div>
			</main>
		</>
	);
}
