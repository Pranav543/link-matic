import styles from "../styles/FrontPage.module.css";
import Router from "next/router";
import { Typography } from "@mui/material";
import { useState, MouseEvent } from "react";
import LoadingButton from "@mui/lab/LoadingButton";
import Box from "@mui/material/Box";
import CurrencyInput, {
  fiatQuickInputDefault,
  cryptoQuickInputDefault,
} from "./ui/common/CurrencyInput";
import { useWeb3Provider } from "./WalletContextProvider";
import { ethers } from "ethers";
import {
  randBuf,
  DEFAULT_TIPLINK_KEYLENGTH,
  SEED_LENGTH,
  kdfz,
} from "../lib/crypto";
import { getLinkPath } from "../lib/link";
import { useWaitForTxn } from "./useWaitForTxn";

const createWalletShort = async () => {
  randBuf(DEFAULT_TIPLINK_KEYLENGTH).then((b) => Router.push(getLinkPath(b)));
};

export default function FrontPage() {
  const [loading, setLoading] = useState(false);
  const [inputAmountMatic, setInputAmountMatic] = useState<number>(NaN);
  const web3Provider = useWeb3Provider();
  const { setPendingTxn } = useWaitForTxn();

  const onClickEmptyTipLink = (e: MouseEvent<HTMLElement>) => {
    if (loading) {
      return;
    }
    e.preventDefault();
    setLoading(true);
    setPendingTxn(null);
    createWalletShort();
  };

  const onClickCreateTipLink = async (e: MouseEvent<HTMLElement>) => {
    e.preventDefault();

    if (web3Provider === undefined || web3Provider === null) {
      alert(
        "Please connect a web3 wallet to load value onto a link-matic. Alternatively, create an empty link first."
      );
      return;
    }
    const signer = web3Provider!.getSigner();

    setLoading(true);

    const b = await randBuf(DEFAULT_TIPLINK_KEYLENGTH);
    const seed = await kdfz(SEED_LENGTH, b);
    const kp = ethers.utils.HDNode.fromSeed(seed);

    const amt = ethers.utils.parseEther(inputAmountMatic.toFixed(6));

    const gas_limit = 30000;
    const tx = {
      gasLimit: ethers.utils.hexlify(gas_limit),
      to: kp.address,
      value: amt,
    };
    const txnResp = await signer.sendTransaction(tx);
    await txnResp.wait();

    setPendingTxn(txnResp);
    Router.push(getLinkPath(b));
  };

  return (
    <div>
      <div className="container">
        <main className="main">
          <Box className={styles.tagLine}>
            <Typography variant="h4">Links are now money</Typography>
            <Typography>
              Send crypto to anyone, even if they don't have a wallet.
            </Typography>
            <Typography>No app needed!</Typography>
          </Box>

          <Box className={styles.frontBox} sx={{ m: 2 }}>
            <Typography sx={{ m: 2 }}>
              Try it now! How much do you want to send?
            </Typography>
            <CurrencyInput
              fiatCurrency="USD"
              cryptoCurrency="MATIC"
              fiatQuickInputOptions={fiatQuickInputDefault}
              cryptoQuickInputOptions={cryptoQuickInputDefault}
              onValueChange={setInputAmountMatic}
            />
            <LoadingButton
              sx={{ m: 2 }}
              variant="contained"
              onClick={onClickCreateTipLink}
              loading={loading}
            >
              Create Link-Matic
            </LoadingButton>
            <Typography>
              Want to deposit value later?{" "}
              <a onClick={onClickEmptyTipLink}>Create an empty Link-Matic.</a>
            </Typography>
          </Box>

          <Box className={styles.frontDesc}>
            <Typography variant="h5" className={styles.howTitle}>
              <u>How it works</u>
            </Typography>
            <dl>
              <dt>Create a Link-Matic.</dt>
              <dd>
                It’s like buying a gift card, create a Link-Matic by depositing
                how much you want to send.
              </dd>
              <dt>Share a Link-Matic.</dt>
              <dd>
                Copy the Link-Matic URL and send it to anyone, or show them the
                QR code.
              </dd>
              <dt>That's it.</dt>
              <dd>
                You just sent someone crypto and they can send or use it even if
                they don’t have a wallet.*
              </dd>
            </dl>
            <Typography className={styles.ps}>
              *Psst, the Link-Matic is the wallet!
            </Typography>
          </Box>
        </main>
        {/* <Footer/> */}
      </div>
    </div>
  );
}
