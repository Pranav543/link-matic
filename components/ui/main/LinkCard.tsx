import Typography from "@mui/material/Typography";
import styles from '../../../styles/LinkCard.module.css'
import { useLink } from "../../useLink";

const LinkCard = () => {
  const { linkKeypair, balanceMatic, balanceUSD } = useLink();
  const getCardDisplayText = () => {
    const url = window.location.href;
    if (url.search("wallet") != -1) {
      return linkKeypair.address;
    }
    return window.location.hash;
  };

  const cdt = getCardDisplayText();

  return(
    <div className={styles.linkCard}>
      <img src="/link-matic-card.png"/>
      <div className={styles.cardBalance}>
        {!isNaN(balanceMatic) && <Typography color="magenta">{balanceMatic.toFixed(4)} MATIC</Typography>}
        {!isNaN(balanceUSD) && <Typography className={styles.balanceUSD} variant="h3">${balanceUSD.toFixed(2)}</Typography>}
      </div>
      <div className={styles.cardIdentifier}>
        <Typography style={{fontSize: "0.7rem"}}>{cdt}</Typography>
      </div>
    </div>
  );
};

export default LinkCard;
