import { createClient } from '@supabase/supabase-js';

// Define your Supabase URL and API key (these can be stored in environment variables)
const supabaseUrl = "https://vqngbzzshkdmsdmzjsqg.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZxbmdienpzaGtkbXNkbXpqc3FnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjgxMjIwNjUsImV4cCI6MjA0MzY5ODA2NX0.AutaV-NCuBAmVwVGbkwESKylt1TCcuYq2koMFulsQ0A";

// Create and export the Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey);