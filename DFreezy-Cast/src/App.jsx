import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ShowList from './components/ShowLists';
import SeasonList from './components/SeasonLists';
import FavoriteShow from './components/FavoriteShow';
import Sidebar from './components/Sidebar';
import ShowDetails from './components/ShowDetail';
import { AudioProvider } from './components/AudioContexts';
import './App.css';

const App = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [favorites, setFavorites] = useState(() => {
    const storedFavorites = localStorage.getItem('favorites');
    return storedFavorites ? JSON.parse(storedFavorites) : {};
  });

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleSidebar = () => {
    setIsSidebarOpen(prevState => !prevState);
  };

  const toggleTheme = () => {
    setIsDarkMode(prevState => !prevState);
  };

  const addToFavorites = (episode) => {
    const { showId } = episode;
    const timestamp = new Date().toISOString();

    const episodeWithTimestamp = {
      ...episode,
      dateAdded: timestamp,
    };

    setFavorites(prevFavorites => {
      if (prevFavorites[showId]) {
        return {
          ...prevFavorites,
          [showId]: [...prevFavorites[showId], episodeWithTimestamp],
        };
      } else {
        return {
          ...prevFavorites,
          [showId]: [episodeWithTimestamp],
        };
      }
    });
  };

  const removeFromFavorites = (episodeId) => {
    setFavorites(prevFavorites => {
      const updatedFavorites = { ...prevFavorites };
      Object.keys(updatedFavorites).forEach(showId => {
        updatedFavorites[showId] = updatedFavorites[showId].filter(episode => episode.id !== episodeId);
      });
      return updatedFavorites;
    });
  };

  return (
    <Router>
      <AudioProvider>
        <div className={`App ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
          <button className="sidebar-toggle-btn" onClick={toggleSidebar} aria-label="Toggle Sidebar">
            ☰
          </button>
          <Sidebar
            isOpen={isSidebarOpen}
            toggleSidebar={toggleSidebar}
            toggleTheme={toggleTheme}
            isDarkMode={isDarkMode}
          />
          <header>
            <h1><img src="./images/DFreezy.png" className="logo" alt="DFreezy Logo" />🎙️DFREEZY CAST</h1>
          </header>
          <main className="main-content">
            <Routes>
              <Route path="/" element={<ShowList addToFavorites={addToFavorites} />} />
              <Route path="/favoriteShow" element={<FavoriteShow favorites={favorites} removeFromFavorites={removeFromFavorites} />} />
              <Route path="/shows/:showId" element={<SeasonList addToFavorites={addToFavorites} />} />
              <Route path="/shows/:showId/episodes/:episodeId" element={<ShowDetails addToFavorites={addToFavorites} />} />
            </Routes>
          </main>
        </div>
      </AudioProvider>
    </Router>
  );
};

export default App;
