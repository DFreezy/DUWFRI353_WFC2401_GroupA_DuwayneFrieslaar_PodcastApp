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
    // Load favorites from localStorage or initialize empty object
    const storedFavorites = localStorage.getItem('favorites');
    return storedFavorites ? JSON.parse(storedFavorites) : {};
  });

  // Update localStorage whenever favorites change
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const addToFavorites = (episode) => {
    const { showId } = episode;
    // Check if the showId already exists in favorites
    if (favorites[showId]) {
      // Update existing show's episodes array
      setFavorites({
        ...favorites,
        [showId]: [...favorites[showId], episode]
      });
    } else {
      // Initialize a new show entry with the first episode
      setFavorites({
        ...favorites,
        [showId]: [episode]
      });
    }
  };

  const removeFromFavorites = (episodeId) => {
    // Remove an episode from favorites based on its ID
    const updatedFavorites = { ...favorites };
    Object.keys(updatedFavorites).forEach(showId => {
      updatedFavorites[showId] = updatedFavorites[showId].filter(episode => episode.id !== episodeId);
    });
    setFavorites(updatedFavorites);
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
          
          <h1><img src="./images/DFreezy.png" class="logo"></img>🎙️DFREEZY CAST</h1>
          <Routes>
            <Route path="/" element={<ShowList addToFavorites={addToFavorites} />} />
            <Route path="/favoriteShow" element={<FavoriteShow favorites={favorites} removeFromFavorites={removeFromFavorites} />} />
            <Route path="/shows/:showId" element={<SeasonList addToFavorites={addToFavorites} />} />
            <Route path="/shows/:showId/episodes/:episodeId" element={<ShowDetails addToFavorites={addToFavorites} />} />
          </Routes>
        </div>
      </AudioProvider>
    </Router>
  );
};

export default App;
