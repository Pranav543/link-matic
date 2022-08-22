import React, { FC, ReactNode, useState, useEffect } from "react";
import { LinkContext, BalanceCallback } from "./useLink";
import { useWeb3Provider } from "./WalletContextProvider";
import useExchangeRate from "./useExchangeRate";
import { ethers, Wallet, BigNumber } from "ethers";

export interface LinkProviderProps {
  children: ReactNode;
  linkKeypair: Wallet;
}
const BALANCE_POLL_INTERVAL_MS = 1000;

export const LinkProvider: FC<LinkProviderProps> = ({
  children,
  linkKeypair,
}) => {
  const web3Provider = useWeb3Provider();

  // in Lamportsj
  const [balance, setBalance] = useState(0);
  const [extConnected, setConnected] = useState(false);
  const [extPublicKey, setExtPublicKey] = useState("");
  // in USD / Matic
  const { exchangeRate } = useExchangeRate();

  const getBalanceMatic = async () => {
    return await linkKeypair.getBalance();
  };

  const fetchBalance = (c: BalanceCallback) => {
    getBalanceMatic()
      .then((b) => {
        // console.log("got balance of " + b);
        c(b);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    if (web3Provider !== null) {
      const signer = web3Provider!.getSigner();
      if (signer !== undefined || signer !== null) {
        signer.getAddress().then((address) => {
          setConnected(true);
          setExtPublicKey(address);
        });
      }
    }
    linkKeypair
      .getBalance()
      .then((b) => {
        // console.log("getBalanceOuter " + b + " " + endpointUrl);
        console.log("Balance is: ", ethers.utils.formatEther(b));
        setBalance(Number(ethers.utils.formatEther(b)));
      })
      .catch((error) => {
        console.log(error);
      });
  }, [web3Provider]);

  const updateBalance = () => {
    // console.log("updateBalance"); http://localhost:3000/i#2YuEXvreJGWBNCtKj
    fetchBalance((b) => {
      setBalance(Number(ethers.utils.formatEther(b)));
    });
  };

  const pollBalance = () => {
    updateBalance();
    setTimeout(pollBalance, BALANCE_POLL_INTERVAL_MS);
  };

  // poll for balance every second
  useEffect(() => {
    pollBalance();
  }, []);

  const sendMatic = async (destination: string, amt: string) => {
    const toAddress = ethers.utils.getAddress(destination);
    const gasPrice = await getGasPrice();
    console.log("gasPrice: ", gasPrice);
    const tx = {
      gasPrice: ethers.utils.parseUnits(gasPrice, "gwei"),
      to: toAddress,
      value: ethers.utils.parseEther(amt),
    };

    const txnResp = await linkKeypair.sendTransaction(tx);
    const txnRecpt = await txnResp.wait();
    return txnRecpt;
  };

  const scheduleBalanceUpdate = (t: number) => {
    setTimeout(() => {
      updateBalance();
    }, t);
  };

  // TODO refactor
  const deposit = async (amt: string) => {

    if (web3Provider === undefined || web3Provider === null) {
      alert("Please connect wallet to add money");
      return;
    }
    const signer = web3Provider!.getSigner();

    const amtInWei = ethers.utils.parseEther(amt);
    const fees = await getFeeEstimate();
    const walletBalance = await signer.getBalance();
    const minRequiredBalance = amtInWei.add(fees);

    if (walletBalance < minRequiredBalance) {
      alert("Insufficient funds for deposit.");
      return;
    }

    const tx = {
      to: linkKeypair.address,
      value: amtInWei,
    };

    const txnResp = await signer.sendTransaction(tx);
    return await txnResp.wait();
  };

  const getFeeEstimate = async () => {
    const gasStation = "https://gasstation-mumbai.matic.today/v2";
    const resp = await fetch(gasStation);
    const content = await resp.json();
    const standardGasPrice =
      Math.round(content.standard.maxPriorityFee) * 10 ** 9;
    const estGasFees = BigNumber.from(standardGasPrice * 21000);
    return estGasFees;
  };

  const getGasPrice = async () => {
    const gasStation = "https://gasstation-mumbai.matic.today/v2";
    const resp = await fetch(gasStation);
    const content = await resp.json();
    const fastGasPrice = Math.round(content.standard.maxPriorityFee);
    return fastGasPrice.toString();
  };

  const balanceMatic = Number(balance);
  const balanceUSD = Number(balanceMatic) * exchangeRate;

  return (
    <LinkContext.Provider
      value={{
        linkKeypair,
        sendMatic,
        getFeeEstimate,
        balanceMatic,
        balanceUSD,
        deposit,
        extConnected,
        extPublicKey,
        scheduleBalanceUpdate,
      }}
    >
      {children}
    </LinkContext.Provider>
  );
};
