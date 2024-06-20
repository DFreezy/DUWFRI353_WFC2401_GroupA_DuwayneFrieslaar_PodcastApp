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
  const [shows, setShows] = useState([]); // State to hold list of shows
  const [loading, setLoading] = useState(true); // State to manage loading status
  const [sortBy, setSortBy] = useState('title'); // State for sorting criteria
  const [sortDirection, setSortDirection] = useState('asc'); // State for sorting direction
  const [filterText, setFilterText] = useState(''); // State for filtering text

  useEffect(() => {
    // Effect to fetch shows from API on component mount
    const fetchShows = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/shows`);
        setShows(response.data); // Set shows state with fetched data
        setLoading(false); // Set loading to false after data is fetched
      } catch (error) {
        console.error('Error fetching shows:', error); // Log error if fetching fails
        setLoading(false); // Set loading to false in case of error
      }
    };

    fetchShows(); // Invoke fetchShows function on component mount
  }, []);

  const handleSortChange = (e) => {
    const { value } = e.target;
    if (value === sortBy) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc'); // Toggle sort direction if same criteria selected
    } else {
      setSortBy(value); // Set new sort criteria
      setSortDirection('asc'); // Reset sort direction to ascending
    }
  };

  const handleFilterChange = (e) => {
    setFilterText(e.target.value); // Update filter text state on input change
  };

  // Function to filter and sort shows based on current criteria
  const filteredAndSortedShows = [...shows]
    .filter((show) =>
      show.title.toLowerCase().includes(filterText.toLowerCase()) // Filter shows by title based on filterText
    )
    .sort((a, b) => {
      // Sort shows based on sortBy and sortDirection
      if (sortBy === 'title') {
        return sortDirection === 'asc'
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      } else if (sortBy === 'titleDesc') {
        return sortDirection === 'asc'
          ? b.title.localeCompare(a.title)
          : a.title.localeCompare(b.title);
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
        <p>Loading...</p> // Show loading message while fetching shows
      ) : (
        <div className="ShowGrid">
          {filteredAndSortedShows.map((show) => (
            <Link to={`/shows/${show.id}`} className="ShowCard" key={show.id}>
              <img src={show.image} alt={show.title} className="ShowImage" /> {/* Show image */}
              <div className="ShowDetails">
                <h3>{show.title}</h3> {/* Show title */}
                <p>Seasons: {show.seasons}</p> {/* Number of seasons */}
                <p>Genre: {GENRE_IDS[show.genre]}</p> {/* Genre based on GENRE_IDS */}
                <p>
                  Last Updated:{' '}
                  {show.updated
                    ? new Date(show.updated).toLocaleDateString()
                    : 'N/A'} {/* Last updated date */}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShowList;
