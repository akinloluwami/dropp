import React from "react";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Tooltip } from "react-tooltip";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Tooltip id="tt" className="z-10" />
      <Component {...pageProps} />
    </>
  );
}
