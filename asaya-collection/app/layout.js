import { Montserrat } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { createClient } from '@/lib/supabaseServer';
import { UserProvider } from '@/context/UserContext';
import NextTopLoader from 'nextjs-toploader';
import WhatsAppButton from "@/components/Ui/WhatsappButton";
import SmoothScroll from "@/components/SmoothScroll";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata = {
  title: "Asaya",
  description: "Luxury purses store",
};


export default async function RootLayout({ children }) {

  // 1. Initialize Supabase securely on the server
  const supabase = await createClient();
  
  // 2. Fetch the active user session
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <html
      lang="en"
      className={`${montserrat.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        {/* 🌟 The sleek black loading bar */}
        <NextTopLoader 
          color="#1a1a1a" 
          initialPosition={0.08} 
          crawlSpeed={200} 
          height={3} 
          crawl={true} 
          showSpinner={false} // Set to true if you want a tiny spinner in the top right
          easing="ease" 
          speed={200} 
          shadow="0 0 10px #1a1a1a,0 0 5px #1a1a1a" 
        />
        <UserProvider user={user}>
          
        <SmoothScroll>
          <Navbar />
          {children}
          <Footer />
          <WhatsAppButton />
          </SmoothScroll>
        </UserProvider>
      </body>
    </html>
  );
}