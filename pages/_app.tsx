import React from "react";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Tooltip } from "react-tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function App({ Component, pageProps }: AppProps) {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <Tooltip id="tt" className="z-10" />
      <Component {...pageProps} />
    </QueryClientProvider>
  );
}
