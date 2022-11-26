import {FC, ReactNode, useMemo} from "react";
import {CollectionListContext} from "../hooks/useWhitelist";
import WHITELIST from "../vorp.json";

export interface CollectionListProviderProps {
    children: ReactNode
}

export const CollectionListProvider: FC<CollectionListProviderProps> = (
    {children}
) => {
    const collections = useMemo(() => {
        let l: {
            creator: string
            collectionName: string
            tokenName: string
            propertyVersion: string
        }[] = []
        for (let i of WHITELIST) {
            l.push({
                creator: i.creator,
                collectionName: i.collectionName,
                tokenName: i.tokenName,
                propertyVersion: i.propertyVersion,
            })
        }
        return l
    }, [])
    return (
        <CollectionListContext.Provider value={{collections}}>
            {children}
        </CollectionListContext.Provider>
    )
}
