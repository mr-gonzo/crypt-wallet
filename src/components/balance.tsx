
import { useState } from 'react';
import { useBalance } from 'wagmi'
import type { Address } from "wagmi";
type SetStateFunction<T> = React.Dispatch<React.SetStateAction<T>>;

type props = {
    accountAddress: string
    setAddress: SetStateFunction<string>
}

function Balance({ accountAddress, setAddress }: props) {
    const [value, setValue] = useState("");

    // const { data, isLoading, refetch } = useBalance({
    //     address: accountAddress as Address,
    // });

    const handleImport = (value: string) => {
        if(value !== accountAddress){
            setAddress(value)
        } 
    }


    return (
        <div>
            Wallet Address: <input onChange={(e) => setValue(e.target.value)} placeholder="wallet address" value={value} />

            <button onClick={() => handleImport(value)}>Import</button>

            {/* {data?.formatted && <div>Balance: {data?.formatted}</div>}      </div> */}
            </div>
    );
}

export default Balance