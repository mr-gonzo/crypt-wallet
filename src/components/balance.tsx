
import { useState } from 'react';
import { useBalance } from 'wagmi'
import type { Address } from "wagmi";
type SetStateFunction<T> = React.Dispatch<React.SetStateAction<T>>;

type props = {
    walletAddress: string
    setAddress: SetStateFunction<string>
}

function Balance({ walletAddress, setAddress }: props) {
    const [value, setValue] = useState("");

    const { data, isLoading, refetch } = useBalance({
        address: walletAddress as Address,
    });

    const handleImport = (value: string) => {
        if(value === walletAddress){
            refetch()
        } else {
            setAddress(value)
        }

    }


    return (
        <div>
            Wallet Address: <input onChange={(e) => setValue(e.target.value)} placeholder="wallet address" value={value} />

            <button onClick={() => handleImport(value)}>{isLoading ? "fetching..." : "Import"}</button>

            {data?.formatted && <div>Balance: {data?.formatted}</div>}      </div>
    );
}

export default Balance