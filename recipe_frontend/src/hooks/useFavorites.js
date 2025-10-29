import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

/**
 * PUBLIC_INTERFACE
 * useFavorites lists and toggles favorites for the current user.
 */
export function useFavorites(user) {
  const [favorites, setFavorites] = useState([]); // array of recipe_id
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    if (!supabase || !user) { setFavorites([]); return; }
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('recipe_id')
        .eq('user_id', user.id);
      if (error) throw error;
      setFavorites((data || []).map(r => r.recipe_id));
    } catch {
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => { load(); }, [load]);

  // PUBLIC_INTERFACE
  const isFavorite = useCallback((recipeId) => {
    return favorites.includes(recipeId);
  }, [favorites]);

  // PUBLIC_INTERFACE
  const toggleFavorite = useCallback(async (recipeId) => {
    if (!supabase || !user) return { error: new Error('Not authenticated') };
    const currentlyFav = favorites.includes(recipeId);
    // optimistic update
    setFavorites(prev => currentlyFav ? prev.filter(id => id !== recipeId) : [...prev, recipeId]);

    try {
      if (currentlyFav) {
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('recipe_id', recipeId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('favorites')
          .upsert({ user_id: user.id, recipe_id: recipeId });
        if (error) throw error;
      }
      return { error: null };
    } catch (e) {
      // revert optimistic update
      setFavorites(prev => currentlyFav ? [...prev, recipeId] : prev.filter(id => id !== recipeId));
      return { error: e };
    }
  }, [user?.id, favorites]);

  return { favorites, isFavorite, toggleFavorite, reload: load, loading };
}
