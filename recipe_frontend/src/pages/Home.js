import { useState } from 'react';
import { Layout } from '../components/Layout';
import { SearchBar } from '../components/SearchBar';
import { Filters } from '../components/Filters';
import { useRecipes } from '../hooks/useRecipes';
import { useAuth } from '../hooks/useAuth';
import { useFavorites } from '../hooks/useFavorites';
import { RecipeCard } from '../components/RecipeCard';

/**
 * PUBLIC_INTERFACE
 * Home page: search, filters, and recipe grid.
 */
export function Home() {
  const [search, setSearch] = useState('');
  const [filterState, setFilterState] = useState({ cuisine: '', tags: [], sort: 'created_at.desc' });
  const { recipes, loading, error } = useRecipes({ search, ...filterState });
  const { user } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites(user);

  return (
    <Layout>
      <div className="grid" style={{ gap: 16 }}>
        <SearchBar defaultValue="" onChange={setSearch} />
        <Filters onChange={setFilterState} />
        {error && (
          <div className="section" style={{ borderColor: '#fecaca', background: '#fff1f2' }}>
            <div className="title" style={{ color: '#b91c1c' }}>Error</div>
            <div className="small">{error}</div>
          </div>
        )}
        {loading && <div className="section"><span className="spinner" /> Loading...</div>}
        {!loading && recipes.length === 0 && (
          <div className="section">
            <div className="title">No recipes</div>
            <div className="text-muted small">Try adjusting your search or filters. If the database is empty, add some recipes in Supabase.</div>
          </div>
        )}
        <div className="grid recipes">
          {recipes.map(r => (
            <RecipeCard
              key={r.id}
              recipe={r}
              isFavorite={isFavorite(r.id)}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </div>
      </div>
    </Layout>
  );
}
