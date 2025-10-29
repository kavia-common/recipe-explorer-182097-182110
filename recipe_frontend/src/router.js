import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { RecipeDetails } from './pages/RecipeDetails';
import { Profile } from './pages/Profile';

/**
 * PUBLIC_INTERFACE
 * AppRouter registers all application routes.
 */
export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Home />} />
        <Route path="/recipe/:id" element={<RecipeDetails />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}
