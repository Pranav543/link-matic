import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import styles from "../../../styles/Header.module.css";
import Typography from "@mui/material/Typography";
require("@solana/wallet-adapter-react-ui/styles.css");
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

import {
  useWeb3Provider,
  useConnectWallet,
  useDisconnectWallet,
} from "../../WalletContextProvider";

type HeaderProps = {
  showWalletButton?: boolean;
};

const Logo = () => {
  return (
    <div className={styles.logoContainer}>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <a href="/" rel="noopener noreferrer">
          <img src="/tiplink-logo.png" width="200px" />
        </a>
        <Typography>BETA</Typography>
      </div>
    </div>
  );
};

const WalletButton = ({ showWalletButton }: HeaderProps) => {
  const web3Provider = useWeb3Provider();
  console.log(web3Provider);

  const connectWallet = useConnectWallet();
  const disconnectWallet = useDisconnectWallet();
  const getChainID = async () => {
    if (web3Provider) {
      const signer = web3Provider.getSigner();
      console.log("signer.getChainId()", await signer.getChainId());

       console.log("getAddress():", await signer.getAddress());

       console.log("accounts:", await web3Provider.listAccounts());
    }
  };
  return (
    <>
      <Box className={styles.walletContainer}>
        {showWalletButton && <WalletMultiButton />}
        <Button
          key={"Connect Wallet"}
          style={{
            display: "flex",
            flexDirection: "column",
            flexGrow: "1",
            flexBasis: "0",
            textTransform: "none",
            maxWidth: "50%",
          }}
          variant="outlined"
          onClick={() => connectWallet()}
        >
          {`Connect Wallet`}
        </Button>
        <Button
          key={"get chain id"}
          style={{
            display: "flex",
            flexDirection: "column",
            flexGrow: "1",
            flexBasis: "0",
            textTransform: "none",
            maxWidth: "50%",
          }}
          variant="outlined"
          onClick={() => {
            getChainID();
          }}
        >
          {`get chain id`}
        </Button>
        <Button
          key={"disconnect"}
          style={{
            display: "flex",
            flexDirection: "column",
            flexGrow: "1",
            flexBasis: "0",
            textTransform: "none",
            maxWidth: "50%",
          }}
          variant="outlined"
          onClick={() => {
            disconnectWallet();
          }}
        >
          {`disconnect`}
        </Button>
      </Box>
    </>
  );
};

const Header = ({ showWalletButton = true }: HeaderProps) => {
  return (
    <AppBar
      color="transparent"
      position="relative"
      className="appbar"
      elevation={0}
      sx={{ padding: "1rem" }}
    >
      <Toolbar className={styles.toolbar}>
        <Logo />
        <WalletButton showWalletButton={showWalletButton} />
      </Toolbar>
    </AppBar>
  );
};

export default Header;
