import { createClient } from '@supabase/supabase-js';

const url = process.env.REACT_APP_SUPABASE_URL;
const key = process.env.REACT_APP_SUPABASE_KEY;

/**
 * PUBLIC_INTERFACE
 * Returns a configured Supabase client instance.
 */
export const supabase = (url && key) ? createClient(url, key) : null;

/**
 * PUBLIC_INTERFACE
 * A React component that renders a visible banner if env vars are missing.
 */
export function EnvGuardBanner() {
  if (url && key) return null;
  return (
    <div className="container">
      <div className="env-banner">
        Missing Supabase configuration. Please set REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_KEY in your .env file.
      </div>
    </div>
  );
}
