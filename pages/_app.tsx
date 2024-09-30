import React from "react";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Tooltip } from "react-tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { LogSnagProvider } from "@logsnag/react";

export default function App({ Component, pageProps }: AppProps) {
  const queryClient = new QueryClient();
  return (
    // <LogSnagProvider
    //   project="dropp"
    //   token={process.env.NEXT_PUBLIC_LOGSNAG_TOKEN!}
    // >
    <QueryClientProvider client={queryClient}>
      <Tooltip id="tt" className="z-10" />
      <Toaster richColors />
      <Component {...pageProps} />
    </QueryClientProvider>
    // </LogSnagProvider>
  );
}
