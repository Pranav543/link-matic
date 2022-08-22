import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import styles from "../../../styles/Header.module.css";
import Typography from "@mui/material/Typography";

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
        <Typography style={{ alignSelf: "center", fontWeight: "bold" }}>
          LINK &nbsp;
        </Typography>
        <a href="/" rel="noopener noreferrer">
          <img src="/maticLogoMark.png" height="50px" width="50px" />
        </a>
        <Typography style={{ alignSelf: "center", fontWeight: "bold" }}>
          &nbsp; MATIC
        </Typography>
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
  
  return (
    <>
      <Box className={styles.walletContainer}>
        {web3Provider === null || web3Provider === undefined ? (
          <Button
            key={"Connect Wallet"}
            style={{
              display: "flex",
              flexDirection: "column",
              flexGrow: "1",
              flexBasis: "0",
              textTransform: "none",
              maxWidth: "100%",
            }}
            variant="outlined"
            onClick={() => connectWallet()}
          >
            {`Connect Wallet`}
          </Button>
        ) : (
          <Button
            key={"disconnect"}
            style={{
              display: "flex",
              flexDirection: "column",
              flexGrow: "1",
              flexBasis: "0",
              textTransform: "none",
              maxWidth: "100%",
            }}
            variant="outlined"
            onClick={() => {
              disconnectWallet();
            }}
          >
            {`Disconnect Wallet`}
          </Button>
        )}
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
