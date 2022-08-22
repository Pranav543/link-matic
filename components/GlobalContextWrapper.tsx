import theme from "../lib/theme";
import { ThemeProvider } from "@mui/material";
const QRCode = require("qrcode.react");
import React, { FC, ReactNode } from "react";
import { ExchangeRateProvider } from "./useExchangeRate";
import { TxnProvider } from "./useWaitForTxn";
import { WalletContextProvider } from "./WalletContextProvider";

export interface GlobalContextWrapperProps {
  children: ReactNode;
}

export const GlobalContextWrapper: FC<GlobalContextWrapperProps> = ({
  children,
}) => {
  return (
    <ThemeProvider theme={theme}>
      <WalletContextProvider>
        <ExchangeRateProvider>
          <TxnProvider>{children}</TxnProvider>
        </ExchangeRateProvider>
      </WalletContextProvider>
    </ThemeProvider>
  );
};

export default GlobalContextWrapper;
