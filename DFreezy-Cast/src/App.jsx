import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ShowList from './components/ShowLists';
import SeasonList from './components/SeasonLists';
import FavoriteShow from './components/FavoriteShow';
import Sidebar from './components/Sidebar';
import ShowDetails from './components/ShowDetail';
import SignIn from './components/SignIn'; // Import SignIn component
import { AudioProvider } from './components/AudioContexts';
import './App.css';

const App = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [favorites, setFavorites] = useState(() => {
    const storedFavorites = localStorage.getItem('favorites');
    return storedFavorites ? JSON.parse(storedFavorites) : {};
  });
  const [isSignedIn, setIsSignedIn] = useState(false); // State to track sign-in status

  useEffect(() => {
    // Check if user is signed in (you can implement your own logic here)
    const userSignedIn = localStorage.getItem('isSignedIn');
    setIsSignedIn(!!userSignedIn); // Convert to boolean
  }, []);

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

  const handleSignIn = (credentials) => {
    // Perform sign-in logic (e.g., validation, API call)
    console.log('Signing in with:', credentials);
    // Simulate successful sign-in
    localStorage.setItem('isSignedIn', true);
    setIsSignedIn(true);
  };

  const handleSignOut = () => {
    // Perform sign-out logic
    console.log('Signing out');
    localStorage.removeItem('isSignedIn');
    setIsSignedIn(false);
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
          <h1><img src="./images/DFreezy.png" className="logo" alt="DFreezy Logo" />🎙️DFREEZY CAST</h1>
          <Routes>
            {/* Route for SignIn component */}
            <Route path="/signin" element={<SignIn onSignIn={handleSignIn} />} />
            {/* Protected routes */}
            {isSignedIn ? (
              <>
                <Route path="/" element={<ShowList addToFavorites={addToFavorites} />} />
                <Route path="/favoriteShow" element={<FavoriteShow favorites={favorites} removeFromFavorites={removeFromFavorites} />} />
                <Route path="/shows/:showId" element={<SeasonList addToFavorites={addToFavorites} />} />
                <Route path="/shows/:showId/episodes/:episodeId" element={<ShowDetails addToFavorites={addToFavorites} />} />
              </>
            ) : (
              // Redirect to sign-in page if not signed in
              <Route path="*" element={<SignIn onSignIn={handleSignIn} />} />
            )}
          </Routes>
        </div>
      </AudioProvider>
    </Router>
  );
};

export default App;
