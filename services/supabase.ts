
// This assumes the Supabase client is loaded via CDN in index.html
// and available on the window object.

const { createClient } = (window as any).supabase;

const supabaseUrl = 'https://ahrjjymgziwyicttzhvb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFocmpqeW1neml3eWljdHR6aHZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5OTU3ODksImV4cCI6MjA3NTU3MTc4OX0.VgMo2XeXAWJOGYlPAf-HHK4NKatAk5CzSWTNzLTagiI';

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Supabase URL and Key must be provided.");
}

export const supabase = createClient(supabaseUrl, supabaseKey);
