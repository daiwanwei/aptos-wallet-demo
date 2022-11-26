import {createContext, useContext} from "react";

export interface CollectionListContextState{
    collections:Collection[]
}

export interface Collection{
    creator: string
    collectionName: string
    tokenName: string
    propertyVersion: string
    image:string
}

export const CollectionListContext=createContext({} as CollectionListContextState)

export function useCollectionList(){
    return useContext(CollectionListContext)
}
