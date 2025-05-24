import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://uliwwpxoybupwleqqeki.supabase.co'


export const supabase = createClient(supabaseUrl, supabaseAnonKey)
