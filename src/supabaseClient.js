import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://lvroveysnfgmqtdyayiu.supabase.co'
const supabaseAnonKey = '***REMOVED***'
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
