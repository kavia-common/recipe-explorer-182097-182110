import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

/**
 * PUBLIC_INTERFACE
 * Navbar renders brand, login/logout, and profile link.
 */
export function Navbar() {
  const { user, signInWithEmail, signOut } = useAuth();
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setSending(true);
    const { error } = await signInWithEmail(email);
    setSending(false);
    if (!error) setSent(true);
  };

  return (
    <div className="navbar">
      <div className="nav-inner">
        <Link to="/" className="brand">
          <div className="brand-badge">🍳</div>
          <span>Recipe Explorer</span>
        </Link>

        <div className="nav-actions">
          <Link to="/profile" className="btn">
            Profile
          </Link>
          {user ? (
            <>
              <span className="badge">{user.email}</span>
              <button className="btn btn-danger" onClick={signOut}>Logout</button>
            </>
          ) : (
            <form onSubmit={handleLogin} className="flex items-center gap-2">
              <input
                type="email"
                required
                placeholder="Email to login"
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button className="btn btn-primary" type="submit" disabled={sending}>
                {sending ? <span className="spinner" /> : 'Send Magic Link'}
              </button>
              {sent && <span className="small text-muted">Check your inbox</span>}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
