import Head from "next/head";
import Wallet from "./wallet";
import { useState, useEffect } from "react";
// @ts-ignore
import { decode as b58decode } from "bs58";
import { ethers } from "ethers";
import { kdfz } from "../lib/crypto";
import Progress from "./ui/common/Progress";

const SLWallet = () => {
  const [secretKey, setSecretKey] = useState<string>();
  useEffect(() => {
    try {
      const pw = b58decode(window.location.hash.substr(1));
      const seedLength = 32;
      kdfz(seedLength, pw).then((seed: Buffer) => {
        const kp = ethers.utils.HDNode.fromSeed(seed);
        setSecretKey(kp.extendedKey);
      });
    } catch (err) {
      console.error(err);
    }
  }, []);

  return (
    <div>
      <Head>
        <title>Link-Matic</title>
        <meta name="description" content="Send Link-Matic with crypto" />
        <meta property="og:title" content="You received some crypto!" />
        <meta property="og:url" content="https://link-matic.netlify.app/" />
        <meta
          property="og:image"
          content="https://link-matic.netlify.app/link-matic-card-preview.png"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {secretKey !== undefined ? (
        <Wallet secretKey={secretKey} />
      ) : (
        <Progress />
      )}
    </div>
  );
};

export default SLWallet;
