import { ColorSchemeScript, mantineHtmlProps } from "@mantine/core";
import type { Metadata } from "next";
import "@/styles/globals.css";
import MantineRegistry from "@/components/basic/MantineRegistry";

export const metadata: Metadata = {
  title: "Deepict",
  description: "Deepict",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
      </head>
      <body className={`antialiased overflow-hidden`}>
        <MantineRegistry>{children}</MantineRegistry>
      </body>
    </html>
  );
}
