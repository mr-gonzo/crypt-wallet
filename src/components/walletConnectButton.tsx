import { useWallet, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

const WalletConnectButton = () => {
    const { publicKey } = useWallet();

    return (
        <div>
            <WalletMultiButton />
            {publicKey && <p style={{ fontSize: '10px' }}>Connected</p>}
        </div>
    );
}    
export default WalletConnectButton;
