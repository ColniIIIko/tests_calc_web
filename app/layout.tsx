"use client";

import { Inter } from "next/font/google";
import { MantineProvider, createTheme } from "@mantine/core";
import { QueryClient, QueryClientProvider } from "react-query";
import "@mantine/core/styles.css";

const inter = Inter({ subsets: ["latin"] });

const queryClient = new QueryClient();

const theme = createTheme({
  fontSizes: {
    sm: "1.2rem",
    lg: "1.2rem",
    md: "1.2rem",
    xl: "1.2rem",
    xs: "1.2rem",
  },
});

export default function RootLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className} style={{ padding: "20px" }}>
        <QueryClientProvider client={queryClient}>
          <MantineProvider theme={theme}>
            {children}

            {modal}
          </MantineProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
