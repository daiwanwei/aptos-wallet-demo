import React, {FC, useCallback, useEffect, useMemo, useRef, useState} from "react";
import {Button, ButtonProps} from "./Button";
import { useWallet, SignMessageResponse} from '@manahippo/aptos-wallet-adapter';
import {WalletModalButton} from "./WalletModalButton";
import {WalletConnectButton} from "./WalletConnectButton";
import {useWalletModal} from "../hooks/useWalletModal";
import {WalletIcon} from "./WalletIcon";
import {useCollectionHolder} from "../hooks/useCollectionHolder";

export const CollectionHolderButton: FC<ButtonProps> = ({ children, ...props }) => {
    const {
        disconnect,
        account,
        connected,
        wallet: currentWallet,
    } = useWallet();
    const {isHolder}=useCollectionHolder();
    const { setVisible } = useWalletModal();
    const [copied, setCopied] = useState(false);
    const [active, setActive] = useState(false);
    const ref = useRef<HTMLUListElement>(null);
    const pubkey = useMemo(() => account?.publicKey?.toString(), [account]);

    const copyAddress = useCallback(async () => {
        if (account?.address) {
            const address= account?.address.toString()
            await navigator.clipboard.writeText(address);
            setCopied(true);
            setTimeout(() => setCopied(false), 400);
        }
    }, [account]);

    const openDropdown = useCallback(() => {
        setActive(true);
    }, []);

    const closeDropdown = useCallback(() => {
        setActive(false);
    }, []);

    const openModal = useCallback(() => {
        setVisible(true);
        closeDropdown();
    }, [closeDropdown]);

    useEffect(() => {
        const listener = (event: MouseEvent | TouchEvent) => {
            const node = ref.current;

            // Do nothing if clicking dropdown or its descendants
            if (!node || node.contains(event.target as Node)) return;

            closeDropdown();
        };

        document.addEventListener('mousedown', listener);
        document.addEventListener('touchstart', listener);

        return () => {
            document.removeEventListener('mousedown', listener);
            document.removeEventListener('touchstart', listener);
        };
    }, [ref, closeDropdown]);
    console.log(currentWallet)
    if (!currentWallet) return <WalletModalButton {...props}>{children}</WalletModalButton>;
    if (!pubkey) return <WalletConnectButton {...props}>{children}</WalletConnectButton>;
    return (
        <div className="wallet-adapter-dropdown">
            <Button
                aria-expanded={active}
                className="wallet-adapter-button-trigger"
                style={{ pointerEvents: active ? 'none' : 'auto', ...props.style }}
                onClick={openDropdown}
                startIcon={<WalletIcon wallet={currentWallet} />}
                {...props}
            >
                {isHolder? "you are the holder of collabrated collections":"you aren't the holder of collabrated collections"}
            </Button>
            <ul
                aria-label="dropdown-list"
                className={`wallet-adapter-dropdown-list ${active && 'wallet-adapter-dropdown-list-active'}`}
                ref={ref}
                role="menu"
            >
                <li onClick={copyAddress} className="wallet-adapter-dropdown-list-item" role="menuitem">
                    {copied ? 'Copied' : 'Copy address'}
                </li>
                <li onClick={openModal} className="wallet-adapter-dropdown-list-item" role="menuitem">
                    Change wallet
                </li>
                <li onClick={disconnect} className="wallet-adapter-dropdown-list-item" role="menuitem">
                    Disconnect
                </li>
            </ul>
        </div>
    );
};
