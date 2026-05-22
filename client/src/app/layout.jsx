import { Toaster } from "react-hot-toast";
import NotificationManager from "../components/layout/NotificationManager";
import "./globals.css";

export const metadata = {
  title: "AlertNaija | National Emergency System",
  description: "Unified National Emergency Response Platform for Nigeria",
  manifest: "/manifest.json",
  themeColor: "#00BA88",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "AlertNaija",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/icon.png" />
        <link rel="apple-touch-icon" href="/icon.png" />
      </head>
      <body className="bg-background-dark text-white font-body antialiased selection:bg-primary/30">
        <Toaster />
        <NotificationManager />
        {children}
      </body>
    </html>
  );
}