import styles from "../../../styles/Footer.module.css";
import { Copyright } from "@mui/icons-material";
import "material-icons/iconfont/material-icons.css";

export default function Footer() {
  return (
    <div className={styles.footer}>
      <div>
        <Copyright style={{ fontSize: "0.8rem" }} /> 2022
      </div>
      <div className={styles.poweredBy}>
        <a
          href="https://polygon.technology/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className={styles.box}>
            Powered by{" "}
            <img
              src="/Polygon-MATIC.png"
              alt="Polygon Logo"
              width={120}
              height={80}
            />
          </div>
        </a>
      </div>
      <div className={styles.footerLinks}>
        <a href="/faq">FAQ</a>
      </div>
    </div>
  );
}
