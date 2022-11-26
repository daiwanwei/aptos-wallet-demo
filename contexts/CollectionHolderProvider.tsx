import {FC, ReactNode, useEffect, useMemo, useState} from "react";
import {useWallet} from "@manahippo/aptos-wallet-adapter";
import {useAptosClient} from "../hooks/useAptosClient";
import {CollectionHolderContext} from "../hooks/useCollectionHolder";
import {useCollectionList} from "../hooks/useWhitelist";
import {getUserTokens, verifyHolder} from "../helpers/token";

export interface CollectionHolderProviderProps{
    children:ReactNode
}

export const CollectionHolderProvider:FC<CollectionHolderProviderProps>=(
    {children}
)=>{
    const {walletClient}=useAptosClient()
    const {account}=useWallet()
    const {collections}=useCollectionList()
    const holder=useMemo(()=>account?.address?.toString() ,[account])
    const [isHolder,setIsHolder]=useState(false)
    useEffect(()=>{
        const updateIsHolder=async ()=>{
            if (!holder){
                setIsHolder(false)
                return
            }
            const userTokens=await getUserTokens(walletClient,holder)
            const hold=verifyHolder(userTokens,collections)
            setIsHolder(hold)
        }
        updateIsHolder()
            .then(()=>console.log(`updateIsHolder successfully`))
            .catch((err)=>console.log(`updateIsHolder fail,err:${err}`))
    },[holder,walletClient])
    return(
        <CollectionHolderContext.Provider value={{holder,isHolder}}>
            {children}
        </CollectionHolderContext.Provider>
    )
}
