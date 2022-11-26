import {FC, ReactNode, useEffect, useMemo, useState} from "react";
import {useWallet} from "@manahippo/aptos-wallet-adapter";
import {useAptosClient} from "../hooks/useAptosClient";
import {CollectionHolderContext} from "../hooks/useCollectionHolder";
import {useCollectionList} from "../hooks/useWhitelist";
import {getHeldTokens, getUserTokens, verifyHolder} from "../helpers/token";

export interface CollectionHolderProviderProps{
    children:ReactNode
}

export interface TokenInfo{
    creator: string
    collectionName: string
    tokenName: string
    propertyVersion: string
    image:string
}

export const CollectionHolderProvider:FC<CollectionHolderProviderProps>=(
    {children}
)=>{
    const {walletClient}=useAptosClient()
    const {account}=useWallet()
    const {collections}=useCollectionList()
    const holder=useMemo(()=>account?.address?.toString() ,[account])
    const [isHolder,setIsHolder]=useState(false)
    const [tokens,setTokens]=useState<TokenInfo[]>([])
    useEffect(()=>{
        const updateData=async ()=>{
            if (!holder){
                setIsHolder(false)
                return
            }
            const userTokens=await getUserTokens(walletClient,holder)
            console.log(userTokens)
            const hold=getHeldTokens(userTokens,collections)
            setTokens(hold)
            if (hold.length>0) {
                setIsHolder(true)
            }else {
                setIsHolder(false)
            }
        }
        updateData()
            .then(()=>console.log(`updateIsHolder successfully`))
            .catch((err)=>console.log(`updateIsHolder fail,err:${err}`))
    },[holder,walletClient])
    return(
        <CollectionHolderContext.Provider value={{holder,isHolder,tokens}}>
            {children}
        </CollectionHolderContext.Provider>
    )
}
