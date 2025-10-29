import { EnvGuardBanner } from '../supabaseClient';
import { FavoritesPanel } from './FavoritesPanel';
import { Navbar } from './Navbar';

/**
 * PUBLIC_INTERFACE
 * Layout with top Navbar and responsive sidebar for Favorites.
 */
export function Layout({ sidebar, children }) {
  return (
    <>
      <Navbar />
      <EnvGuardBanner />
      <div className="container">
        <div className="layout">
          <aside>
            {sidebar ?? <FavoritesPanel />}
          </aside>
          <main>
            {children}
          </main>
        </div>
      </div>
    </>
  );
}
