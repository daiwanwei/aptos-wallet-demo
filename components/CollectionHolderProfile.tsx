import React, {FC} from "react";
import {useCollectionHolder} from "../hooks/useCollectionHolder";

export const CollectionHolderProfile: FC = ({  }) => {
    const {isHolder,holder,tokens}=useCollectionHolder();
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
                            <img src={token.image} defaultValue={`${token.tokenName}`}/>
                        </div>
                    )
                })}
            </div>
        </ul>
    );
};
