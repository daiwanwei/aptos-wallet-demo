import {createContext, useContext} from "react";

export interface Token{
    creator: string
    collectionName: string
    tokenName: string
    propertyVersion: string
    amount:number
    imageTemplate?: string
}

export interface TokenInfo{
    creator: string
    collectionName: string
    tokenName: string
    propertyVersion: string
    amount:number
    image: string
}

export interface CollectionHolderContextState{
    holder?:string
    isHolder:boolean
    tokens: Token[]
    getTokenInfo: (token:Token)=>Promise<TokenInfo>
}

export const CollectionHolderContext=createContext({} as CollectionHolderContextState)

export function useCollectionHolder(){
    return useContext(CollectionHolderContext)
}
