import {createContext, useContext} from "react";

export interface CollectionHolderContextState{
    holder?:string
    isHolder:boolean
}

export const CollectionHolderContext=createContext({} as CollectionHolderContextState)

export function useCollectionHolder(){
    return useContext(CollectionHolderContext)
}
