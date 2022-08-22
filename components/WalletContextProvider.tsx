import React, { useContext, useState, FC, ReactNode, useEffect } from "react";
import { ethers } from "ethers";
import { sequence } from "0xsequence";
import Web3Modal from "@0xsequence/web3modal";
import WalletConnect from "@walletconnect/web3-provider";

export interface WalletContextProviderProps {
  children: ReactNode;
}

const Web3ProviderContext =
  React.createContext<ethers.providers.Web3Provider | null>(undefined!);

const ConnetWalletContext = React.createContext<any>(undefined!);

const DisconnectWalletContext = React.createContext<any>(undefined!);

let providerOptions: any = {
  walletconnect: {
    package: WalletConnect,
    options: {
      infuraId: "xxx-your-infura-id-here",
    },
  },
};

let web3Modal: any;

if (typeof window !== "undefined") {
  if (!window?.ethereum?.isSequence) {
    providerOptions = {
      ...providerOptions,
      sequence: {
        package: sequence,
        options: {
          appName: "Web3Modal Demo Dapp",
          defaultNetwork: "polygon",
        },
      },
    };
  }

  web3Modal = new Web3Modal({
    providerOptions,
    cacheProvider: true,
  });
}

export const WalletContextProvider: FC<WalletContextProviderProps> = ({
  children,
}) => {
  const [provider, setProvider] =
    useState<ethers.providers.Web3Provider | null>(null);

  useEffect(() => {
    if (web3Modal.cachedProvider) {
      connectWallet();
    }
  }, []);

  const connectWeb3Modal = async () => {
    if (web3Modal.cachedProvider) {
      web3Modal.clearCachedProvider();
    }
    connectWallet();
  };

  const connectWallet = async () => {
    const wallet = await web3Modal.connect();

    const provider = new ethers.providers.Web3Provider(wallet);

    if (wallet.sequence) {
      (provider as any).sequence = wallet.sequence;
    }

    setProvider(provider);
  };

  const disconnectWeb3Modal = async () => {
    web3Modal.clearCachedProvider();

    if (provider && (provider as any).sequence) {
      const wallet = (provider as any).sequence as sequence.Wallet;
      wallet.disconnect();
    }

    setProvider(null);
  };

  return (
    <Web3ProviderContext.Provider value={provider}>
      <ConnetWalletContext.Provider value={connectWeb3Modal}>
        <DisconnectWalletContext.Provider value={disconnectWeb3Modal}>
          {children}
        </DisconnectWalletContext.Provider>
      </ConnetWalletContext.Provider>
    </Web3ProviderContext.Provider>
  );
};

export const useWeb3Provider = () => useContext(Web3ProviderContext);
export const useConnectWallet = () => useContext(ConnetWalletContext);
export const useDisconnectWallet = () => useContext(DisconnectWalletContext);
