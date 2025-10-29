import { Link } from 'react-router-dom';

/**
 * PUBLIC_INTERFACE
 * RecipeCard shows brief recipe info.
 * Props:
 * - recipe: { id, title, image_url, cuisine, tags[] }
 * - isFavorite(id): boolean
 * - onToggleFavorite(id): void
 */
export function RecipeCard({ recipe, isFavorite, onToggleFavorite }) {
  if (!recipe) return null;
  const { id, title, image_url, cuisine, tags = [] } = recipe;
  const fav = typeof isFavorite === 'function' ? isFavorite(id) : false;

  return (
    <div className="card recipe-card">
      <img
        src={image_url || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200&auto=format&fit=crop'}
        alt={title}
      />
      <div style={{ padding: 12 }}>
        <div className="flex items-center justify-between">
          <Link to={`/recipe/${id}`} className="subtitle">{title}</Link>
          <button
            className={`btn btn-primary ${fav ? 'filled' : ''}`}
            onClick={() => onToggleFavorite?.(id)}
            aria-label={fav ? 'Remove from favorites' : 'Add to favorites'}
          >
            {fav ? '★ Favorite' : '☆ Favorite'}
          </button>
        </div>
        <div className="mt-2 flex items-center gap-2">
          {cuisine && <span className="badge">{cuisine}</span>}
          {Array.isArray(tags) && tags.slice(0, 3).map((t) => (
            <span key={t} className="badge">{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
