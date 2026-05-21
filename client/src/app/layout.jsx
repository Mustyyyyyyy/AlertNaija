import "./globals.css";

export const metadata = {
  title: "AlertNaija",
  description: "National Emergency Response Platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background-dark text-white font-body antialiased">
        {children}
      </body>
    </html>
  );
}