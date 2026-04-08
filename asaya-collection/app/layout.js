import { Montserrat } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";
import { createClient } from '@/lib/supabaseServer';
import { UserProvider } from '@/context/UserContext';

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

  console.log("Authenticated user from layout:", user); // Debugging: Check if user data is fetched correctly


  return (
    <html
      lang="en"
      className={`${montserrat.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <UserProvider user={user}>

        
        <SmoothScroll>
          <Navbar />
          {children}
          <Footer />
        </SmoothScroll>
        </UserProvider>
      </body>
    </html>
  );
}