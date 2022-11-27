import {FC, ReactNode, useMemo} from "react";
import {AptosClient, TokenClient} from "aptos";
import {AptosClientContext} from "../hooks/useAptosClient";
import {useWallet} from "@manahippo/aptos-wallet-adapter";
import {WalletClient} from "@martiandao/aptos-web3-bip44.js";

export interface AptosClientProviderProps {
    children: ReactNode
}


export const AptosClientProvider: FC<AptosClientProviderProps> = (
    {children}
) => {
    const {network}=useWallet()
    const endpoint=network?.api || "https://fullnode.mainnet.aptoslabs.com/v1"
    const faucet="https://faucet.testnet.aptoslabs.com"
    const client = useMemo(() => new AptosClient(endpoint), [endpoint])
    const tokenClient = useMemo(() => new TokenClient(client), [client])
    const walletClient= useMemo(() => new WalletClient(endpoint,faucet), [endpoint])
    return (
        <AptosClientContext.Provider value={{client,tokenClient,walletClient}}>
            {children}
        </AptosClientContext.Provider>
    )
}
