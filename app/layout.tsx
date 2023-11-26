"use client";

import { MantineProvider } from "@mantine/core";
import { Notifications } from '@mantine/notifications'
import { QueryClient, QueryClientProvider } from "react-query";
import "@mantine/core/styles.css";
import '@mantine/notifications/styles.css';

import theme from "@/theme/theme";

const queryClient = new QueryClient();

export default function RootLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>SavaScript</title>
        <meta name='description' content='SavaScript is life, SavaScript is everything' />
      </head>

      <body style={{ padding: "20px" }}>
        <QueryClientProvider client={queryClient}>
          <MantineProvider theme={theme}>
            {children}

            {modal}

            <Notifications autoClose={5000} position="top-right" />
          </MantineProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
