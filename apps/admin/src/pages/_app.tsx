import "../styles/globals.css";
import { type AppType } from "next/app";
import { trpc } from "../utils/trpc";

const MyApp: AppType = ({ Component, pageProps }) => <Component {...pageProps} />;

export default trpc.withTRPC(MyApp);
