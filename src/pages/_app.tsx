import { NextUIProvider, createTheme } from "@nextui-org/react";
import { AppProps } from "next/app";
import { AuthContextProvider } from "../contexts/auth";
import Navbar from "../components/Navbar";

const theme = createTheme({
  type: "dark",
});

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthContextProvider>
      <NextUIProvider theme={theme}>
        <Navbar />
        <Component {...pageProps} />
      </NextUIProvider>
    </AuthContextProvider>
  );
}
