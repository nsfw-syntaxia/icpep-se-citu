import type { Metadata } from "next";
import { Rubik, Raleway } from "next/font/google";
import FirstVisitLoader from "./components/first-visit-loader";
import ApiErrorNotice from "./components/api-error-notice";
import ResponsiveTableToggle from "./components/responsive-table-toggle";
import "./globals.css";

const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
});

const rubik = Rubik({
  variable: "--font-rubik",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ICPEP SE CIT-U Chapter",
  description: "Unlocking Potential, One Bit at a Time",
  icons: { icon: "/icpep logo.png" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${rubik.variable} ${raleway.variable} antialiased`}>
        {/* First visit loading with entrance animation */}
        <FirstVisitLoader />

        {/* Regular content - app/loading.jsx handles route changes automatically */}
        {children}
        <ApiErrorNotice />
        <ResponsiveTableToggle />
      </body>
    </html>
  );
}
