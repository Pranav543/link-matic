import { ethers } from "ethers";
import ActionsPanelTitleBar from "./ui/ActionsPanelTitleBar";
import Box from "@mui/material/Box";
import { useActionState } from "./state/useActionState";
import Typography from "@mui/material/Typography";
import CurrencyInput from "../common/CurrencyInput";
import Button from "@mui/material/Button";
import { useState } from "react";
import { useLink } from "../../useLink";
import TextField from "@mui/material/TextField";

const SendPublicKey = () => {
  const { goBack } = useActionState();
  const [inputAmountMatic, setInputAmountMatic] = useState<number>(NaN);
  const { sendMatic, balanceMatic } = useLink();
  const [address, setAddress] = useState<string>("");

  const send = async () => {
    // TODO validate PublicKey and amount
    // TODO treat full amount differently
    const toAddress = ethers.utils.getAddress(address);

    if (inputAmountMatic > balanceMatic) {
      alert("Cannot withdraw more than balance");
      return;
    }

    try {
      await sendMatic(toAddress, inputAmountMatic.toString());
    } catch (err) {
      if (err instanceof Error) {
        alert(err.message);
        return;
      }
    }
  };

  return (
    <Box width="100%">
      <ActionsPanelTitleBar title="Send to Address" backOnClick={goBack} />
      <Typography
        textAlign="center"
        style={{ marginTop: "1rem", marginBottom: "1rem" }}
      >
        How much do you want to send?
      </Typography>
      <Box
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <TextField
          fullWidth
          label="Address"
          value={address}
          onChange={(e) => {
            setAddress(e.target.value);
          }}
        />
        <br></br>
        <CurrencyInput
          fiatCurrency="USD"
          cryptoCurrency="MATIC"
          useMax={true}
          onValueChange={setInputAmountMatic}
        />
        <Button
          style={{ marginTop: "1rem" }}
          variant="contained"
          onClick={send}
          disabled={address.length != 44}
        >
          Send
        </Button>
      </Box>
    </Box>
  );
};

export default SendPublicKey;
