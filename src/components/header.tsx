import Image from "next/image";
import styles from "@/styles/Home.module.css";
import { useState } from "react";
import WalletConnectButton from "./walletConnectButton"


function AppHeader() {
    const [isNetworkSwitchHighlighted, setIsNetworkSwitchHighlighted] =
        useState(false);
    const [isConnectHighlighted, setIsConnectHighlighted] = useState(false);

    const closeAll = () => {
        setIsNetworkSwitchHighlighted(false);
        setIsConnectHighlighted(false);
    };
    return (

        <header>
            <div
                className={styles.backdrop}
                style={{
         opacity:
             isConnectHighlighted || isNetworkSwitchHighlighted
                 ? 1
                 : 0,
     }}
 />
 <div className={styles.header}>
     <div className={styles.logo}>
         <Image
             src="/logoA.png"
             alt="WalletConnect Logo"
             height="32"
             width="203"
         />
     </div>
     <WalletConnectButton />
 </div>
</header>)
}

export default AppHeader