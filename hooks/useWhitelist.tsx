import {createContext, useContext} from "react";

export interface CollectionListContextState{
    collections:Collection[]
}

export interface Collection{
    creator: string
    collectionName: string
    imageTemplate?: string
}

export const CollectionListContext=createContext({} as CollectionListContextState)

export function useCollectionList(){
    return useContext(CollectionListContext)
}
