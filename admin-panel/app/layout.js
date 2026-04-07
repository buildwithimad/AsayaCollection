import { Montserrat, Cormorant } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["300", "400", "500", "600", "700"],
});


export const metadata = {
  title: "Control Panel | Asaya Official",
  description: "Secure administrative dashboard for Asaya Collection.",
  robots: "noindex, nofollow", // Extra security: keeps Google from indexing the root!
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${montserrat.variable} h-full antialiased bg-[#faf9f8]`}
    >
      <body className="min-h-full flex flex-col text-[#1a1a1a] font-sans">
        {children}
      </body>
    </html>
  );
}