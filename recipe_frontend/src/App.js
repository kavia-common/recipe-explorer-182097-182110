import React from 'react';
import './App.css';
import { AppRouter } from './router';

/**
 * PUBLIC_INTERFACE
 * Root App renders the app shell and routes.
 */
function App() {
  return (
    <div className="app-shell">
      <AppRouter />
    </div>
  );
}

export default App;
