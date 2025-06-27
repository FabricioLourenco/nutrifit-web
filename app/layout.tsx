import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "react-day-picker/dist/style.css"; // 1. PRIMEIRO, o estilo da biblioteca
import "./globals.css";                   // 2. DEPOIS, o seu estilo (para sobrescrever o da biblioteca)
import Header from "./components/Header";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={"antialised"}>
       
        {children}
      </body>
    </html>
  );
}
