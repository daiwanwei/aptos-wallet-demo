import React, {FC} from "react";
import {useCollectionHolder} from "../hooks/useCollectionHolder";

export const CollectionHolderProfile: FC = ({  }) => {
    const {isHolder,holder}=useCollectionHolder();
    return (
        <ul >
            <li >
                holder : {holder ? holder : 'not found'}
            </li>
            <li >
                is holder : {isHolder ? "yes" : 'no'}
            </li>
        </ul>
    );
};
