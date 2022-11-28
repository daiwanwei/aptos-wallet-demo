import {FC, ReactNode, useMemo} from "react";
import {WalletModalProvider} from "./WalletModalProvider";
import {
    AptosWalletAdapter,
    MartianWalletAdapter, PontemWalletAdapter,
    BloctoWalletAdapter, RiseWalletAdapter,
    FewchaWalletAdapter,
    WalletProvider, WalletAdapterNetwork
} from "@manahippo/aptos-wallet-adapter";
import {CollectionListProvider} from "./CollectionListProvider";
import {CollectionHolderProvider} from "./CollectionHolderProvider";
import {AptosClientProvider} from "./AptosClientProvider";

export interface ContextProviderProps{
    children:ReactNode
}

export const ContextProvider:FC<ContextProviderProps>=(
    {children}
)=>{
    const wallets = useMemo(
        () => [
            new FewchaWalletAdapter(),
            new MartianWalletAdapter(),
            new AptosWalletAdapter(),
            new PontemWalletAdapter(),
            new RiseWalletAdapter(),
            new BloctoWalletAdapter({
                network: WalletAdapterNetwork.Mainnet, bloctoAppId:'6d85f56e-5f2e-46cd-b5f2-5cf9695b4d46'
            }),
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
                <AptosClientProvider>
                    <CollectionListProvider>
                        <CollectionHolderProvider >
                            {children}
                        </CollectionHolderProvider>
                    </CollectionListProvider>
                </AptosClientProvider>
            </WalletModalProvider>
        </WalletProvider>
    )
}
