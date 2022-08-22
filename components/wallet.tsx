import { ethers } from "ethers";
import { useEffect } from "react";
// Default styles that can be overridden by your app
import { LinkProvider } from "./LinkContextProvider";
import { useWeb3Provider } from "./WalletContextProvider";
import Main from "./ui/main/Main";
import { insertPublicKey } from "../lib/link";

interface WalletProps {
  secretKey: string;
}

const Wallet = ({ secretKey }: WalletProps) => {
  const web3Provider = useWeb3Provider();
  const hdWallet = ethers.utils.HDNode.fromExtendedKey(secretKey);
  const provider = new ethers.providers.JsonRpcProvider(
    "https://rpc.ankr.com/polygon_mumbai"
  );
  const linkKeypair = new ethers.Wallet(hdWallet.privateKey, provider);
  const key = "tiplink-" + linkKeypair.address + "-inserted";
  console.log("key: ", key)

  const onInsert = (success: boolean) => {
    // TODO should we insert false so that we don't keep retrying if this doesn't work for w/e reason
    if (success) {
      localStorage.setItem(key, "true");
    } else {
      localStorage.setItem(key, "false");
      // console.error("failed to insert publicKey ", linkKeypair.publicKey.toBase58());
    }
  };
  useEffect(() => {
    // insertPublicKey(linkKeypair.publicKey);
    if (localStorage.getItem(key) === null) {
      insertPublicKey(linkKeypair.address, onInsert);
    }
  }, []);
  return (
    <LinkProvider linkKeypair={linkKeypair}>
      <Main />
    </LinkProvider>
  );
};

export default Wallet;
