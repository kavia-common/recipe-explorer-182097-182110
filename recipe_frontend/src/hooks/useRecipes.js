import { useCallback, useEffect, useMemo, useState } from 'react';
import { supabase } from '../supabaseClient';
import { DEFAULT_PAGE_SIZE } from '../utils/constants';

/**
 * PUBLIC_INTERFACE
 * useRecipes queries recipes with search, cuisine, tags and sort.
 */
export function useRecipes({ search, cuisine, tags, sort }) {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(0);
  const sortParts = useMemo(() => {
    const val = sort || 'created_at.desc';
    const [col, dir] = val.split('.');
    return { col, dir: (dir === 'asc') ? { ascending: true } : { ascending: false } };
  }, [sort]);

  const reload = useCallback(async () => {
    if (!supabase) { setRecipes([]); return; }
    setLoading(true);
    setError(null);
    try {
      let query = supabase.from('recipes').select('*', { count: 'exact' });

      if (search && search.trim().length > 0) {
        query = query.ilike('title', `%${search}%`);
      }
      if (cuisine) query = query.eq('cuisine', cuisine);
      if (tags && tags.length > 0) {
        // assumes recipes.tags is an array column
        query = query.contains('tags', tags);
      }
      query = query.order(sortParts.col, sortParts.dir)
        .range(page * DEFAULT_PAGE_SIZE, (page + 1) * DEFAULT_PAGE_SIZE - 1);

      const { data, error: err } = await query;
      if (err) throw err;
      setRecipes(data || []);
    } catch (e) {
      setError(e.message);
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  }, [search, cuisine, JSON.stringify(tags), sortParts, page]);

  useEffect(() => { setPage(0); }, [search, cuisine, JSON.stringify(tags), sort]);
  useEffect(() => { reload(); }, [reload]);

  return { recipes, loading, error, page, setPage, reload };
}

/**
 * PUBLIC_INTERFACE
 * useRecipeDetails fetches a single recipe by id.
 */
export function useRecipeDetails(id) {
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    if (!supabase || !id) { setRecipe(null); return; }
    setLoading(true);
    setError(null);
    try {
      const { data, error: err } = await supabase.from('recipes').select('*').eq('id', id).single();
      if (err) throw err;
      setRecipe(data);
    } catch (e) {
      setError(e.message);
      setRecipe(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { load(); }, [load]);

  return { recipe, loading, error, reload: load };
}
