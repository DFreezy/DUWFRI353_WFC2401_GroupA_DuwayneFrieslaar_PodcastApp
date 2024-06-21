import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Favorites.css';

const FavoriteShow = ({ favorites, removeFromFavorites }) => {
  const [sortBy, setSortBy] = useState('title'); 
  const [sortDirection, setSortDirection] = useState('asc');
  const [seasonsMap, setSeasonsMap] = useState({}); // State to store season details

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    // Fetch and store all season details for the favorite episodes
    const fetchSeasonDetails = async () => {
      try {
        const seasonIds = [...new Set(Object.values(favorites).flat().map(episode => episode.seasonId))];
        const seasonPromises = seasonIds.map(seasonId => axios.get(`https://podcast-api.netlify.app/seasons/${seasonId}`));
        const seasonResponses = await Promise.all(seasonPromises);
        const seasonDetailsMap = seasonResponses.reduce((acc, response) => {
          acc[response.data.id] = response.data;
          return acc;
        }, {});
        setSeasonsMap(seasonDetailsMap);
      } catch (error) {
        console.error('Error fetching season details:', error);
      }
    };

    fetchSeasonDetails();
  }, [favorites]);

  const handleSortChange = (e) => {
    const { value } = e.target;
    setSortBy(value);
    setSortDirection(value === sortBy ? (sortDirection === 'asc' ? 'desc' : 'asc') : 'asc');
  };

  const sortedEpisodes = [...Object.values(favorites).flat()].sort((a, b) => {
    if (sortBy === 'title') {
      return sortDirection === 'asc' ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title);
    } else if (sortBy === 'titleDesc') {
      return sortDirection === 'asc' ? b.title.localeCompare(a.title) : a.title.localeCompare(b.title);
    } else if (sortBy === 'updated') {
      return sortDirection === 'asc' ? new Date(a.updated) - new Date(b.updated) : new Date(b.updated) - new Date(a.updated);
    } else if (sortBy === 'updatedDesc') {
      return sortDirection === 'asc' ? new Date(b.updated) - new Date(a.updated) : new Date(a.updated) - new Date(b.updated);
    }
    return a.title.localeCompare(b.title);
  });

  return (
    <div className="FavoriteShow">
      <h2>Favorite Episodes</h2>
      {Object.keys(favorites).length === 0 ? (
        <p>No favorite episodes selected.</p>
      ) : (
        <div>
          <div className="sort-controls">
            <select value={sortBy} onChange={handleSortChange}>
              <option value="title">Sort by Title {sortDirection === 'asc' ? 'A-Z' : 'Z-A'}</option>
              <option value="updated">Sort by Newest Updated</option>
              <option value="updatedDesc">Sort by Furthest Back Updated</option>
              <option value="titleDesc">Sort by Title Z-A</option>
            </select>
          </div>
          <ul className="FavoritesList">
            {sortedEpisodes.map((episode) => (
              <li key={episode.id} className="FavoriteItem">
                <div>
                  <h3>{episode.title}</h3>
                  <p>{episode.description}</p>
                  <p>Show: {episode.showTitle}</p>
                  <p>Season: {seasonsMap[episode.seasonId]?.seasonNumber}</p> {/* Display season number */}
                  <p>Added on: {new Date(episode.dateAdded).toLocaleString()}</p>
                  <Link to={`/shows/${episode.showId}`} className="ShowLink">
                    <img
                      src={episode.image}
                      alt={episode.title}
                      className="ShowImage"
                    />
                    <p>{episode.showTitle}</p>
                  </Link>
                  <button onClick={() => removeFromFavorites(episode.id)}>
                    Remove from Favorites
                  </button>
                </div>
                <audio controls>
                  <source
                    src={episode.audioUrl || 'https://podcast-api.netlify.app/placeholder-audio.mp3'}
                    type="audio/mpeg"
                  />
                  Your browser does not support the audio element.
                </audio>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FavoriteShow;
