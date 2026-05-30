import React, { useEffect, useMemo, useState } from 'react';
import AppRoutes from './routes/AppRoutes';
import Navbar from './components/Navbar';

function App() {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('survey-theme');
    if (savedTheme === 'dark' || savedTheme === 'light') {
      return savedTheme;
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('survey-theme', theme);
  }, [theme]);

  const handleThemeToggle = useMemo(
    () => () => setTheme((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark')),
    []
  );

  return (
    <div className="app-shell">
      <div className="app-orb app-orb-left" />
      <div className="app-orb app-orb-right" />

      <Navbar theme={theme} onThemeToggle={handleThemeToggle} />
      <main className="app-main container">
        <AppRoutes />
      </main>
    </div>
  );
}

export default App;
