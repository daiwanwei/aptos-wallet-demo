import type { FC, ReactNode } from 'react';
import React, { useState } from 'react';
import { WalletModalContext } from '../hooks/useWalletModal';
import { WalletModal,WalletModalProps } from '../components/WalletModal';

export interface WalletModalProviderProps extends WalletModalProps {
    children: ReactNode;
}

export const WalletModalProvider: FC<WalletModalProviderProps> = ({ children, ...props }) => {
    const [visible, setVisible] = useState(false);

    return (
        <WalletModalContext.Provider
            value={{
                visible,
                setVisible,
            }}
        >
            {visible && <h1>Dog!</h1>}
            {visible && <WalletModal {...props} />}
            {children}
        </WalletModalContext.Provider>
    );
};
