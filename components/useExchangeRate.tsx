import React, { FC, ReactNode, useState, useEffect } from "react";
import { createContext, useContext } from "react";
import { ethers } from "ethers";
import { ContentCopy } from "@mui/icons-material";

type ExchangeRateContent = {
  exchangeRate: number;
};
export const ExchangeRateContext = createContext<ExchangeRateContent>(
  undefined!
);
const useExchangeRate = () => useContext(ExchangeRateContext);

export interface ExchangeRateProviderProps {
  children: ReactNode;
}

const getPrice = async () => {
  const provider = new ethers.providers.JsonRpcProvider(
    "https://rpc.ankr.com/polygon"
  );

  const aggregatorV3InterfaceABI = [
    {
      inputs: [],
      name: "decimals",
      outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "description",
      outputs: [{ internalType: "string", name: "", type: "string" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [{ internalType: "uint80", name: "_roundId", type: "uint80" }],
      name: "getRoundData",
      outputs: [
        { internalType: "uint80", name: "roundId", type: "uint80" },
        { internalType: "int256", name: "answer", type: "int256" },
        { internalType: "uint256", name: "startedAt", type: "uint256" },
        { internalType: "uint256", name: "updatedAt", type: "uint256" },
        { internalType: "uint80", name: "answeredInRound", type: "uint80" },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "latestRoundData",
      outputs: [
        { internalType: "uint80", name: "roundId", type: "uint80" },
        { internalType: "int256", name: "answer", type: "int256" },
        { internalType: "uint256", name: "startedAt", type: "uint256" },
        { internalType: "uint256", name: "updatedAt", type: "uint256" },
        { internalType: "uint80", name: "answeredInRound", type: "uint80" },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "version",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
  ];
  // mainnet - 0xAB594600376Ec9fD91F8e885dADF0CE036862dE0
  // testnet - 0xd0D5e3DB44DE05E9F294BB0a3bEEaF030DE24Ada
  const addr = "0xAB594600376Ec9fD91F8e885dADF0CE036862dE0";
  const priceFeed = new ethers.Contract(
    addr,
    aggregatorV3InterfaceABI,
    provider
  );
  const decimals = await priceFeed.decimals();
  const latestRoundData = await priceFeed.latestRoundData();
  return latestRoundData.answer.toNumber() / 10 ** decimals;
};

export const ExchangeRateProvider: FC<ExchangeRateProviderProps> = ({
  children,
}) => {
  // in USD / Matic
  const [exchangeRate, setExchangeRate] = useState(NaN);

  useEffect(() => {
    getPrice().then((apiPrice) => setExchangeRate(apiPrice));
  }, []);

  return (
    <ExchangeRateContext.Provider
      value={{
        exchangeRate,
      }}
    >
      {children}
    </ExchangeRateContext.Provider>
  );
};

export default useExchangeRate;
