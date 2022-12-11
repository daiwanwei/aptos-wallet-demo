import {FC, ReactNode, useMemo} from "react";
import {CollectionListContext} from "../hooks/useWhitelist";
import WHITELIST from "../whitelist.json";

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
            imageTemplate?: string
        }[] = []
        for (let i of WHITELIST) {
            l.push({
                creator: i.creator,
                collectionName: i.collectionName,
                imageTemplate: i.imageTemplate
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
