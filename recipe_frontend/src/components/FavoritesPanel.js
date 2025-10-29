import { useAuth } from '../hooks/useAuth';
import { useEffect, useState } from 'react';
import { useFavorites } from '../hooks/useFavorites';
import { supabase } from '../supabaseClient';
import { Link } from 'react-router-dom';

/**
 * PUBLIC_INTERFACE
 * FavoritesPanel shows current user's favorite recipes.
 */
export function FavoritesPanel() {
  const { user } = useAuth();
  const { favorites } = useFavorites(user);
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    let active = true;
    async function load() {
      if (!supabase || !user || favorites.length === 0) { setRecipes([]); return; }
      const { data } = await supabase.from('recipes').select('id,title').in('id', favorites);
      if (active) setRecipes(data || []);
    }
    load();
    return () => { active = false; };
  }, [favorites, user?.id]);

  if (!user) {
    return (
      <div className="section">
        <div className="title">Favorites</div>
        <p className="text-muted small">Login to save favorites.</p>
      </div>
    );
  }

  return (
    <div className="section">
      <div className="title">Favorites</div>
      {recipes.length === 0 ? (
        <p className="text-muted small">No favorites yet.</p>
      ) : (
        <ul style={{ paddingLeft: 16, margin: '8px 0' }}>
          {recipes.map(r => (
            <li key={r.id} style={{ marginBottom: 8 }}>
              <Link to={`/recipe/${r.id}`}>{r.title}</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
