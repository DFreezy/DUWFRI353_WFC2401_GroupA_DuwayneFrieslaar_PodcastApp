import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './ShowList.css';

const API_BASE_URL = 'https://podcast-api.netlify.app';
const GENRE_IDS = {
  1: 'Personal Growth',
  2: 'Investigative Journalism',
  3: 'History',
  4: 'Comedy',
  5: 'Entertainment',
  6: 'Business',
  7: 'Fiction',
  8: 'News',
  9: 'Kids and Family'
};

const ShowList = ({ addToFavorites }) => {
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('title');
  const [sortDirection, setSortDirection] = useState('asc');
  const [filterText, setFilterText] = useState('');

  useEffect(() => {
    const fetchShows = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/shows`);
        setShows(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching shows:', error);
        setLoading(false);
      }
    };

    fetchShows();
  }, []);

  const handleSortChange = (e) => {
    const { value } = e.target;
    if (value === sortBy) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(value);
      setSortDirection('asc');
    }
  };

  const handleFilterChange = (e) => {
    setFilterText(e.target.value);
  };

  const filteredAndSortedShows = [...shows]
    .filter((show) =>
      show.title.toLowerCase().includes(filterText.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'title') {
        return sortDirection === 'asc'
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      } else if (sortBy === 'titleDesc') {
        return sortDirection === 'asc'
          ? b.title.localeCompare(a.title) // Sort Z-A
          : a.title.localeCompare(b.title); // Sort A-Z
      } else if (sortBy === 'updated') {
        return sortDirection === 'asc'
          ? new Date(a.updated) - new Date(b.updated)
          : new Date(b.updated) - new Date(a.updated);
      } else if (sortBy === 'updatedDesc') {
        return sortDirection === 'asc'
          ? new Date(b.updated) - new Date(a.updated)
          : new Date(a.updated) - new Date(b.updated);
      }
      return a.title.localeCompare(b.title); // Default to sort by title
    });

  return (
    <div className="ShowList">
      <div className="controls">
        <input
          type="text"
          placeholder="Filter shows..."
          value={filterText}
          onChange={handleFilterChange}
        />
        <select value={sortBy} onChange={handleSortChange}>
          <option value="title">Sort by Title A-Z</option>
          <option value="titleDesc">Sort by Title Z-A</option>
          <option value="updated">Sort by Newest Updated</option>
          <option value="updatedDesc">Sort by Furthest Back Updated</option>
        </select>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className="ShowGrid">
          {filteredAndSortedShows.map((show) => (
            <li key={show.id} className="ShowCard">
              <Link to={`/shows/${show.id}`} className="ShowLink">
                <img src={show.image} alt={show.title} className="ShowImage" />
                <h3>{show.title}</h3>
                <p>Seasons: {show.seasons}</p>
                <p>Genre: {show.genre}</p>
                <p>
                  Last Updated:{' '}
                  {show.updated
                    ? new Date(show.updated).toLocaleDateString()
                    : 'N/A'}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ShowList;
