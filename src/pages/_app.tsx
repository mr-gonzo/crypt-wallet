import "@/styles/globals.css";
import { createWeb3Modal, defaultWagmiConfig } from "@web3modal/wagmi/react";
import { useMemo } from 'react';
import { WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import '@solana/wallet-adapter-react-ui/styles.css';
import type { AppProps } from "next/app";
import { useEffect, useState } from "react";


export default function App({ Component, pageProps }: AppProps) {
	const [ready, setReady] = useState(false);
	const wallets = useMemo(() => [
		new PhantomWalletAdapter(),
		// Add other wallets here
	  ], []);

	useEffect(() => {
		setReady(true);
	}, []);
	return (
		<>
			{ready ? (
				 <WalletProvider wallets={wallets} autoConnect>
					<WalletModalProvider>
							<Component {...pageProps} />
					</WalletModalProvider>
   				 </WalletProvider>
			) : null}
		</>
	);
}
