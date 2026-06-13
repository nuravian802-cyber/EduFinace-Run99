import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ocixfbdiyfqzvjizynus.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9jaXhmYmRpeWZxenZqaXp5bnVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEyNTI5MzcsImV4cCI6MjA5NjgyODkzN30.2QWi3HFA6EEG2tcw_zKKORYey0AN0uDqPnhyXBXclnA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
