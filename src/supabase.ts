import { createClient } from '@supabase/supabase-js'

// PLACEHOLDERS: Replace with your actual Supabase URL and Anon Key
const SUPABASE_URL = 'https://edjlrdxxzykxvslwbuak.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVkamxyZHh4enlreHZzbHdidWFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQwMTE0NTAsImV4cCI6MjA3OTU4NzQ1MH0.LYhKVPhm-E6mrosk0bWtODxdkLxU99NWxeWJDAMP_HM'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
