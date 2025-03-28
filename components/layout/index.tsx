import Header from "../Header";
import styles from "./layout.module.css";
import * as React from "react";

function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.body}>
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
}

export default layout;
