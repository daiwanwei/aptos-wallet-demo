import {createContext, useContext} from "react";

export interface TokenInfo{
    creator: string
    collectionName: string
    tokenName: string
    propertyVersion: string
    image:string
}

export interface CollectionHolderContextState{
    holder?:string
    isHolder:boolean
    tokens: TokenInfo[]
}

export const CollectionHolderContext=createContext({} as CollectionHolderContextState)

export function useCollectionHolder(){
    return useContext(CollectionHolderContext)
}
