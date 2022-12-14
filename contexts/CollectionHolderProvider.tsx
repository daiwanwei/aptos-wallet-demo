import {FC, ReactNode, useCallback, useEffect, useMemo, useState} from "react";
import {useWallet} from "@manahippo/aptos-wallet-adapter";
import {useAptosClient} from "../hooks/useAptosClient";
import {CollectionHolderContext} from "../hooks/useCollectionHolder";
import {useCollectionList} from "../hooks/useWhitelist";
import {getCollectionDataHandle, getHeldTokens, getUserTokens,getTokenInfo as getTokenData} from "../helpers/token";

export interface CollectionHolderProviderProps{
    children:ReactNode
}

export interface Token{
    creator: string
    collectionName: string
    tokenName: string
    propertyVersion: string
    amount:number
    imageTemplate?: string
}

export const CollectionHolderProvider:FC<CollectionHolderProviderProps>=(
    {children}
)=>{
    const {walletClient}=useAptosClient()
    const {account}=useWallet()
    const {collections}=useCollectionList()
    const holder=useMemo(()=>account?.address?.toString() ,[account])
    const [isHolder,setIsHolder]=useState(false)
    const [tokens,setTokens]=useState<Token[]>([])
    const getTokenInfo=useCallback( async (token:Token)=>{
        const handle=await getCollectionDataHandle(walletClient,token.creator)
        const info=await getTokenData(walletClient,handle,token)
        return info
    },[walletClient])
    useEffect(()=>{
        const updateData=async ()=>{
            if (!holder){
                setIsHolder(false)
                return
            }
            const userTokens=await getUserTokens(walletClient,holder)
            console.log(userTokens)
            const hold=await getHeldTokens(walletClient,holder,collections)
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
        <CollectionHolderContext.Provider value={{holder,isHolder,tokens,getTokenInfo}}>
            {children}
        </CollectionHolderContext.Provider>
    )
}
