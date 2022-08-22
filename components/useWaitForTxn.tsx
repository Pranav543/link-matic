// When we create a new link, we want to redirect the user to their TipLink
// before we actually send it to RPC endpoint, just in case SOL is slow
// This context allows you to store a pending Txn
import { createContext, useContext, FC, useState, ReactNode } from "react";
import { ethers } from "ethers";
type TxnContent = {
    pendingTxn: ethers.providers.TransactionResponse | null;
    setPendingTxn(pendingTxn: ethers.providers.TransactionResponse | null): void;
};
export const TxnContext = createContext<TxnContent>(undefined!);
export const useWaitForTxn = () => useContext(TxnContext);
export interface TxnProviderProps {
    children: ReactNode;
}

export const TxnProvider: FC<TxnProviderProps> = ({ children} : TxnProviderProps) => {
    const [ pendingTxn, setPendingTxn ] = useState<ethers.providers.TransactionResponse | null>(null);
    return (
        <TxnContext.Provider
            value={{
                pendingTxn,
                setPendingTxn
            }}
        >
            {children}
        </TxnContext.Provider>
    );
};
