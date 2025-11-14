import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "@/components/layout/ClientLayout";


export const metadata: Metadata = {
  title: "Trevor Edge Portfolio",
  description: "An app to showcase Trevor Edge's portfolio projects.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className='antialiased'
      >
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
