'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase'; 

const UserContext = createContext(null);

export function UserProvider({ user: serverUser, children }) {
  // Initialize with the guaranteed server user!
  const [user, setUser] = useState(serverUser);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      // 🌟 FIX: Only update state if they explicitly sign out, or if a NEW valid session comes in.
      // This prevents the empty client-side initialization from wiping out your serverUser!
      if (event === 'SIGNED_OUT') {
        setUser(null);
      } else if (session?.user) {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <UserContext.Provider value={user}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);