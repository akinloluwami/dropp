import React from "react";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Tooltip } from "react-tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { LogSnagProvider } from "@logsnag/react";
import { Analytics } from "@vercel/analytics/react";
import { OpenPanelComponent } from "@openpanel/nextjs";
import { useUserStore } from "@/stores/user";

export default function App({ Component, pageProps }: AppProps) {
  const queryClient = new QueryClient();
  const { user } = useUserStore();
  return (
    // <LogSnagProvider
    //   project="dropp"
    //   token={process.env.NEXT_PUBLIC_LOGSNAG_TOKEN!}
    // >
    <QueryClientProvider client={queryClient}>
      <Tooltip id="tt" className="z-10" />
      <Toaster richColors />
      <OpenPanelComponent
        clientId="a980153d-3bea-4786-b911-34c7b5823a41"
        trackScreenViews={true}
        trackAttributes={true}
        trackOutgoingLinks={true}
        profileId={user.id}
      />
      <Analytics />
      <Component {...pageProps} />
    </QueryClientProvider>
    // </LogSnagProvider>
  );
}
