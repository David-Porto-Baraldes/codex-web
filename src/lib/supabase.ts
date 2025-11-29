import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Oferta {
  id: number;
  tipus: string;
  titol: string;
  descripcio: string;
  preu: number;
  durada?: string;
  oferent?: string;
  created_at: string;
}
