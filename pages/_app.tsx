/*
 * @Date: 2022-12-11 19:32:26
 * @FileName:
 * @FileDescription:
 */
import type { AppProps } from "next/app";
import Layout from "../components/layout";
import { ConfigProvider, theme } from "antd";
import "../styles/globals.css";
import "../styles/post.css";
import "../styles/antd.css";
import { useEffect, useState } from "react";

export default function App({ Component, pageProps }: AppProps) {
  const [mode, setMode] = useState<string>("light");
  useEffect(() => {
    const observer = new MutationObserver((mutationsList) => {
      for (let mutation of mutationsList) {
        if (mutation.type === "attributes" && mutation.attributeName === "data-theme") {
          const newTheme = document.documentElement.getAttribute("data-theme") || "light";
          setMode(newTheme);
        }
      }
    });

    observer.observe(document.documentElement, { attributes: true });

    // 清理观察器
    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <ConfigProvider
      theme={{ algorithm: mode == "dark" ? theme.darkAlgorithm : theme.defaultAlgorithm }}
    >
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ConfigProvider>
  );
}
