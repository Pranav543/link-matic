import { createContext, useContext } from "react";

import { ethers, Wallet, BigNumber } from "ethers";

export interface BalanceCallback {
  (balance: BigNumber): void;
}
// so we don't have to keep passing the linkKeypair everywhere
// TODO don't return promises from this
type LinkContent = {
  linkKeypair: Wallet;
  sendMatic(
    destination: string,
    amt: string
  ): Promise<ethers.providers.TransactionReceipt>;
  getFeeEstimate(): Promise<BigNumber>;
  balanceMatic: number;
  balanceUSD: number;
  deposit(
    amt: string
  ): Promise<ethers.providers.TransactionReceipt | undefined>;
  extConnected: boolean;
  extPublicKey: string;
  scheduleBalanceUpdate(t: number): void;
};
export const LinkContext = createContext<LinkContent>(undefined!);
export const useLink = () => useContext(LinkContext);
