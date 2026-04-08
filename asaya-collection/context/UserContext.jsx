'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase'; // Import your client-side Supabase

// 1. Create the context
const UserContext = createContext(null);

// 2. Create the Provider component
export function UserProvider({ user: serverUser, children }) {
  // Initialize state with the user passed from the server (layout.js)
  const [user, setUser] = useState(serverUser);

  useEffect(() => {
    // 🌟 If Next.js served a stale cached page, this listener catches the login 
    // instantly and updates the UI without needing a refresh!
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    // Cleanup the listener when the component unmounts
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <UserContext.Provider value={user}>
      {children}
    </UserContext.Provider>
  );
}

// 3. Create a custom hook for super easy access anywhere
export const useUser = () => {
  return useContext(UserContext);
};