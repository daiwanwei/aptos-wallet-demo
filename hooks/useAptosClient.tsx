import {AptosClient, TokenClient} from "aptos";
import {createContext, useContext} from "react";
import {WalletClient} from "@martiandao/aptos-web3-bip44.js";

export interface AptosClientContextState{
    client: AptosClient
    tokenClient:TokenClient
    walletClient:WalletClient
}

export const AptosClientContext=createContext({} as AptosClientContextState)

export function useAptosClient():AptosClientContextState{
    return useContext(AptosClientContext)
}
