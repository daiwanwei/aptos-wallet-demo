import React, {FC, useCallback, useEffect, useState} from "react";
import {Token, TokenInfo, useCollectionHolder} from "../hooks/useCollectionHolder";

export const CollectionHolderProfile: FC = ({  }) => {
    const {isHolder,holder,tokens,getTokenInfo}=useCollectionHolder();
    const [images,setImages]=useState<Map<string,string>>(new Map())
    const generateKey=useCallback((data:any)=>JSON.stringify(data),[])
    const getImage=useCallback((token:Token)=>{
        const key=generateKey(token)
        if (images.has(key)){
            return images.get(key)
        }else {
            return null
        }
    },[images])
    useEffect(()=>{
        const update=async ()=>{
            const newMap=new Map()
            await Promise.all(tokens.map(async (token)=>{
                const key=generateKey(token)
                if (!newMap.has(key)){
                    const info=await getTokenInfo(token)
                    newMap.set(key,info.image)
                }
            }))
            setImages(newMap)
        }
        update()
            .then(()=>console.log(`image map update successfully`))
            .catch((err)=>console.log(`image map update fail,err:${err}`))
    },[tokens])
    return (
        <ul >
            <li >
                holder : {holder ? holder : 'not found'}
            </li>
            <li >
                is holder : {isHolder ? "yes" : 'no'}
            </li>
            <div>
                {tokens.map((token,i)=>{
                    return(
                        <div key={`token-data-${i}`}>
                            <h3>
                                {`${token.collectionName}: ${token.tokenName}`}
                            </h3>
                            <img src={getImage(token) || ""} defaultValue={`${token.tokenName}`} width="100"/>
                        </div>
                    )
                })}
            </div>
        </ul>
    );
};
