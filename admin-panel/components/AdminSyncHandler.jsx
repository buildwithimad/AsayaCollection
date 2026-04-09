'use client';
import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function AdminSyncHandler() {
  useEffect(() => {
    const sync = async () => {
      // stays authenticated for Storage uploads.
      await supabase.auth.getSession();
    };
    sync();
  }, []);

  return null; 
}