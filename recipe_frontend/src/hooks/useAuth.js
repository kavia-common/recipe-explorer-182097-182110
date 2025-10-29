import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../supabaseClient';

/**
 * PUBLIC_INTERFACE
 * useAuth manages Supabase session, email OTP sign-in, signout, and profile upsert.
 */
export function useAuth() {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);
  const [error, setError] = useState(null);

  // Load session
  useEffect(() => {
    let mounted = true;
    async function init() {
      try {
        if (!supabase) return;
        const { data: { session: s } } = await supabase.auth.getSession();
        if (mounted) {
          setSession(s);
          setUser(s?.user ?? null);
        }
      } finally {
        setInitializing(false);
      }
    }
    init();

    const { data: subscription } = supabase?.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) {
        // Ensure profile exists
        upsertProfile(s.user).catch(() => {});
      }
    }) ?? { data: { subscription: null } };

    return () => {
      mounted = false;
      subscription?.unsubscribe?.();
    };
  }, []);

  const upsertProfile = useCallback(async (u) => {
    if (!supabase || !u) return;
    const defaultUsername = u.email?.split('@')[0] ?? 'user';
    const { error: upsertErr } = await supabase
      .from('profiles')
      .upsert({
        id: u.id,
        username: defaultUsername,
        avatar_url: null,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'id' });
    if (upsertErr) {
      // non-fatal
      // eslint-disable-next-line no-console
      console.warn('Profile upsert failed', upsertErr.message);
    }
  }, []);

  // PUBLIC_INTERFACE
  const signInWithEmail = useCallback(async (email) => {
    setError(null);
    if (!supabase) {
      setError('Supabase is not configured.');
      return { error: new Error('Supabase not configured') };
    }
    const redirectTo = process.env.REACT_APP_SITE_URL || window.location.origin;
    const { data, error: err } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: redirectTo }
    });
    if (err) setError(err.message);
    return { data, error: err };
  }, []);

  // PUBLIC_INTERFACE
  const signOut = useCallback(async () => {
    setError(null);
    if (!supabase) return;
    const { error: err } = await supabase.auth.signOut();
    if (err) setError(err.message);
  }, []);

  return { session, user, initializing, error, signInWithEmail, signOut };
}
