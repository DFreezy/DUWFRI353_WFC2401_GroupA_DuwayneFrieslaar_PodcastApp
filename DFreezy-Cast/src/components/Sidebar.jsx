import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ isOpen, toggleSidebar, toggleTheme, isDarkMode, resetFavorites }) => {
  const handleResetFavorites = () => {
    resetFavorites();
    toggleSidebar(); // Close the sidebar after resetting favorites
  };

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <button className="close-btn" onClick={toggleSidebar}>×</button>
      
      <div className="theme-toggle">
        <label>
          <input type="checkbox" checked={isDarkMode} onChange={toggleTheme} />
          <span className="switch"></span>
        </label>
        <span>{isDarkMode ? 'Dark Mode' : 'Light Mode'}</span>
      </div>
      
      <div className="favorites-section">
        <h3>Favorites</h3>
        <Link to="/favoriteShow" onClick={toggleSidebar}>View Favorites</Link>
      </div>

      <div className="reset-section">
        <button onClick={handleResetFavorites}>Reset Favorites</button>
      </div>
    </div>
  );
};

export default Sidebar;
