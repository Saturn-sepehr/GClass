import Header from "@/Shared/Header";
import Display from "@/Shared/Display";
import "./globals.css";
import AnimInit from "@/Shared/animInit";

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="antialiased">
      <body className="bg-slate-950">
        <AnimInit />
        <Display>
          <Header />
          {children}
        </Display>
      </body>
    </html>
  );
}
