import ActionsPanelRow from "./ui/ActionsPanelRow";
import ActionsPanelTitleBar from "./ui/ActionsPanelTitleBar";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import { useActionState } from "./state/useActionState";
import {
  AccountBalanceWalletRounded as IconWallet,
  Key as IconKey,
  Link as IconLink,
} from "@mui/icons-material";
import { useLink } from "../../useLink";

const SendActionsPanel = () => {
  const { goBack, setActionState } = useActionState();
  const { extConnected } = useLink();

  return (
    <Box width="100%">
      <ActionsPanelTitleBar title="Send" backOnClick={goBack} />
      <Box style={{ textAlign: "center" }}>
        <ActionsPanelRow
          icon={<IconLink />}
          title="Send as Link-Matic"
          subtitle="Create a Link-Matic with this value that you can share with anyone"
          onClick={() => {
            setActionState("createTipLink");
          }}
        />
        <Divider />
        <ActionsPanelRow
          icon={<IconKey />}
          title="Send to address"
          subtitle="Send to a wallet address"
          onClick={() => {
            setActionState("sendPubKey");
          }}
        />
        <Divider />
        <ActionsPanelRow
          icon={<IconWallet />}
          title="Withdraw to Wallet"
          subtitle={
            extConnected
              ? "Withdraw to connected wallet"
              : "Connect Wallet to Withdraw"
          }
          onClick={() => {
            if (!extConnected) {
              alert("Please connect wallet to withdraw.");
              return;
            }
            setActionState("withdrawWallet");
          }}
        />
        <Divider />
        <br></br>
        <Typography>You'll choose amount to send next.</Typography>
      </Box>
    </Box>
  );
};

export default SendActionsPanel;
