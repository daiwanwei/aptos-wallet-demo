import {FC, ReactNode, useMemo} from "react";
import {WalletModalProvider} from "./WalletModalProvider";
import {
    AptosWalletAdapter,
    HippoExtensionWalletAdapter,
    MartianWalletAdapter, PontemWalletAdapter,
    WalletProvider
} from "@manahippo/aptos-wallet-adapter";
import {CollectionListProvider} from "./CollectionListProvider";
import {CollectionHolderProvider} from "./CollectionHolderProvider";

export interface ContextProviderProps{
    children:ReactNode
}

export const ContextProvider:FC<ContextProviderProps>=(
    {children}
)=>{
    const wallets = useMemo(
        () => [
            new HippoExtensionWalletAdapter(),
            new MartianWalletAdapter(),
            new AptosWalletAdapter(),
            new PontemWalletAdapter(),
        ],
        []
    );
    return (
        <WalletProvider
            autoConnect={true}
            wallets={wallets}
            onError={(error: Error) => {
                console.log('wallet errors: ', error);
            }}>
            <WalletModalProvider>
                <CollectionListProvider>
                    <CollectionHolderProvider >
                        {children}
                    </CollectionHolderProvider>
                </CollectionListProvider>
            </WalletModalProvider>
        </WalletProvider>
    )
}
