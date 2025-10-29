import { useEffect, useState } from 'react';
import { Layout } from '../components/Layout';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../supabaseClient';

/**
 * PUBLIC_INTERFACE
 * Profile shows and updates username and avatar_url in profiles table.
 */
export function Profile() {
  const { user } = useAuth();
  const [username, setUsername] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;
    async function load() {
      if (!supabase || !user) return;
      const { data } = await supabase.from('profiles').select('username, avatar_url').eq('id', user.id).single();
      if (active && data) {
        setUsername(data.username || '');
        setAvatarUrl(data.avatar_url || '');
      }
    }
    load();
    return () => { active = false; };
  }, [user?.id]);

  const save = async (e) => {
    e.preventDefault();
    if (!supabase || !user) return;
    setLoading(true);
    setStatus('');
    const { error } = await supabase.from('profiles').upsert({
      id: user.id,
      username,
      avatar_url: avatarUrl,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'id' });
    setLoading(false);
    setStatus(error ? `Error: ${error.message}` : 'Saved');
  };

  return (
    <Layout>
      {!user ? (
        <div className="section">Please login to view your profile.</div>
      ) : (
        <div className="section">
          <div className="title">Profile</div>
          <form onSubmit={save} className="grid" style={{ gap: 12 }}>
            <div>
              <label className="small text-muted">Email</label>
              <input className="input" value={user.email} disabled />
            </div>
            <div>
              <label className="small text-muted">Username</label>
              <input className="input" value={username} onChange={(e) => setUsername(e.target.value)} />
            </div>
            <div>
              <label className="small text-muted">Avatar URL</label>
              <input className="input" value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} />
            </div>
            <div className="flex items-center gap-2">
              <button className="btn btn-primary filled" type="submit" disabled={loading}>
                {loading ? <span className="spinner" /> : 'Save'}
              </button>
              {status && <span className="small text-muted">{status}</span>}
            </div>
          </form>
        </div>
      )}
    </Layout>
  );
}
