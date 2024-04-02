import Image from "next/image";
import styles from "@/styles/Home.module.css";
import { useState } from "react";

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
     <div className={styles.buttons}>
         <div
             onClick={closeAll}
             className={`${styles.highlight} ${
                 isNetworkSwitchHighlighted
                     ? styles.highlightSelected
                     : ``
             }`}
         >
             <w3m-network-button />
         </div>
         <div
             onClick={closeAll}
             className={`${styles.highlight} ${
                 isConnectHighlighted
                     ? styles.highlightSelected
                     : ``
             }`}
         >
             <w3m-button balance='hide' />
         </div>
     </div>
 </div>
</header>)
}

export default AppHeader