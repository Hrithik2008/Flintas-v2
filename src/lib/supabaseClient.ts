import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://uliwwpxoybupwleqqeki.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVsaXd3cHhveWJ1cHdsZXFxZWtpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgwMDM2MjQsImV4cCI6MjA2MzU3OTYyNH0.2_49CyBbyISRCo9fs5Q03K-MZfTpMoq3iDIiDe2x0sw'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)