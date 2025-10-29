import { useParams } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { useRecipeDetails } from '../hooks/useRecipes';
import { useAuth } from '../hooks/useAuth';
import { useFavorites } from '../hooks/useFavorites';

/**
 * PUBLIC_INTERFACE
 * RecipeDetails shows a recipe, ingredients, instructions and favorite toggle.
 */
export function RecipeDetails() {
  const { id } = useParams();
  const { recipe, loading, error } = useRecipeDetails(id);
  const { user } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites(user);

  const fav = recipe ? isFavorite(recipe.id) : false;

  return (
    <Layout>
      {loading && <div className="section"><span className="spinner" /> Loading...</div>}
      {error && <div className="section" style={{ borderColor: '#fecaca', background: '#fff1f2' }}>
        <div className="title" style={{ color: '#b91c1c' }}>Error</div>
        <div className="small">{error}</div>
      </div>}
      {recipe && (
        <div className="card">
          <img
            src={recipe.image_url || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200&auto=format&fit=crop'}
            alt={recipe.title}
            style={{ height: 280, objectFit: 'cover', width: '100%', borderBottom: '1px solid var(--color-border)' }}
          />
          <div style={{ padding: 16 }} className="grid" >
            <div className="flex items-center justify-between">
              <h1 className="title">{recipe.title}</h1>
              <button className={`btn btn-primary ${fav ? 'filled' : ''}`} onClick={() => toggleFavorite(recipe.id)}>
                {fav ? '★ Favorited' : '☆ Favorite'}
              </button>
            </div>
            <div className="mt-2 flex items-center gap-2">
              {recipe.cuisine && <span className="badge">{recipe.cuisine}</span>}
              {Array.isArray(recipe.tags) && recipe.tags.map(t => <span className="badge" key={t}>{t}</span>)}
            </div>
            <div className="grid" style={{ gridTemplateColumns: '1fr 2fr', gap: 16, marginTop: 12 }}>
              <div className="section">
                <div className="subtitle">Ingredients</div>
                <ul style={{ paddingLeft: 18 }}>
                  {(recipe.ingredients || []).map((ing, idx) => <li key={idx}>{ing}</li>)}
                </ul>
              </div>
              <div className="section">
                <div className="subtitle">Instructions</div>
                <ol style={{ paddingLeft: 18 }}>
                  {(recipe.instructions || []).map((step, idx) => <li key={idx} style={{ marginBottom: 8 }}>{step}</li>)}
                </ol>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
