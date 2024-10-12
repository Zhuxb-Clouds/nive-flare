import styles from "./Header.module.css";
import Link from "next/link";
import React, { useState } from "react";
import Image from "next/image";
import SunIcon from "../../public/sun.svg";
import MoonIcon from "../../public/moon.svg";
import GithubIcon from "../../public/github.svg";
import { useEffect } from "react";
import { getMetaData } from "../../utils/meta";

function Header() {
  const [mode, setMode] = useState("dark");
  useEffect(() => {
    setMode(
      document.documentElement.getAttribute("data-theme") || localStorage.getItem("mode") || "dark"
    );
  }, []);
  const switchMode = () => {
    const newMode = mode == "dark" ? "light" : "dark";
    setMode(newMode);
    localStorage.setItem("mode", newMode);
    document.documentElement.setAttribute("data-theme", newMode);
  };
  return (
    <header className={styles.header}>
      <div className={styles.title}>
        <Link href="/">{getMetaData().logo || getMetaData().title}</Link>
        <Image
          src={mode == "dark" ? SunIcon : MoonIcon}
          alt=""
          width={50}
          height={50}
          className={styles.svg}
          onClick={switchMode}
          style={{ fill: mode == "dark" ? "white" : "black" }}
        ></Image>
      </div>
      <div className={styles.menu}>
        <a target="view_window" href="https://github.com/Zhuxb-Clouds">
          <Image
            src={GithubIcon}
            alt=""
            width={50}
            height={50}
            className={styles.svg}
            style={{ filter: mode == "dark" ? "invert(1)" : "invert(0)" }}
          ></Image>
        </a>
      </div>
    </header>
  );
}

export default Header;
