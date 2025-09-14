import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your environment.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types for TypeScript
export interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  role: 'admin' | 'doctor' | 'assistant';
  created_at: string;
  updated_at: string;
}

export interface Clinic {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  created_at: string;
  updated_at: string;
}

export interface StaffClinic {
  id: string;
  user_id: string;
  clinic_id: string;
  created_at: string;
}

export interface Room {
  id: string;
  clinic_id: string;
  name: string;
  created_at: string;
  updated_at: string;
}