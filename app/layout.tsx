"use client";

import "./globals.css";
import { Tooltip } from "react-tooltip";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Tooltip id="tt" className="z-10" />
        {children}
      </body>
    </html>
  );
}
